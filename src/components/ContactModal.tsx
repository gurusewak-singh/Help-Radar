'use client';

import { useState } from 'react';
import { X, Phone, Mail, User, Eye, EyeOff, Flag, ExternalLink } from 'lucide-react';

interface Contact {
    name?: string;
    phone?: string;
    email?: string;
}

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Contact;
    postTitle: string;
}

export default function ContactModal({ isOpen, onClose, contact, postTitle }: ContactModalProps) {
    const [revealed, setRevealed] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);

    if (!isOpen) return null;

    const maskPhone = (phone: string): string => {
        if (phone.length < 6) return phone;
        return phone.slice(0, 2) + '••••••' + phone.slice(-2);
    };

    const maskEmail = (email: string): string => {
        const [local, domain] = email.split('@');
        if (!domain) return email;
        return local.slice(0, 2) + '••••' + '@' + domain;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-6 border-b border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-bold text-white pr-8">Contact Information</h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">{postTitle}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Privacy Notice */}
                    {!revealed && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <p className="text-sm text-amber-300">
                                🔒 Contact details are protected. Click "Reveal Contact" to view full information.
                            </p>
                        </div>
                    )}

                    {/* Contact Name */}
                    {contact.name && (
                        <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <User className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Name</p>
                                <p className="text-white font-medium">{contact.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    {contact.phone && (
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Phone className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Phone</p>
                                    <p className="text-white font-medium font-mono">
                                        {revealed ? contact.phone : maskPhone(contact.phone)}
                                    </p>
                                </div>
                            </div>
                            {revealed && (
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors flex items-center gap-1"
                                >
                                    Call <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    )}

                    {/* Email */}
                    {contact.email && (
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Email</p>
                                    <p className="text-white font-medium">
                                        {revealed ? contact.email : maskEmail(contact.email)}
                                    </p>
                                </div>
                            </div>
                            {revealed && (
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                                >
                                    Email <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    )}

                    {/* Reveal Button */}
                    {!revealed && (
                        <button
                            onClick={() => setRevealed(true)}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                        >
                            <Eye className="w-5 h-5" />
                            Reveal Contact
                        </button>
                    )}

                    {/* Report Link */}
                    <button
                        onClick={() => setShowReportForm(!showReportForm)}
                        className="w-full py-2 text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1"
                    >
                        <Flag className="w-4 h-4" />
                        Report inappropriate content
                    </button>
                </div>
            </div>
        </div>
    );
}
