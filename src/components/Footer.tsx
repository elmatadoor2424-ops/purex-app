'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  Wallet,
  Headphones,
  UserCheck,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { PUREX_CONFIG } from '@/lib/constants';

export default function Footer() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-right font-sans" dir="rtl">
      {/* Upper Payment & Contacts Highlights Bar */}
      <div className="border-b border-zinc-850 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Vodafone Cash & Axis Pay */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-cyan-500/40 transition-all shadow-lg shadow-black/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">فودافون كاش & Axis Pay</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                حسابات الدفع المعتمدة
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              لسداد العربونات وتأكيد الحجز الفوري عبر محفظة فودافون كاش أو تطبيق اكسيس باي Axis Pay:
            </p>

            <div className="space-y-2 pt-1">
              {PUREX_CONFIG.vodafoneCashNumbers.map((num, idx) => (
                <div
                  key={num}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">رقم {idx + 1}:</span>
                    <span className="text-sm font-mono font-bold text-cyan-300 tracking-wider">
                      {num}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(num, `vf-${idx}`)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="نسخ الرقم"
                  >
                    {copiedKey === `vf-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Binance USDT TRC-20 */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-all shadow-lg shadow-black/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">محفظة بينانس USDT</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold font-mono">
                Crypto / Web3
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              عنوان محفظة سداد العربون بالعملات الرقمية (شبكة TRON / TRC-20 المعتمدة):
            </p>

            <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between gap-2">
              <div className="font-mono text-xs text-amber-300 font-bold truncate select-all">
                {PUREX_CONFIG.binanceWallet}
              </div>
              <button
                onClick={() => handleCopy(PUREX_CONFIG.binanceWallet, 'binance')}
                className="shrink-0 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title="نسخ عنوان المحفظة"
              >
                {copiedKey === 'binance' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="text-[11px] text-zinc-500">
              يرجى التحويل عبر شبكة TRC20 ورفع صورة إشعار العملية أو TXID لتأكيد الموعد.
            </div>
          </div>

          {/* Card 3: Contact & Support */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 transition-all shadow-lg shadow-black/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Headphones className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">أرقام التواصل وخدمة العملاء</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                متاح 24/7
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              تواصل فوري مع فريق العمليات والمتابعة الفندقية:
            </p>

            <div className="space-y-2 pt-1">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${PUREX_CONFIG.whatsappIntl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-950/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-zinc-300">الواتساب الرسمي:</span>
                  <span className="text-sm font-mono font-bold text-emerald-300">
                    {PUREX_CONFIG.whatsappNumber}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Support */}
              <a
                href={`tel:${PUREX_CONFIG.supportNumber}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-zinc-300">الدعم الفني:</span>
                  <span className="text-sm font-mono font-bold text-cyan-300">
                    {PUREX_CONFIG.supportNumber}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">اتصال فوري</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white font-sans tracking-tight">
                  Pure<span className="text-cyan-400">X</span>
                </span>
                <span className="text-[10px] mr-2 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                  CyberX
                </span>
              </div>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              منظومة النظافة والتعقيم الفندقية الراقية للشقق والفلل والمقرات الإدارية بأعلى معايير
              الأمان والخصوصية الرقمية المعتمدة.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>فحص أمني معتمد لكافة العاملات وأطقم العمل</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">الخدمات الفندقية</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>نظافة الفلل والقصور المستقلة</li>
              <li>نظافة الشقق والدوبلكس الفندقية</li>
              <li>نظافة ما بعد التشطيب وإزالة الأسمنت والدهان</li>
              <li>تعقيم دورات المياه بالبخار الجاف 180°C</li>
              <li>غسيل الكنب والسجاد بالرغوة الألمانية الجافة</li>
              <li>جلي وتلميع الرخام والكريستال بدون آثار</li>
            </ul>
          </div>

          {/* Col 3: Workers & Careers */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">انضمام العاملات والتوظيف</h4>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              نرحب بالعاملات المحترفات في منظومة النظافة الفندقية بأعلى معدلات دخل وبيئة عمل آمنة.
            </p>
            <Link
              href="/workers/register"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>تسجيل العاملات والتحقق من الهوية ←</span>
            </Link>
          </div>

          {/* Col 4: Operations & Supervision */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">إدارة العمليات والتشغيل</h4>
            <p className="text-xs text-zinc-400 mb-2 leading-relaxed">
              إدارة العمليات الميدانية تحت إشراف:
            </p>
            <div className="text-xs font-semibold text-zinc-200 space-y-1 mb-4">
              <div>• {PUREX_CONFIG.supervisor} (إشراف تقني وتأمين شبكة CyberX)</div>
              <div>• {PUREX_CONFIG.operationsManager} (مديرة العمليات والتشغيل الفندقي)</div>
            </div>
            <Link
              href="/admin/operations"
              className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>دخول لوحة عمليات دنيا وأحمد ←</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar with Required Copyright Signature */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div className="text-center md:text-right font-medium text-zinc-300">
            {PUREX_CONFIG.copyright}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500">
            <span>القاهرة الكبرى</span>
            <span>•</span>
            <span>التجمع الخامس</span>
            <span>•</span>
            <span>الشيخ زايد</span>
            <span>•</span>
            <span>المعادي</span>
            <span>•</span>
            <span>العاصمة الإدارية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
