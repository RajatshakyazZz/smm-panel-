'use client';

import React from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
  Instagram,
  Youtube,
  Send,
  Facebook,
  Star,
  Zap,
  Sparkles,
  CreditCard,
  UserCheck
} from 'lucide-react';

export default function LandingFeatures() {
  return (
    <div className="bg-slate-950 text-slate-100">
      
      {/* WHY CHOOSE FAMEPROVIDER */}
      <section id="features" className="relative border-t border-slate-900 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Why Choose <span className="text-blue-500">FameProvider.com</span>?
            </h2>
            <p className="mt-4 text-sm text-slate-400 sm:text-base leading-relaxed">
              Join thousands of satisfied Indian creators, influencers, and resellers who trust FameProvider for high-quality, non-drop social media marketing solutions. Delivering fast turnaround times, competitive wholesale pricing in Indian Rupees (₹), and 24/7 dedicated human support.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-slate-900/90">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">High Quality Services</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Guaranteed high-retention engagement with real active profiles that will leave you completely satisfied.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-slate-900/90">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Indian Gateways</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Add funds seamlessly in Indian Rupees (₹) via PhonePe, Paytm, Razorpay, Cashfree & Easebuzz UPI.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-slate-900/90">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Super Quick Delivery</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Direct integration with FameProvider API server ensures immediate order dispatch in 0-15 minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-slate-900/90">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Lowest Price Guarantee</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Direct main supplier wholesale pricing converted transparently into INR without middleman fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CONTENT CREATORS LOVE MYFAME - STATS */}
      <section className="relative border-t border-slate-900 bg-slate-900/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Proven Creator Growth</span>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl leading-tight">
                WHY CONTENT CREATORS <br />
                <span className="italic text-blue-400 font-serif">love MyFame</span>
              </h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Creators who use MyFame grow 3x faster than those who don’t. They gain real engagement without wasting countless hours manually searching for an audience. They rely on MyFame and focus on creating amazing content.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                  <div className="text-3xl font-black text-blue-400">5X</div>
                  <div className="mt-1 text-xs text-slate-400 font-medium">more profile visits within the first month</div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                  <div className="text-3xl font-black text-purple-400">4X</div>
                  <div className="mt-1 text-xs text-slate-400 font-medium">higher engagement rate than manual outreach</div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                  <div className="text-3xl font-black text-emerald-400">+20%</div>
                  <div className="mt-1 text-xs text-slate-400 font-medium">revenue increase from brand deals & sponsorships</div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                  <div className="text-3xl font-black text-amber-400">3X</div>
                  <div className="mt-1 text-xs text-slate-400 font-medium">stronger community & authentic followers</div>
                </div>
              </div>
            </div>

            {/* Graphic Badge Display */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-gradient-to-tr from-slate-900 via-indigo-950/40 to-slate-900 p-8 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                  <div>
                    <span className="block text-sm font-bold text-white">MyFame Growth Dashboard</span>
                    <span className="text-[11px] text-emerald-400 font-medium">● 100% Non-Drop FameProvider Engine</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      <span className="font-semibold text-slate-200">Instagram Followers</span>
                    </div>
                    <span className="font-bold text-emerald-400">+10,000 Delivered</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <Youtube className="h-4 w-4 text-red-500" />
                      <span className="font-semibold text-slate-200">YouTube Monetization Views</span>
                    </div>
                    <span className="font-bold text-emerald-400">+50,000 Delivered</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <Send className="h-4 w-4 text-sky-400" />
                      <span className="font-semibold text-slate-200">Telegram Channel Members</span>
                    </div>
                    <span className="font-bold text-emerald-400">+5,000 Delivered</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 STEPS PROCESS */}
      <section id="how-it-works" className="relative border-t border-slate-900 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Simple 3-Step Process</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">How to Grow in 3 Minutes</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-slate-900 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-extrabold text-white mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Pick a package</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Choose from Instagram, YouTube, Telegram or Facebook services starting from as low as ₹1.95 per 1,000 views/followers.
              </p>
            </div>

            <div className="relative rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-900 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-extrabold text-white mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Fill the info</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                We will NEVER ask for your account password. Simply provide your public Instagram profile or post link.
              </p>
            </div>

            <div className="relative rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/20 to-slate-900 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-white">See the growth</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Orders dispatch within minutes via FameProvider API server. Sit back and watch your social engagement surge!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section id="platforms" className="relative border-t border-slate-900 bg-slate-900/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Different Platforms at One Place</h2>
            <p className="mt-3 text-xs text-slate-400">High-quality services with advanced algorithms, 24/7 support & non-drop guarantee.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-pink-500/40">
              <Instagram className="h-8 w-8 text-pink-500 mb-4" />
              <h3 className="text-base font-bold text-white">Instagram SMM Panel</h3>
              <p className="mt-2 text-xs text-slate-400">Gain real followers, likes, reels views & story impressions to boost explore page ranking.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-red-500/40">
              <Youtube className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="text-base font-bold text-white">YouTube SMM Panel</h3>
              <p className="mt-2 text-xs text-slate-400">Monetization safe watch time, high-retention views, organic subscribers & video likes.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-sky-500/40">
              <Send className="h-8 w-8 text-sky-400 mb-4" />
              <h3 className="text-base font-bold text-white">Telegram SMM Panel</h3>
              <p className="mt-2 text-xs text-slate-400">Add fast channel members, post views & poll votes for public and private channels.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/40">
              <Facebook className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-base font-bold text-white">Facebook SMM Panel</h3>
              <p className="mt-2 text-xs text-slate-400">Page likes, profile followers, post reactions & reel video views with instant start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="relative border-t border-slate-900 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Our Customers&apos; Experience</h2>
            <p className="mt-3 text-xs text-slate-400">Real feedback from creators and agencies using FameProvider.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                &quot;Fameprovider helped me grow my Instagram page very fast. Delivery was instant and the engagement looked real. Best SMM panel service!&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 font-bold text-xs text-white">
                Aarav Sharma ⭐⭐⭐⭐⭐
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                &quot;Excellent experience with Fameprovider. Affordable INR prices, quick PhonePe payment gateway, and smooth order dispatch.&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 font-bold text-xs text-white">
                Sophia Khan ⭐⭐⭐⭐⭐
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(4)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                &quot;Payment process on Fameprovider is very smooth and secure via Paytm QR. Orders start instantly and support replies very fast.&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 font-bold text-xs text-white">
                Rahul Verma ⭐⭐⭐⭐
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                &quot;Excellent support and super fast delivery for Telegram channel members. Highly recommended Fameprovider for resellers!&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 font-bold text-xs text-white">
                Priya Mehta ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
