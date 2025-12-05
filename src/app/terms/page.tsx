'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, FileText, Users, Lock, AlertCircle, Scale, Mail, ChevronRight, ArrowLeft } from 'lucide-react';

const sections = [
    {
        id: 'acceptance',
        icon: FileText,
        title: 'Acceptance of Terms',
        content: `By accessing and using HelpRadar ("the Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms constitute a legally binding agreement between you and HelpRadar. We reserve the right to modify these terms at any time, and your continued use of the Platform constitutes acceptance of any changes.`
    },
    {
        id: 'eligibility',
        icon: Users,
        title: 'User Eligibility',
        content: `To use HelpRadar, you must:

• Be at least 18 years of age or have parental/guardian consent
• Provide accurate and complete registration information
• Maintain the security of your account credentials
• Not have been previously banned from the Platform
• Comply with all applicable local, state, and national laws

Users are responsible for all activities that occur under their account. You agree to notify us immediately of any unauthorized use of your account.`
    },
    {
        id: 'conduct',
        icon: Shield,
        title: 'User Conduct',
        content: `When using HelpRadar, you agree NOT to:

• Post false, misleading, or fraudulent help requests
• Harass, abuse, or harm other users
• Use the Platform for illegal activities
• Spam or send unsolicited communications
• Attempt to circumvent security measures
• Impersonate other users or entities
• Share others' personal information without consent
• Use automated systems to access the Platform

We reserve the right to remove content and suspend accounts that violate these guidelines.`
    },
    {
        id: 'content',
        icon: FileText,
        title: 'Content Policy',
        content: `By posting content on HelpRadar, you:

• Retain ownership of your original content
• Grant HelpRadar a non-exclusive license to display your content
• Affirm that your content does not infringe on third-party rights
• Accept responsibility for the accuracy of your posts

We do not pre-screen content but reserve the right to remove any material that violates our policies or applicable laws. Users can report inappropriate content through our reporting system.`
    },
    {
        id: 'privacy',
        icon: Lock,
        title: 'Privacy & Data',
        content: `Your privacy is important to us. Our data practices include:

• Collecting only necessary personal information
• Securing your data with industry-standard encryption
• Never selling your personal information to third parties
• Allowing you to request data deletion at any time
• Using cookies for platform functionality and analytics

For complete details, please review our Privacy Policy. By using HelpRadar, you consent to our data collection and processing practices.`
    },
    {
        id: 'liability',
        icon: AlertCircle,
        title: 'Limitation of Liability',
        content: `HelpRadar is provided "as is" without warranties of any kind. We are not liable for:

• Actions taken by users in response to help requests
• The accuracy or reliability of user-posted content
• Any damages arising from use of the Platform
• Service interruptions or technical issues
• Loss of data or security breaches beyond our control

Users engage with each other at their own risk. We encourage all users to exercise caution and verify information before responding to requests.`
    },
    {
        id: 'disputes',
        icon: Scale,
        title: 'Dispute Resolution',
        content: `In the event of disputes:

• Users should first attempt to resolve issues directly
• Unresolved disputes may be reported to our support team
• We may mediate but are not obligated to resolve user conflicts
• Legal disputes will be governed by applicable Indian law
• Any formal proceedings shall be conducted in courts of appropriate jurisdiction

We encourage open communication and good-faith efforts to resolve disagreements within the community.`
    }
];

export default function TermsPage() {
    const [activeSection, setActiveSection] = useState('acceptance');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <Link
                        href="/"
                        className={`inline-flex items-center gap-2 text-teal-200 hover:text-white transition-colors mb-8 ${mounted ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>

                    <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Scale className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">Terms of Service</h1>
                                <p className="text-teal-200 text-sm mt-1">Last updated: December 2024</p>
                            </div>
                        </div>
                        <p className="text-teal-100/90 text-lg max-w-2xl">
                            Please read these terms carefully before using HelpRadar. By using our platform, you agree to these terms and conditions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24">
                            <nav className="space-y-1">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${isActive
                                                ? 'bg-teal-50 text-teal-700 shadow-sm'
                                                : 'text-stone-600 hover:bg-stone-100'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                                            <span className="text-sm font-medium truncate">{section.title}</span>
                                            {isActive && <ChevronRight className="w-4 h-4 ml-auto text-teal-500" />}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Contact Card */}
                            <div className="mt-8 p-5 bg-gradient-to-br from-stone-100 to-stone-50 rounded-2xl border border-stone-200/60">
                                <Mail className="w-6 h-6 text-teal-600 mb-3" />
                                <h4 className="font-semibold text-stone-800 mb-1">Questions?</h4>
                                <p className="text-sm text-stone-600 mb-4">Reach out to our team for clarification on any terms.</p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    Contact Us
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-9">
                        <div className="space-y-12">
                            {sections.map((section, index) => {
                                const Icon = section.icon;
                                return (
                                    <section
                                        key={section.id}
                                        id={section.id}
                                        className={`scroll-mt-24 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-teal-600" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Section {index + 1}</span>
                                                <h2 className="text-xl lg:text-2xl font-bold text-stone-800">{section.title}</h2>
                                            </div>
                                        </div>
                                        <div className="pl-16">
                                            <div className="prose prose-stone max-w-none">
                                                {section.content.split('\n\n').map((paragraph, pIndex) => (
                                                    <p key={pIndex} className="text-stone-600 leading-relaxed whitespace-pre-line mb-4">
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        {index < sections.length - 1 && (
                                            <div className="mt-10 border-b border-stone-200" />
                                        )}
                                    </section>
                                );
                            })}
                        </div>

                        {/* Footer Note */}
                        <div className="mt-16 p-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-stone-800 mb-1">Agreement Acknowledgment</h3>
                                    <p className="text-stone-600 text-sm leading-relaxed">
                                        By creating an account or using HelpRadar, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you have any questions or concerns, please contact us before using the platform.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
