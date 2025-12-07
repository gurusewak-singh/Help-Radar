'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Heart, HelpCircle, Search, Gift, ArrowRight, Plus, Sparkles, MapPin, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';

// Dynamic import for Lottie
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const CATEGORIES = [
  { key: 'Blood Needed', label: 'Blood', icon: Heart, color: 'bg-red-500/20 text-red-300', hoverColor: 'hover:bg-red-500/30' },
  { key: 'Help Needed', label: 'Help', icon: HelpCircle, color: 'bg-blue-500/20 text-blue-300', hoverColor: 'hover:bg-blue-500/30' },
  { key: 'Item Lost', label: 'Lost', icon: Search, color: 'bg-amber-500/20 text-amber-300', hoverColor: 'hover:bg-amber-500/30' },
  { key: 'Offer', label: 'Offers', icon: Gift, color: 'bg-emerald-500/20 text-emerald-300', hoverColor: 'hover:bg-emerald-500/30' },
];

// Live activity feed data (simulated real-time)
const ACTIVITY_FEED = [
  { type: 'blood', text: 'Blood needed in Mumbai', time: '2 min ago', urgent: true },
  { type: 'helped', text: 'Rahul helped find lost keys', time: '5 min ago', urgent: false },
  { type: 'new', text: 'New request in Bangalore', time: '8 min ago', urgent: false },
  { type: 'blood', text: 'O+ donor found in Delhi', time: '12 min ago', urgent: false },
  { type: 'helped', text: 'Medicine delivered to elderly', time: '15 min ago', urgent: false },
  { type: 'new', text: 'Lost dog found in Pune!', time: '20 min ago', urgent: false },
];

// Testimonials
const TESTIMONIALS = [
  { text: "Found a blood donor in 30 minutes!", name: "Priya S.", city: "Mumbai" },
  { text: "My lost dog was found the same day!", name: "Rahul K.", city: "Delhi" },
  { text: "Neighbors helped me move within hours.", name: "Anita M.", city: "Bangalore" },
];

// Animated counter
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <>{count.toLocaleString()}{suffix}</>;
}

// Live Activity Ticker
function ActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ACTIVITY_FEED.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const activity = ACTIVITY_FEED[currentIndex];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white overflow-hidden">
      <span className={`w-2 h-2 rounded-full ${activity.urgent ? 'bg-red-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
      <span className="truncate font-medium">{activity.text}</span>
      <span className="text-white/50 flex-shrink-0">{activity.time}</span>
    </div>
  );
}

// Testimonial Rotator
function TestimonialRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const testimonial = TESTIMONIALS[currentIndex];

  return (
    <div className="text-center animate-fade-in" key={currentIndex}>
      <p className="text-white/90 text-sm italic mb-1">&ldquo;{testimonial.text}&rdquo;</p>
      <p className="text-white/50 text-xs">— {testimonial.name}, {testimonial.city}</p>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [nearbyCount, setNearbyCount] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Fetch Lottie animation
    fetch('https://assets3.lottiefiles.com/packages/lf20_xlmz9xwm.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(() => {
        fetch('https://assets10.lottiefiles.com/packages/lf20_qdqb0lij.json')
          .then(res => res.json())
          .then(data => setAnimationData(data))
          .catch(console.error);
      });

    // Simulate location detection
    setTimeout(() => {
      setUserCity('your area');
      setNearbyCount(Math.floor(Math.random() * 15) + 5);
    }, 1500);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-pulse-slow" />
        {mounted && (
          <>
            <div className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-particle" style={{ left: '10%', top: '20%' }} />
            <div className="absolute w-2 h-2 bg-teal-300/40 rounded-full animate-float-particle" style={{ left: '85%', top: '30%' }} />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative h-full flex flex-col px-4 sm:px-6 pt-4 pb-6">

        {/* Top: Live Activity Ticker */}
        <div className={`mb-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="max-w-md mx-auto">
            <ActivityTicker />
          </div>
        </div>

        {/* Middle: Hero Section */}
        <div className="flex-1 grid lg:grid-cols-2 gap-10 lg:gap-32 items-center max-w-7xl mx-auto w-full">

          {/* Left: Text Content */}
          <div className={`text-center lg:text-left transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Location Badge */}
            {userCity && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm text-white font-medium mb-4 animate-fade-in">
                <MapPin className="w-4 h-4 text-teal-300" />
                <span>{nearbyCount} requests near {userCity}</span>
              </div>
            )}

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight mb-4 leading-tight">
              Your neighbourhood&apos;s
              <span className="text-teal-200 block">helping hand</span>
            </h1>

            <p className="text-base lg:text-lg text-teal-100/90 mb-6 max-w-lg mx-auto lg:mx-0">
              Connect with neighbours and build a stronger community together.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-5">
              <Link
                href="/requests"
                className="group px-6 py-2.5 bg-white rounded-full font-medium text-teal-700 text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  Browse Requests
                  <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
              <Link
                href="/create"
                className="px-6 py-2.5 rounded-full font-medium text-white text-sm border-2 border-white/40 hover:border-white/60 hover:bg-white/10 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Post Request
                </span>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center lg:justify-start gap-5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white tabular-nums">
                    <AnimatedNumber target={547} />
                  </p>
                  <p className="text-[10px] text-teal-200/60">helped this month</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white tabular-nums">
                    <AnimatedNumber target={12} suffix="K+" />
                  </p>
                  <p className="text-[10px] text-teal-200/60">community members</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="hidden lg:block p-3 bg-white/5 rounded-xl border border-white/10">
              <TestimonialRotator />
            </div>
          </div>

          {/* Right: Animation with Categories Around It */}
          <div className={`relative transition-all duration-700 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[110%] h-[110%] bg-teal-400/20 rounded-full blur-3xl animate-pulse-glow" />
            </div>

            <div className="relative max-w-sm mx-auto">
              {animationData ? (
                <Lottie animationData={animationData} loop={true} autoplay={true} className="w-full h-auto" />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping" />
                    <div className="absolute inset-4 border-4 border-white/30 rounded-full animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-white/60 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category badges around the image - styled like Urgent badge */}
            <Link
              href="/requests?category=Blood%20Needed"
              className="absolute top-6 -left-4 shadow-xl hover:scale-110 transition-transform"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Blood</span>
              </div>
            </Link>

            <Link
              href="/requests?category=Help%20Needed"
              className="absolute top-6 -right-4 shadow-xl hover:scale-110 transition-transform"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold text-blue-600">Help</span>
              </div>
            </Link>

            <Link
              href="/requests?category=Item%20Lost"
              className="absolute bottom-6 -left-4 shadow-xl hover:scale-110 transition-transform"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl">
                <Search className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600">Lost</span>
              </div>
            </Link>

            <Link
              href="/requests?category=Offer"
              className="absolute bottom-6 -right-4 shadow-xl hover:scale-110 transition-transform"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl">
                <Gift className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600">Offers</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

