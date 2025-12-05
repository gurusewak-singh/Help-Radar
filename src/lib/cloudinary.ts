import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
    url: string;
    public_id: string;
}

/**
 * Upload a base64 image to Cloudinary
 * @param base64Image - The base64 encoded image string (with or without data URI prefix)
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with the uploaded image URL and public_id
 */
export async function uploadImage(base64Image: string, folder: string = 'helpradar'): Promise<UploadResult> {
    try {
        // Ensure the image has the data URI prefix
        const imageData = base64Image.startsWith('data:') 
            ? base64Image 
            : `data:image/jpeg;base64,${base64Image}`;

        const result = await cloudinary.uploader.upload(imageData, {
            folder,
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' }, // Limit max dimensions
                { quality: 'auto:good' }, // Auto quality optimization
                { fetch_format: 'auto' } // Auto format (webp where supported)
            ]
        });

        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
}

/**
 * Upload multiple images to Cloudinary
 * @param base64Images - Array of base64 encoded image strings
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with array of uploaded image URLs and public_ids
 */
export async function uploadMultipleImages(
    base64Images: string[], 
    folder: string = 'helpradar'
): Promise<UploadResult[]> {
    const uploadPromises = base64Images.map(img => uploadImage(img, folder));
    return Promise.all(uploadPromises);
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public_id of the image to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image');
    }
}

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of public_ids to delete
 */
export async function deleteMultipleImages(publicIds: string[]): Promise<void> {
    try {
        await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
        console.error('Cloudinary bulk delete error:', error);
        throw new Error('Failed to delete images');
    }
}

export default cloudinary;
