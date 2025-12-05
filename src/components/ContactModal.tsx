'use client';

import { useState } from 'react';
import { X, Phone, Mail, User, Eye, Shield } from 'lucide-react';

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

    if (!isOpen) return null;

    const maskValue = (value: string, type: 'phone' | 'email') => {
        if (type === 'phone') return value.slice(0, 2) + '••••••' + value.slice(-2);
        const [local, domain] = value.split('@');
        return local.slice(0, 2) + '••••@' + domain;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-stone-100">
                    <h3 className="font-semibold text-stone-900">Contact Details</h3>
                    <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {!revealed && (
                        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                            <Shield className="w-4 h-4 mt-0.5" />
                            <span>Contact info is masked for privacy.</span>
                        </div>
                    )}

                    {contact.name && (
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                            <User className="w-4 h-4 text-stone-400" />
                            <span className="text-stone-900">{contact.name}</span>
                        </div>
                    )}

                    {contact.phone && (
                        <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-stone-400" />
                                <span className="text-stone-900 font-mono">
                                    {revealed ? contact.phone : maskValue(contact.phone, 'phone')}
                                </span>
                            </div>
                            {revealed && (
                                <a href={`tel:${contact.phone}`} className="text-sm text-teal-600 hover:underline">Call</a>
                            )}
                        </div>
                    )}

                    {contact.email && (
                        <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-stone-400" />
                                <span className="text-stone-900">
                                    {revealed ? contact.email : maskValue(contact.email, 'email')}
                                </span>
                            </div>
                            {revealed && (
                                <a href={`mailto:${contact.email}`} className="text-sm text-teal-600 hover:underline">Email</a>
                            )}
                        </div>
                    )}

                    {!revealed && (
                        <button
                            onClick={() => setRevealed(true)}
                            className="w-full py-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Reveal Contact Info
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
