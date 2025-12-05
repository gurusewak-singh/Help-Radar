





































































































































































































































































































































































































































































































'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, MapPin, Phone, Mail, Camera, X, AlertCircle, CheckCircle } from 'lucide-react';

interface FormData {
    title: string;
    description: string;
    category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
    city: string;
    area: string;
    urgency: 'Low' | 'Medium' | 'High';
    contact: {
        name: string;
        phone: string;
        email: string;
    };
    images: Array<{ url: string }>;
}

interface Suggestion {
    suggestedCategory: string;
    suggestedUrgency: string;
    confidenceScore: number;
    reasoning: string;
}

const categories = ['Help Needed', 'Item Lost', 'Blood Needed', 'Offer'] as const;
const urgencies = ['Low', 'Medium', 'High'] as const;
const popularCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export default function CreatePostForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        category: 'Help Needed',
        city: '',
        area: '',
        urgency: 'Medium',
        contact: {
            name: '',
            phone: '',
            email: ''
        },
        images: []
    });

    // Debounced smart suggestion
    useEffect(() => {
        if (formData.title.length > 5 || formData.description.length > 10) {
            const timer = setTimeout(async () => {
                try {
                    const res = await fetch('/api/suggest', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: formData.title,
                            description: formData.description
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestion(data);
                    }
                } catch (e) {
                    console.error('Suggestion error:', e);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [formData.title, formData.description]);

    const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const updateContact = (field: keyof FormData['contact'], value: string) => {
        setFormData(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
    };

    const applySuggestion = () => {
        if (suggestion) {
            setFormData(prev => ({
                ...prev,
                category: suggestion.suggestedCategory as FormData['category'],
                urgency: suggestion.suggestedUrgency as FormData['urgency']
            }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // For demo, convert to base64 (in production, use Cloudinary)
        for (const file of Array.from(files)) {
            if (formData.images.length >= 5) break;

            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, { url: reader.result as string }]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validation
        if (!formData.title.trim()) {
            setError('Title is required');
            setIsSubmitting(false);
            return;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            setIsSubmitting(false);
            return;
        }
        if (!formData.city.trim()) {
            setError('City is required');
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.details?.join(', ') || 'Failed to create post');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push(`/post/${data.post._id}`);
            }, 1500);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Post Created Successfully!</h2>
                    <p className="text-slate-400">Redirecting to your post...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {/* Smart Suggestion Banner */}
            {suggestion && suggestion.confidenceScore > 30 && (
                <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-purple-300 mb-1">Smart Suggestion</h4>
                            <p className="text-sm text-slate-400 mb-2">{suggestion.reasoning}</p>
                            <button
                                type="button"
                                onClick={applySuggestion}
                                className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                            >
                                Apply: {suggestion.suggestedCategory} • {suggestion.suggestedUrgency} urgency →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g., Urgent blood needed at City Hospital"
                    maxLength={150}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
                <p className="mt-1 text-xs text-slate-500">{formData.title.length}/150 characters</p>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe your request in detail..."
                    rows={4}
                    maxLength={2000}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                />
                <p className="mt-1 text-xs text-slate-500">{formData.description.length}/2000 characters</p>
            </div>

            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => updateField('category', e.target.value as FormData['category'])}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Urgency Level</label>
                    <div className="flex gap-2">
                        {urgencies.map(urg => (
                            <button
                                key={urg}
                                type="button"
                                onClick={() => updateField('urgency', urg)}
                                className={`flex-1 py-3 rounded-xl font-medium transition-all ${formData.urgency === urg
                                        ? urg === 'High' ? 'bg-red-500 text-white'
                                            : urg === 'Medium' ? 'bg-amber-500 text-white'
                                                : 'bg-green-500 text-white'
                                        : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:bg-slate-700/50'
                                    }`}
                            >
                                {urg}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        City <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                    >
                        <option value="">Select city</option>
                        {popularCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Area / Locality</label>
                    <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => updateField('area', e.target.value)}
                        placeholder="e.g., Koramangala, Sector 21"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                    />
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Contact Information</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.contact.name}
                            onChange={(e) => updateContact('name', e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="tel"
                            value={formData.contact.phone}
                            onChange={(e) => updateContact('phone', e.target.value)}
                            placeholder="Phone number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="email"
                            value={formData.contact.email}
                            onChange={(e) => updateContact('email', e.target.value)}
                            placeholder="Email address"
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Camera className="w-4 h-4 inline mr-1" />
                    Images (optional, max 5)
                </label>
                <div className="flex flex-wrap gap-3">
                    {formData.images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    ))}
                    {formData.images.length < 5 && (
                        <label className="w-24 h-24 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors">
                            <Camera className="w-6 h-6 text-slate-400" />
                            <span className="text-xs text-slate-400 mt-1">Add</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Post...
                    </span>
                ) : (
                    'Create Post'
                )}
            </button>
        </form>
    );
}
