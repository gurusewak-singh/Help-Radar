// Smart Priority Engine - AI-like keyword analysis for automatic categorization and priority

interface PrioritySuggestion {
    suggestedCategory: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
    suggestedUrgency: 'Low' | 'Medium' | 'High';
    confidenceScore: number; // 0-100
    detectedKeywords: string[];
    reasoning: string;
}

// Keyword dictionaries
const KEYWORDS = {
    HIGH_URGENCY: [
        'urgent', 'emergency', 'critical', 'asap', 'immediately', 'dying',
        'accident', 'hospital', 'life-threatening', 'serious', 'desperate',
        'please help', 'need now', 'right now', 'today only', '911'
    ],
    MEDIUM_URGENCY: [
        'soon', 'quickly', 'fast', 'needed', 'important', 'help needed',
        'required', 'looking for', 'seeking'
    ],
    BLOOD_CATEGORY: [
        'blood', 'donor', 'donation', 'transfusion', 'plasma', 'platelets',
        'a+', 'b+', 'o+', 'ab+', 'a-', 'b-', 'o-', 'ab-',
        'a positive', 'b positive', 'o positive', 'ab positive',
        'a negative', 'b negative', 'o negative', 'ab negative',
        'blood bank', 'blood type', 'blood group', 'units of blood'
    ],
    LOST_CATEGORY: [
        'lost', 'missing', 'stolen', 'forgot', 'left behind', 'misplaced',
        'wallet', 'phone', 'keys', 'bag', 'laptop', 'id card', 'passport',
        'reward', 'finder', 'if found', 'please return', 'last seen',
        'lost and found', 'dropped'
    ],
    OFFER_CATEGORY: [
        'offer', 'free', 'donate', 'giving away', 'volunteer', 'help available',
        'available', 'can help', 'willing to', 'providing', 'sharing',
        'teaching', 'tutoring', 'mentoring', 'assistance offered',
        'food distribution', 'free service', 'pro bono'
    ],
    HELP_CATEGORY: [
        'need help', 'help needed', 'looking for', 'seeking', 'required',
        'assistance', 'support', 'aid', 'elderly', 'senior citizen',
        'disability', 'medical', 'medicine', 'grocery', 'food',
        'shelter', 'accommodation', 'transport', 'ride'
    ]
};

// Calculate priority score for a post
export function calculatePriorityScore(
    category: string,
    urgency: string,
    createdAt: Date,
    views: number = 0,
    reported: number = 0
): number {
    let score = 0;

    // Base urgency score (0-100)
    const urgencyScores: Record<string, number> = {
        'High': 100,
        'Medium': 50,
        'Low': 20
    };
    score += urgencyScores[urgency] || 50;

    // Category bonus (Blood Needed is most critical)
    const categoryScores: Record<string, number> = {
        'Blood Needed': 50,
        'Help Needed': 30,
        'Item Lost': 20,
        'Offer': 10
    };
    score += categoryScores[category] || 20;

    // Recency boost (decays over 48 hours)
    const hoursOld = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
    const recencyBoost = Math.max(0, 50 - (hoursOld * 1.04)); // Decays to 0 in ~48 hours
    score += recencyBoost;

    // Engagement factor (views indicate interest)
    const engagementBoost = Math.min(20, views * 0.5);
    score += engagementBoost;

    // Penalty for reported posts
    score -= reported * 10;

    return Math.max(0, Math.round(score));
}

// Analyze text and suggest category/urgency
export function analyzePriority(title: string, description: string): PrioritySuggestion {
    const text = `${title} ${description}`.toLowerCase();
    const detectedKeywords: string[] = [];
    const reasons: string[] = [];

    // Check for high urgency keywords
    let urgencyScore = 0;
    KEYWORDS.HIGH_URGENCY.forEach(keyword => {
        if (text.includes(keyword)) {
            urgencyScore += 2;
            detectedKeywords.push(keyword);
        }
    });
    KEYWORDS.MEDIUM_URGENCY.forEach(keyword => {
        if (text.includes(keyword)) {
            urgencyScore += 1;
            detectedKeywords.push(keyword);
        }
    });

    // Determine urgency
    let suggestedUrgency: 'Low' | 'Medium' | 'High' = 'Medium';
    if (urgencyScore >= 3) {
        suggestedUrgency = 'High';
        reasons.push('High urgency keywords detected');
    } else if (urgencyScore <= 0) {
        suggestedUrgency = 'Low';
        reasons.push('No urgency indicators found');
    }

    // Category scoring
    const categoryScores = {
        'Blood Needed': 0,
        'Item Lost': 0,
        'Offer': 0,
        'Help Needed': 0
    };

    KEYWORDS.BLOOD_CATEGORY.forEach(keyword => {
        if (text.includes(keyword)) {
            categoryScores['Blood Needed'] += 3;
            if (!detectedKeywords.includes(keyword)) detectedKeywords.push(keyword);
        }
    });

    KEYWORDS.LOST_CATEGORY.forEach(keyword => {
        if (text.includes(keyword)) {
            categoryScores['Item Lost'] += 2;
            if (!detectedKeywords.includes(keyword)) detectedKeywords.push(keyword);
        }
    });

    KEYWORDS.OFFER_CATEGORY.forEach(keyword => {
        if (text.includes(keyword)) {
            categoryScores['Offer'] += 2;
            if (!detectedKeywords.includes(keyword)) detectedKeywords.push(keyword);
        }
    });

    KEYWORDS.HELP_CATEGORY.forEach(keyword => {
        if (text.includes(keyword)) {
            categoryScores['Help Needed'] += 1;
            if (!detectedKeywords.includes(keyword)) detectedKeywords.push(keyword);
        }
    });

    // Determine category
    let suggestedCategory: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer' = 'Help Needed';
    let maxScore = 0;

    Object.entries(categoryScores).forEach(([category, score]) => {
        if (score > maxScore) {
            maxScore = score;
            suggestedCategory = category as typeof suggestedCategory;
        }
    });

    if (maxScore > 0) {
        reasons.push(`Category "${suggestedCategory}" detected based on keywords`);
    } else {
        reasons.push('Defaulting to "Help Needed" category');
    }

    // Blood Needed posts are automatically high urgency
    if (suggestedCategory === 'Blood Needed' && suggestedUrgency !== 'High') {
        suggestedUrgency = 'High';
        reasons.push('Blood donation requests are automatically marked high urgency');
    }

    // Calculate confidence score
    const totalKeywordsFound = detectedKeywords.length;
    const confidenceScore = Math.min(100, totalKeywordsFound * 15 + (maxScore > 0 ? 30 : 0));

    return {
        suggestedCategory,
        suggestedUrgency,
        confidenceScore,
        detectedKeywords: [...new Set(detectedKeywords)], // Remove duplicates
        reasoning: reasons.join('. ')
    };
}

// Get priority badge color based on score
export function getPriorityColor(score: number): string {
    if (score >= 150) return 'red';
    if (score >= 100) return 'orange';
    if (score >= 50) return 'yellow';
    return 'green';
}

// Format time ago
export function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}
