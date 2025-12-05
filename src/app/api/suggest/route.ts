import { NextRequest, NextResponse } from 'next/server';
import { analyzePriority } from '@/lib/priorityEngine';

// POST /api/suggest - Get smart category/urgency suggestions
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.title && !body.description) {
            return NextResponse.json(
                { error: 'Title or description is required' },
                { status: 400 }
            );
        }

        const suggestion = analyzePriority(
            body.title || '',
            body.description || ''
        );

        return NextResponse.json(suggestion);
    } catch (error) {
        console.error('POST /api/suggest error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze text' },
            { status: 500 }
        );
    }
}
