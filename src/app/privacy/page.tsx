'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, Cookie, UserCheck, Globe, Bell, Trash2, Mail, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';

const sections = [
    {
        id: 'collection',
        icon: Database,
        title: 'Information We Collect',
        content: `HelpRadar collects information to provide better services to our community. We collect:

**Account Information**
• Name and email address when you register
• Profile information you choose to provide
• Authentication credentials (securely encrypted)

**Usage Information**
• Posts and requests you create
• Interactions with other users' posts
• Search queries and filter preferences
• Device information and browser type

**Location Data**
• City and area information you provide in posts
• General location for showing nearby requests (with your permission)`
    },
    {
        id: 'usage',
        icon: Eye,
        title: 'How We Use Your Data',
        content: `Your information helps us provide and improve HelpRadar:

**Core Services**
• Displaying your help requests to the community
• Connecting you with people who can help
• Sending notifications about responses to your posts

**Platform Improvement**
• Understanding how features are used
• Identifying and fixing issues
• Developing new features based on community needs

**Safety & Security**
• Preventing fraud and abuse
• Enforcing our Terms of Service
• Protecting our users and community`
    },
    {
        id: 'sharing',
        icon: UserCheck,
        title: 'Information Sharing',
        content: `We take your privacy seriously and limit data sharing:

**Public Information**
• Your posts and requests are visible to all users
• Your display name appears on your posts
• Contact information is only shown if you choose to include it

**We Never Sell Your Data**
We do not sell, rent, or trade your personal information to third parties for marketing purposes.

**Limited Sharing**
We may share data only:
• With your consent
• To comply with legal obligations
• To protect safety and prevent fraud
• With service providers who assist our operations (under strict confidentiality)`
    },
    {
        id: 'cookies',
        icon: Cookie,
        title: 'Cookies & Tracking',
        content: `HelpRadar uses cookies to enhance your experience:

**Essential Cookies**
• Authentication and session management
• Security features and fraud prevention
• Remembering your preferences

**Analytics Cookies**
• Understanding platform usage patterns
• Improving user experience
• Identifying technical issues

**Your Choices**
• You can disable cookies in your browser settings
• Some features may not work properly without cookies
• We respect "Do Not Track" browser signals`
    },
    {
        id: 'security',
        icon: Lock,
        title: 'Data Security',
        content: `We implement robust security measures to protect your data:

**Technical Safeguards**
• Industry-standard encryption (HTTPS/TLS)
• Secure password hashing
• Regular security audits and updates
• Protected database infrastructure

**Access Controls**
• Limited employee access to personal data
• Two-factor authentication for admin accounts
• Activity logging and monitoring

**Incident Response**
• Rapid response protocols for security issues
• User notification in case of data breaches
• Continuous security monitoring`
    },
    {
        id: 'retention',
        icon: Trash2,
        title: 'Data Retention',
        content: `We retain your information only as long as necessary:

**Active Accounts**
• Account data is kept while your account is active
• Posts remain visible unless you delete them
• Inactive accounts may be deleted after 24 months

**Deleted Content**
• Deleted posts are removed within 30 days
• Some data may be retained for legal compliance
• Backup data is purged within 90 days

**Account Deletion**
• You can request full account deletion anytime
• Upon deletion, we remove all personal data
• Some anonymized data may be retained for analytics`
    },
    {
        id: 'rights',
        icon: UserCheck,
        title: 'Your Rights',
        content: `You have control over your personal data:

**Access & Portability**
• Request a copy of your personal data
• Export your posts and account information
• Receive data in a portable format

**Correction & Deletion**
• Update or correct your information anytime
• Delete your posts and account
• Request removal of specific data

**Control & Consent**
• Opt-out of promotional communications
• Control notification preferences
• Withdraw consent for data processing

To exercise these rights, contact us at privacy@helpradar.com`
    },
    {
        id: 'changes',
        icon: Bell,
        title: 'Policy Updates',
        content: `We may update this Privacy Policy periodically:

**Notification**
• Significant changes will be announced via email
• Updates will be posted on this page
• The "Last updated" date will reflect changes

**Your Continued Use**
• Continued use after changes constitutes acceptance
• Review this policy periodically for updates
• Major changes may require renewed consent

**Questions?**
If you have questions about our privacy practices, please contact our privacy team at privacy@helpradar.com or visit our Contact page.`
    }
];

export default function PrivacyPage() {
    const [activeSection, setActiveSection] = useState('collection');
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
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">Privacy Policy</h1>
                                <p className="text-teal-200 text-sm mt-1">Last updated: December 2024</p>
                            </div>
                        </div>
                        <p className="text-teal-100/90 text-lg max-w-2xl">
                            Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use HelpRadar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {[
                        { icon: Lock, label: 'Encrypted Data' },
                        { icon: Eye, label: 'No Data Selling' },
                        { icon: Globe, label: 'GDPR Compliant' }
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-stone-200/50 border border-stone-100">
                            <Icon className="w-4 h-4 text-teal-600" />
                            <span className="text-sm font-medium text-stone-700">{label}</span>
                        </div>
                    ))}
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
                                <h4 className="font-semibold text-stone-800 mb-1">Privacy Concerns?</h4>
                                <p className="text-sm text-stone-600 mb-4">Reach out to our privacy team for any questions.</p>
                                <a
                                    href="mailto:privacy@helpradar.com"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    privacy@helpradar.com
                                    <ChevronRight className="w-4 h-4" />
                                </a>
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
                                                    <div key={pIndex} className="mb-4">
                                                        {paragraph.startsWith('**') ? (
                                                            <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                                                                {paragraph.split('\n').map((line, lIndex) => {
                                                                    if (line.startsWith('**') && line.endsWith('**')) {
                                                                        return <strong key={lIndex} className="block text-stone-800 font-semibold mt-4 mb-2">{line.replace(/\*\*/g, '')}</strong>;
                                                                    }
                                                                    return <span key={lIndex} className="block">{line}</span>;
                                                                })}
                                                            </p>
                                                        ) : (
                                                            <p className="text-stone-600 leading-relaxed whitespace-pre-line">{paragraph}</p>
                                                        )}
                                                    </div>
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
                                    <h3 className="font-semibold text-stone-800 mb-1">Your Privacy, Your Control</h3>
                                    <p className="text-stone-600 text-sm leading-relaxed">
                                        At HelpRadar, we believe in transparency and user control. You can manage your privacy settings, request data deletion, or contact us at any time. Your trust is the foundation of our community.
                                    </p>
                                    <div className="flex gap-4 mt-4">
                                        <Link
                                            href="/contact"
                                            className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                        >
                                            Contact Us →
                                        </Link>
                                        <Link
                                            href="/terms"
                                            className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                        >
                                            Terms of Service →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
