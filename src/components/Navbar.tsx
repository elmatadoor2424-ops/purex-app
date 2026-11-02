'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, Phone, Menu, X, Shield, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-white font-sans">
                    Pure<span className="text-cyan-400">X</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                    CyberX
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block font-medium">
                  خدمات النظافة الفندقية الفاخرة
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <Link
              href="/"
              className="text-white hover:text-cyan-400 transition-colors"
            >
              الرئيسية
            </Link>
            <a
              href="#pricing-calculator"
              className="hover:text-cyan-400 transition-colors"
            >
              حاسبة الأسعار
            </a>
            <a
              href="#hotel-standards"
              className="hover:text-cyan-400 transition-colors"
            >
              المعايير الفندقية
            </a>
            <a
              href="#why-purex"
              className="hover:text-cyan-400 transition-colors"
            >
              لماذا PureX؟
            </a>
            <Link
              href="/admin/operations"
              className="text-zinc-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>لوحة العمليات (دنيا)</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/201024897750?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20PureX%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%A7%D9%84%D9%86%D8%B8%D8%A7%D9%81%D8%A9%20%D8%A7%D9%84%D9%81%D9%86%D8%AF%D9%82%D9%8A%D8%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center gap-2 text-xs font-semibold"
              title="تواصل مباشر عبر الواتساب"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب 24/7</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-sm shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>حجز موعد فندقي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-lg bg-cyan-400 text-black text-xs font-bold"
            >
              حجز
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-cyan-400"
            >
              الرئيسية
            </Link>
            <a
              href="#pricing-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-cyan-400"
            >
              حاسبة الأسعار التفاعلية
            </a>
            <a
              href="#hotel-standards"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-cyan-400"
            >
              معايير PureX الفندقية
            </a>
            <a
              href="#why-purex"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-cyan-400"
            >
              ضمان الأمان والخصوصية
            </a>
            <Link
              href="/admin/operations"
              onClick={() => setMobileMenuOpen(false)}
              className="text-cyan-400 hover:text-cyan-300 pt-2 border-t border-zinc-800 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>لوحة العمليات والإدارة (دنيا)</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-xl bg-cyan-400 text-black font-bold text-sm text-center"
            >
              احجز موعدك الآن
            </button>
            <a
              href="https://wa.me/201024897750"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>محادثة واتساب مباشرة</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
