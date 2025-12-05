'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, ArrowLeft, Linkedin, Github, MessageSquare, Clock, CheckCircle, User, Sparkles, ArrowUpRight, Heart } from 'lucide-react';

const teamMembers = [
    {
        name: 'Gurusewak Singh',
        role: 'Co-Founder & Lead Developer',
        description: 'Full-stack developer passionate about building community-driven platforms that make a real difference in people\'s lives.',
        avatar: 'GS',
        color: 'from-teal-500 to-emerald-600',
        shadowColor: 'shadow-teal-500/25',
        email: 'gurusewak@helpradar.com',
        linkedin: '#',
        github: '#'
    },
    {
        name: 'Katyayani Mishra',
        role: 'Co-Founder & Product Lead',
        description: 'Product strategist focused on creating intuitive user experiences that connect communities and foster collaboration.',
        avatar: 'KM',
        color: 'from-violet-500 to-purple-600',
        shadowColor: 'shadow-violet-500/25',
        email: 'katyayani@helpradar.com',
        linkedin: '#',
        github: '#'
    }
];

const contactMethods = [
    {
        icon: Mail,
        title: 'Email Us',
        description: 'Get a response within 24 hours',
        value: 'hello@helpradar.com',
        action: 'mailto:hello@helpradar.com',
        gradient: 'from-teal-500 to-teal-600',
        bgGlow: 'bg-teal-500/10'
    },
    {
        icon: MessageSquare,
        title: 'Live Chat',
        description: 'Mon-Fri, 9am-6pm IST',
        value: 'Start a conversation',
        action: '#',
        gradient: 'from-blue-500 to-indigo-600',
        bgGlow: 'bg-blue-500/10'
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        description: 'Come say hello',
        value: 'Bengaluru, India',
        action: '#',
        gradient: 'from-amber-500 to-orange-600',
        bgGlow: 'bg-amber-500/10'
    }
];

const faqs = [
    {
        question: 'How quickly can I expect a response?',
        answer: 'We typically respond to all inquiries within 24 hours during business days. Urgent matters are prioritized and handled immediately.'
    },
    {
        question: 'Can I report a user or inappropriate content?',
        answer: 'Absolutely! Use the report button on any post or user profile. Our moderation team reviews all reports within 12 hours to keep the community safe.'
    },
    {
        question: 'How do I become a verified helper?',
        answer: 'Complete your profile, help at least 5 community members, and maintain a positive rating. We\'ll reach out with verification details once you qualify.'
    }
];

export default function ContactPage() {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-teal-100/60 via-transparent to-violet-100/40 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-20">
                    <Link
                        href="/"
                        className={`inline-flex items-center gap-2 text-stone-500 hover:text-teal-600 transition-colors mb-16 group ${mounted ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>

                    <div className={`max-w-2xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200/60 rounded-full text-sm text-teal-700 font-medium mb-6">
                            <Heart className="w-3.5 h-3.5" />
                            We&apos;re here to help
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight mb-6 leading-[1.1]">
                            Get in touch with
                            <span className="block bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">our team</span>
                        </h1>
                        <p className="text-lg text-stone-600 leading-relaxed">
                            Have questions, feedback, or ideas? We&apos;d love to hear from you. Our team is always ready to assist.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Methods */}
            <div className="max-w-6xl mx-auto px-6 -mt-4 mb-20">
                <div className={`grid md:grid-cols-3 gap-5 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                            <a
                                key={method.title}
                                href={method.action}
                                className="group relative bg-white rounded-2xl p-6 border border-stone-200/80 hover:border-stone-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                style={{ transitionDelay: `${index * 75}ms` }}
                            >
                                {/* Hover Glow */}
                                <div className={`absolute inset-0 ${method.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-stone-900 mb-1 flex items-center gap-2">
                                        {method.title}
                                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-50 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </h3>
                                    <p className="text-sm text-stone-500 mb-3">{method.description}</p>
                                    <p className="text-sm font-medium text-teal-600 group-hover:text-teal-700 transition-colors">{method.value}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
                    {/* Contact Form */}
                    <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Send className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wide">Send a Message</span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 mb-2">Drop us a line</h2>
                        <p className="text-stone-600 mb-8">We&apos;ll get back to you within 24 hours.</p>

                        {isSubmitted ? (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-10 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">Message Sent!</h3>
                                <p className="text-stone-600">Thank you for reaching out. We&apos;ll respond shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="relative">
                                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-200 ${focusedField === 'name' ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-stone-200 hover:border-stone-300'}`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-200 ${focusedField === 'email' ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-stone-200 hover:border-stone-300'}`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">
                                        What&apos;s this about?
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('subject')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-stone-900 focus:outline-none transition-all duration-200 cursor-pointer ${focusedField === 'subject' ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-stone-200 hover:border-stone-300'}`}
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="feedback">Feedback & Suggestions</option>
                                        <option value="partnership">Partnership Opportunity</option>
                                        <option value="report">Report an Issue</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        rows={5}
                                        className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-200 resize-none ${focusedField === 'message' ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-stone-200 hover:border-stone-300'}`}
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Team Section */}
                    <div className={`mt-16 lg:mt-0 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-violet-600 uppercase tracking-wide">Our Team</span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 mb-2">Meet the Founders</h2>
                        <p className="text-stone-600 mb-8">The people behind HelpRadar, dedicated to building stronger communities.</p>

                        <div className="space-y-5">
                            {teamMembers.map((member, index) => (
                                <div
                                    key={member.name}
                                    className="group bg-white rounded-2xl p-6 border border-stone-200/80 hover:border-stone-300 shadow-sm hover:shadow-lg transition-all duration-300"
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${member.shadowColor} group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300`}>
                                            <span className="text-xl font-bold text-white">{member.avatar}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-stone-900 mb-0.5">{member.name}</h3>
                                            <p className="text-sm font-medium text-teal-600 mb-3">{member.role}</p>
                                            <p className="text-sm text-stone-600 leading-relaxed mb-4">{member.description}</p>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="p-2.5 bg-stone-100 rounded-xl text-stone-500 hover:bg-teal-100 hover:text-teal-600 transition-all duration-200"
                                                    title="Email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={member.linkedin}
                                                    className="p-2.5 bg-stone-100 rounded-xl text-stone-500 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                                                    title="LinkedIn"
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={member.github}
                                                    className="p-2.5 bg-stone-100 rounded-xl text-stone-500 hover:bg-stone-200 hover:text-stone-700 transition-all duration-200"
                                                    title="GitHub"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Response Time Badge */}
                        <div className="mt-6 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-stone-900">Quick Response Time</h4>
                                <p className="text-sm text-stone-600">We typically respond within 24 hours during business days.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white border-t border-stone-200">
                <div className={`max-w-6xl mx-auto px-6 py-20 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full text-sm text-amber-700 font-medium mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            FAQ
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-bold text-stone-900">Common Questions</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="group bg-stone-50 hover:bg-white rounded-2xl p-6 border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300"
                            >
                                <h3 className="font-semibold text-stone-900 mb-3 group-hover:text-teal-700 transition-colors">{faq.question}</h3>
                                <p className="text-sm text-stone-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
