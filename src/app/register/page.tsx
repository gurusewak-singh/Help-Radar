'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Heart, AlertCircle, Check, Sparkles, Users, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoggedIn } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Redirect if already logged in
    if (isLoggedIn) {
        router.push('/');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: '', color: '', bgColor: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['text-red-600', 'text-amber-600', 'text-teal-600', 'text-emerald-600'];
        const bgColors = ['bg-red-500', 'bg-amber-500', 'bg-teal-500', 'bg-emerald-500'];
        return {
            strength,
            label: labels[strength - 1] || '',
            color: colors[strength - 1] || '',
            bgColor: bgColors[strength - 1] || ''
        };
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    const handleNextStep = () => {
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!formData.email.trim()) {
            setError('Please enter your email');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!agreeToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setIsLoading(true);

        try {
            const success = await register(formData.email, formData.password, formData.name);
            if (success) {
                router.push('/');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const InputField = ({
        id,
        name,
        type = 'text',
        label,
        placeholder,
        icon: Icon,
        value,
        required = true,
        suffix
    }: {
        id: string;
        name: string;
        type?: string;
        label: string | React.ReactNode;
        placeholder: string;
        icon: React.ElementType;
        value: string;
        required?: boolean;
        suffix?: React.ReactNode;
    }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-2">
                {label}
            </label>
            <div className={`relative rounded-xl transition-all duration-200 ${focusedField === name ? 'ring-2 ring-teal-500/20' : ''
                }`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${focusedField === name ? 'bg-teal-100' : 'bg-stone-100'
                    }`}>
                    <Icon className={`w-4 h-4 transition-colors ${focusedField === name ? 'text-teal-600' : 'text-stone-400'
                        }`} />
                </div>
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={placeholder}
                    className="w-full pl-14 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 transition-colors"
                    required={required}
                />
                {suffix}
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-stone-50">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800">
                {/* Decorative Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            Join 10,000+ community members
                        </div>
                        <h1 className="text-4xl font-bold leading-tight mb-4">
                            Start making a<br />
                            <span className="text-teal-200">difference today</span>
                        </h1>
                        <p className="text-lg text-teal-100/80 max-w-md leading-relaxed">
                            Join the community that cares. Help your neighbours and get help when you need it.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4">
                        {[
                            { icon: Users, text: 'Connect with neighbours' },
                            { icon: Zap, text: 'Get instant notifications' },
                            { icon: Shield, text: 'Verified community members' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <item.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-[420px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/25">
                                <Heart className="w-5 h-5 text-white" fill="white" />
                            </div>
                            <span className="text-xl font-bold text-stone-900">HelpRadar</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-stone-900 mb-2">Create your account</h2>
                        <p className="text-stone-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2">
                            <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-teal-500' : 'bg-stone-200'}`} />
                            <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-teal-500' : 'bg-stone-200'}`} />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className={`text-xs font-medium ${step === 1 ? 'text-teal-600' : 'text-stone-400'}`}>Your info</span>
                            <span className={`text-xs font-medium ${step === 2 ? 'text-teal-600' : 'text-stone-400'}`}>Security</span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-up">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-800">Error</p>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-5 animate-fade-up">
                            <InputField
                                id="name"
                                name="name"
                                label="Full name"
                                placeholder="John Doe"
                                icon={User}
                                value={formData.name}
                            />

                            <InputField
                                id="email"
                                name="email"
                                type="email"
                                label="Email address"
                                placeholder="you@example.com"
                                icon={Mail}
                                value={formData.email}
                            />

                            <InputField
                                id="phone"
                                name="phone"
                                type="tel"
                                label={<>Phone <span className="text-stone-400 font-normal">(optional)</span></>}
                                placeholder="+91 98765 43210"
                                icon={Phone}
                                value={formData.phone}
                                required={false}
                            />

                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full py-3.5 px-4 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-stone-900/10 mt-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-stone-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 bg-stone-50 text-sm text-stone-400 font-medium">or sign up with</span>
                                </div>
                            </div>

                            {/* Google */}
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-stone-200 rounded-xl text-stone-700 font-medium hover:bg-stone-50 hover:border-stone-300 transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    )}

                    {/* Step 2: Password */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up">
                            {/* Back Button */}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-stone-500 hover:text-stone-700 font-medium flex items-center gap-1 mb-4 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Back to your info
                            </button>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                                    Create a password
                                </label>
                                <div className={`relative rounded-xl transition-all duration-200 ${focusedField === 'password' ? 'ring-2 ring-teal-500/20' : ''
                                    }`}>
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${focusedField === 'password' ? 'bg-teal-100' : 'bg-stone-100'
                                        }`}>
                                        <Lock className={`w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-teal-600' : 'text-stone-400'
                                            }`} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Min. 8 characters"
                                        className="w-full pl-14 pr-12 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 transition-colors"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {formData.password && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex-1 flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1.5 flex-1 rounded-full transition-all ${level <= passwordStrength.strength ? passwordStrength.bgColor : 'bg-stone-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
                                    Confirm password
                                </label>
                                <div className={`relative rounded-xl transition-all duration-200 ${focusedField === 'confirmPassword' ? 'ring-2 ring-teal-500/20' : ''
                                    }`}>
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${focusedField === 'confirmPassword' ? 'bg-teal-100' : 'bg-stone-100'
                                        }`}>
                                        <Lock className={`w-4 h-4 transition-colors ${focusedField === 'confirmPassword' ? 'text-teal-600' : 'text-stone-400'
                                            }`} />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Re-enter your password"
                                        className={`w-full pl-14 pr-12 py-3.5 bg-white border rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none transition-colors ${passwordsMatch
                                            ? 'border-emerald-300 focus:border-emerald-500'
                                            : 'border-stone-200 focus:border-teal-500'
                                            }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {passwordsMatch && (
                                    <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                                        <Check className="w-3.5 h-3.5" />
                                        Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 pt-2">
                                <div className="relative mt-0.5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="flex items-center justify-center w-5 h-5 rounded-md border-2 border-stone-300 bg-white cursor-pointer transition-all peer-checked:bg-teal-600 peer-checked:border-teal-600 peer-focus:ring-2 peer-focus:ring-teal-500/20"
                                    >
                                        <Check className="w-3 h-3 text-white" />
                                    </label>
                                </div>
                                <label htmlFor="terms" className="text-sm text-stone-600 leading-relaxed cursor-pointer">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-teal-600 hover:text-teal-700 font-medium">Terms</Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="text-teal-600 hover:text-teal-700 font-medium">Privacy Policy</Link>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-stone-900/10 mt-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-stone-400">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-stone-600 hover:text-teal-600 transition-colors">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-stone-600 hover:text-teal-600 transition-colors">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
