// Input validation utilities

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface PostInput {
    title: string;
    description: string;
    category: string;
    city: string;
    area?: string;
    lat?: number;
    lng?: number;
    contact?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    urgency?: string;
    images?: Array<{ url: string; public_id?: string }>;
}

// Sanitize HTML to prevent XSS
export function sanitizeText(text: string): string {
    if (!text) return '';
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

// Validate post input
export function validatePostInput(data: PostInput): ValidationResult {
    const errors: string[] = [];

    // Title validation
    if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
    } else if (data.title.length > 150) {
        errors.push('Title cannot exceed 150 characters');
    }

    // Description validation
    if (!data.description || data.description.trim().length === 0) {
        errors.push('Description is required');
    } else if (data.description.length > 2000) {
        errors.push('Description cannot exceed 2000 characters');
    }

    // Category validation
    const validCategories = ['Help Needed', 'Item Lost', 'Blood Needed', 'Offer'];
    if (!data.category || !validCategories.includes(data.category)) {
        errors.push('Valid category is required (Help Needed, Item Lost, Blood Needed, or Offer)');
    }

    // City validation
    if (!data.city || data.city.trim().length === 0) {
        errors.push('City is required');
    }

    // Urgency validation
    if (data.urgency) {
        const validUrgency = ['Low', 'Medium', 'High'];
        if (!validUrgency.includes(data.urgency)) {
            errors.push('Urgency must be Low, Medium, or High');
        }
    }

    // Coordinates validation
    if (data.lat !== undefined || data.lng !== undefined) {
        if (data.lat !== undefined && (data.lat < -90 || data.lat > 90)) {
            errors.push('Invalid latitude (must be between -90 and 90)');
        }
        if (data.lng !== undefined && (data.lng < -180 || data.lng > 180)) {
            errors.push('Invalid longitude (must be between -180 and 180)');
        }
    }

    // Contact validation
    if (data.contact) {
        if (data.contact.phone && !/^[+]?[\d\s-]{10,15}$/.test(data.contact.phone)) {
            errors.push('Invalid phone number format');
        }
        if (data.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
            errors.push('Invalid email format');
        }
    }

    // Images validation
    if (data.images && data.images.length > 5) {
        errors.push('Maximum 5 images allowed');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validate email
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone
export function isValidPhone(phone: string): boolean {
    return /^[+]?[\d\s-]{10,15}$/.test(phone);
}

// Validate MongoDB ObjectId
export function isValidObjectId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
}

// Rate limiting helper (simple in-memory, use Redis for production)
const ipRequestCounts: Map<string, { count: number; resetTime: number }> = new Map();

export function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = ipRequestCounts.get(ip);

    if (!record || now > record.resetTime) {
        ipRequestCounts.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxRequests) {
        return false;
    }

    record.count++;
    return true;
}
