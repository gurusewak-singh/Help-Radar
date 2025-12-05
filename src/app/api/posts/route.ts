import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { validatePostInput, sanitizeText, checkRateLimit } from '@/lib/validators';
import { analyzePriority } from '@/lib/priorityEngine';
import { uploadImage, UploadResult } from '@/lib/cloudinary';

// GET /api/posts - List posts with filters, search, and pagination
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const searchParams = request.nextUrl.searchParams;
        const city = searchParams.get('city');
        const category = searchParams.get('category');
        const urgency = searchParams.get('urgency');
        const q = searchParams.get('q'); // Search query
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
        const sort = searchParams.get('sort') || 'recent'; // 'recent', 'priority', 'nearest'
        const lat = parseFloat(searchParams.get('lat') || '');
        const lng = parseFloat(searchParams.get('lng') || '');
        const status = searchParams.get('status') || 'active';
        const userId = searchParams.get('userId'); // Filter by creator
        const userEmail = searchParams.get('userEmail'); // Filter by creator's email (for contact.email match)

        // Build filter object
        const filter: Record<string, unknown> = { status };

        if (city) filter.city = { $regex: new RegExp(city, 'i') };
        if (category) filter.category = category;
        if (urgency) filter.urgency = urgency;
        if (userId) filter.createdBy = userId;
        if (userEmail) filter['contact.email'] = userEmail;

        // Text search
        if (q) {
            filter.$or = [
                { title: { $regex: new RegExp(q, 'i') } },
                { description: { $regex: new RegExp(q, 'i') } }
            ];
        }

        const skip = (Math.max(1, page) - 1) * limit;

        // Build sort object
        let sortObj: Record<string, number> = { createdAt: -1 };
        if (sort === 'priority') {
            sortObj = { priority: -1, createdAt: -1 };
        } else if (sort === 'oldest') {
            sortObj = { createdAt: 1 };
        }

        // Execute query
        let posts;

        if (sort === 'nearest' && !isNaN(lat) && !isNaN(lng)) {
            // Geo-based sorting
            posts = await Post.aggregate([
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: [lng, lat] },
                        distanceField: 'distance',
                        spherical: true,
                        query: filter
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]);
        } else {
            posts = await Post.find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean();
        }

        const total = await Post.countDocuments(filter);

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        });
    } catch (error) {
        console.error('GET /api/posts error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        if (!checkRateLimit(ip, 5, 60000)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        await dbConnect();

        const body = await request.json();

        // Upload images to Cloudinary
        const uploadedImages: UploadResult[] = [];
        if (Array.isArray(body.images) && body.images.length > 0) {
            for (const img of body.images) {
                if (img.url && img.url.startsWith('data:')) {
                    // Upload base64 image to Cloudinary
                    try {
                        const result = await uploadImage(img.url, 'helpradar/posts');
                        uploadedImages.push(result);
                    } catch (uploadError) {
                        console.error('Image upload failed:', uploadError);
                        // Continue without this image
                    }
                } else if (img.url && img.url.startsWith('http')) {
                    // Image is already a URL, keep it
                    uploadedImages.push({ url: img.url, public_id: img.public_id || '' });
                }
            }
        }

        // Sanitize inputs
        const sanitizedData = {
            title: sanitizeText(body.title),
            description: sanitizeText(body.description),
            category: body.category,
            city: sanitizeText(body.city),
            area: body.area ? sanitizeText(body.area) : undefined,
            lat: body.lat,
            lng: body.lng,
            contact: body.contact ? {
                name: body.contact.name ? sanitizeText(body.contact.name) : undefined,
                phone: body.contact.phone,
                email: body.contact.email
            } : undefined,
            urgency: body.urgency,
            images: uploadedImages
        };

        // Validate input
        const validation = validatePostInput(sanitizedData);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.errors },
                { status: 400 }
            );
        }

        // Smart category/urgency suggestion if not provided
        if (!sanitizedData.urgency || sanitizedData.urgency === 'Medium') {
            const suggestion = analyzePriority(sanitizedData.title, sanitizedData.description);
            if (suggestion.confidenceScore > 50) {
                sanitizedData.urgency = sanitizedData.urgency || suggestion.suggestedUrgency;
            }
        }

        // Create post
        const postData: Record<string, unknown> = {
            ...sanitizedData,
            status: 'active',
            views: 0,
            reported: 0,
            createdBy: body.userId || null // Store the user ID who created the post
        };

        // Add location if coordinates provided
        if (sanitizedData.lat && sanitizedData.lng) {
            postData.location = {
                type: 'Point',
                coordinates: [sanitizedData.lng, sanitizedData.lat]
            };
        }

        // Set expiry
        const expiryDays = parseInt(process.env.POST_EXPIRY_DAYS || '7');
        postData.expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

        console.log('Creating post with data:', JSON.stringify(postData, null, 2));

        const post = new Post(postData);

        // Validate the post before saving
        const validationError = post.validateSync();
        if (validationError) {
            console.error('Mongoose validation error:', validationError);
            return NextResponse.json(
                { error: 'Validation failed', details: validationError.message },
                { status: 400 }
            );
        }

        await post.save();

        return NextResponse.json({ post, message: 'Post created successfully' }, { status: 201 });
    } catch (error) {
        console.error('POST /api/posts error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', errorMessage);
        return NextResponse.json(
            { error: 'Failed to create post', details: errorMessage },
            { status: 500 }
        );
    }
}
