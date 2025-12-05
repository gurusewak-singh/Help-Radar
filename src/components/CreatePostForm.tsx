'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MapPin, Phone, Mail, Camera, X, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

const categories = [
    { value: 'Help Needed', label: 'Need Help', desc: 'Request assistance from community' },
    { value: 'Item Lost', label: 'Lost Item', desc: 'Report a lost belonging' },
    { value: 'Blood Needed', label: 'Blood Needed', desc: 'Urgent blood donation request' },
    { value: 'Offer', label: 'Offering Help', desc: 'Volunteer your help or resources' }
] as const;

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export default function CreatePostForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        category: 'Help Needed',
        city: '',
        area: '',
        urgency: 'Medium',
        contact: { name: '', phone: '', email: '' },
        images: []
    });

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            if (formData.images.length >= 3) break;
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

    const validateStep = (stepNum: number): boolean => {
        if (stepNum === 1) {
            if (!formData.title.trim()) { setError('Please add a title'); return false; }
            if (!formData.description.trim()) { setError('Please add a description'); return false; }
        }
        if (stepNum === 2) {
            if (!formData.city) { setError('Please select a city'); return false; }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(s => s + 1);
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(step)) return;

        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: user?.id })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create post');
            }

            setSuccess(true);
            setTimeout(() => router.push(`/post/${data.post._id}`), 1500);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-12">
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-teal-600" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-1">Request Posted</h2>
                <p className="text-stone-500 text-sm">Redirecting you now...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? 'bg-teal-600 text-white' : 'bg-stone-100 text-stone-400'
                            }`}>
                            {s}
                        </div>
                        {s < 3 && (
                            <div className={`w-12 h-0.5 ${step > s ? 'bg-teal-600' : 'bg-stone-200'}`} />
                        )}
                    </div>
                ))}
                <span className="ml-3 text-sm text-stone-500">
                    {step === 1 && 'Details'}
                    {step === 2 && 'Location'}
                    {step === 3 && 'Contact'}
                </span>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Step 1: Basic Details */}
            {step === 1 && (
                <div className="space-y-6">
                    {/* Category Selection */}
                    <fieldset>
                        <legend className="text-sm font-medium text-stone-700 mb-3">What type of request is this?</legend>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map(cat => (
                                <label
                                    key={cat.value}
                                    className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.category === cat.value
                                            ? 'border-teal-600 bg-teal-50/50'
                                            : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        value={cat.value}
                                        checked={formData.category === cat.value}
                                        onChange={() => updateField('category', cat.value)}
                                        className="sr-only"
                                    />
                                    <span className="font-medium text-stone-900">{cat.label}</span>
                                    <span className="text-xs text-stone-500 mt-0.5">{cat.desc}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1.5">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            placeholder="Brief summary of your request"
                            maxLength={120}
                            className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                        <p className="mt-1.5 text-xs text-stone-400">{formData.title.length}/120</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="desc" className="block text-sm font-medium text-stone-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            id="desc"
                            value={formData.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder="Explain your situation in detail. Include any relevant information that would help others understand your request."
                            rows={4}
                            maxLength={1500}
                            className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                        />
                    </div>

                    {/* Urgency */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-3">How urgent is this?</label>
                        <div className="flex gap-2">
                            {(['Low', 'Medium', 'High'] as const).map(level => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => updateField('urgency', level)}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${formData.urgency === level
                                            ? level === 'High'
                                                ? 'bg-red-600 text-white border-red-600'
                                                : level === 'Medium'
                                                    ? 'bg-amber-500 text-white border-amber-500'
                                                    : 'bg-stone-700 text-white border-stone-700'
                                            : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={nextStep}
                        className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        Continue
                    </button>
                </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
                <div className="space-y-6">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-stone-700 mb-1.5">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            City
                        </label>
                        <select
                            id="city"
                            value={formData.city}
                            onChange={(e) => updateField('city', e.target.value)}
                            className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
                        >
                            <option value="">Select your city</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-stone-700 mb-1.5">
                            Area / Neighborhood <span className="font-normal text-stone-400">(optional)</span>
                        </label>
                        <input
                            id="area"
                            type="text"
                            value={formData.area}
                            onChange={(e) => updateField('area', e.target.value)}
                            placeholder="e.g., Koramangala, Sector 21"
                            className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            <Camera className="w-4 h-4 inline mr-1" />
                            Photos <span className="font-normal text-stone-400">(optional, max 3)</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            ))}
                            {formData.images.length < 3 && (
                                <label className="w-20 h-20 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-colors">
                                    <Camera className="w-5 h-5 text-stone-400" />
                                    <span className="text-xs text-stone-400 mt-1">Add</span>
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

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-lg transition-colors"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={nextStep}
                            className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
                <div className="space-y-6">
                    <p className="text-sm text-stone-600 mb-4">
                        Add your contact info so people can reach you. At least one method is recommended.
                    </p>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                            Your Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.contact.name}
                            onChange={(e) => updateContact('name', e.target.value)}
                            placeholder="How should we address you?"
                            className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1.5">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={formData.contact.phone}
                            onChange={(e) => updateContact('phone', e.target.value)}
                            placeholder="10-digit mobile number"
                            className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.contact.email}
                            onChange={(e) => updateContact('email', e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-lg transition-colors"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                'Post Request'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
