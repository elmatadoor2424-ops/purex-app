'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import PricingCalculator from '@/components/PricingCalculator';
import BookingModal from '@/components/BookingModal';
import Footer from '@/components/Footer';
import { PUREX_CONFIG } from '@/lib/constants';
import { PropertyType } from '@/types/booking';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Flame,
  Droplets,
  Star,
  Users,
  ChevronDown,
  PhoneCall,
  MessageCircle,
  FileText,
  BadgeCheck,
  ArrowLeft,
  ChevronLeft,
  HeartHandshake,
} from 'lucide-react';

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<{
    propertyType: PropertyType;
    areaSquareMeters: number;
    roomsCount: number;
    bathroomsCount: number;
    addOns: string[];
    estimatedPrice: number;
    depositAmount: number;
  }>({
    propertyType: 'apartment',
    areaSquareMeters: 140,
    roomsCount: 3,
    bathroomsCount: 2,
    addOns: ['carpet_steam'],
    estimatedPrice: 2200,
    depositAmount: 500,
  });

  const handleOpenBooking = (calcData?: typeof bookingPrefill) => {
    if (calcData) {
      setBookingPrefill(calcData);
    }
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black font-sans" dir="rtl">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-cyan-950 border-b border-cyan-500/20 py-2 px-4 text-center text-xs text-cyan-200">
        <span className="font-bold">✨ عرض الإطلاق الحصري:</span> خصم 10% تلقائي عند الحجز الذاتي عبر المنصة وتأكيد العربون أونلاين.
      </div>

      {/* Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-8 backdrop-blur-md shadow-lg shadow-cyan-500/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PureX • منظومة النظافة والتعقيم الفندقي الفاخر | CyberX</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.2] sm:leading-[1.15]">
            خدمات نظافة فندقية للشقق والفلل{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">
              بأعلى معايير الأمان والاحترافية
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            نعتني بأدق تفاصيل منزلك عبر أطقم فندقية متخصصة، أجهزة بخار جاف ألمانية 180°C، ومحضر
            فحص واستلام رقمي يضمن سلامة مقتنياتك وثقتك المطلقة.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('pricing-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <span>احسب التكلفة فوراً بالآلة الذكية</span>
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={() => handleOpenBooking()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              <span>حجز موعد مباشر وسداد العربون</span>
            </button>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-right">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold text-lg">100%</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">فحص جنائي لكافة الكوادر</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Flame className="w-5 h-5" />
                <span className="font-bold text-lg">180°C</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">بخار جاف للتعقيم الفائق</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <FileText className="w-5 h-5" />
                <span className="font-bold text-lg">رقمي</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">محضر استلام وتوقيع إلكتروني</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Star className="w-5 h-5 fill-cyan-400" />
                <span className="font-bold text-lg">4.9 / 5</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">+1,400 عميل نخبة راضٍ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Calculator Component */}
      <PricingCalculator onOpenBooking={handleOpenBooking} />

      {/* Hotel Standards & 6 Quality Pillars */}
      <section id="hotel-standards" className="py-24 bg-zinc-950/60 border-t border-b border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>معايير الضيافة الفندقية 5 نجوم</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              لماذا لا نُشبه شركات النظافة التقليدية؟
            </h2>
            <p className="mt-4 text-zinc-400 text-base leading-relaxed">
              تتبع PureX بروتوكولاً صارماً مستوحى من كبرى السلاسل الفندقية العالمية لضمان تجربة
              نقاء استثنائية وأمان كامل لمنزلك ومقتنياتك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">تقنية البخار الجاف النفاث (180°C)</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                نقضي على 99.9% من حشرات الفراش، العث، والبكتيريا غير المرئية في المفروشات
                والمراتب والسجاد دون إغراق الأقمشة بالمياه وبجفاف سريع.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">كوادر أمنية موثوقة ومفحوصة</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                جميع أفراد الطاقم تم التحقق من سجلهم الجنائي وإخضاعهم لاختبارات أمان صارمة مع
                ارتداء زي موحد وبطاقات تعريف رقمية ذكية.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">محضر فحص واستلام إلكتروني</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                نقوم بحصر الغرف والمقتنيات الثمينة وتوثيق أي ملاحظات مسبقة قبل لمس أي شيء، مع توقيع
                رقمي للعميل عند الاستلام النهائي.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">مواد كيميائية ألمانية معتمدة</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                خالية تماماً من الأحماض الكاوية أو الكلور المركز؛ نستخدم محاليل أوروبية تحافظ على بريق
                الرخام الطبيعي، الباركيه، وخلاطات جروهي دون بهتان.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">مشرف جودة فندقي مخصص</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                لا نترك العمال بمفردهم أبداً؛ يتواجد مشرف عمليات متخصص (مثل كابتن / دنيا) لمتابعة
                قائمة الفحص والمراجعة خطوة بخطوة حتى التسليم.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ضمان إعادة التنظيف الشامل</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                إذا وجدت أي ملاحظة لم تنل رضاك بنسبة 100% خلال 24 ساعة، يعود فريقنا لمعالجتها فوراً
                بدون أي رسوم إضافية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table: Traditional vs. PureX */}
      <section id="why-purex" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            المقارنة الواضحة: تنظيف تقليدي أم <span className="text-cyan-400">PureX الفندقية</span>؟
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            اكتشف الفرق الذي يجعل عملاء الكمبوندات والفيلات يفضلون PureX دائماً
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-2xl">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/70">
                <th className="py-4 px-6 text-zinc-300 font-bold">وجه المقارنة</th>
                <th className="py-4 px-6 text-zinc-400 font-medium">الشركات والعمالة الفردية</th>
                <th className="py-4 px-6 text-cyan-400 font-bold bg-cyan-950/30">
                  معايير PureX الفندقية (CyberX)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              <tr>
                <td className="py-4 px-6 font-semibold text-white">أمان الكوادر والتحقق الجنائي</td>
                <td className="py-4 px-6 text-zinc-400">عمالة مجهولة المصدر بدون فحص موثق</td>
                <td className="py-4 px-6 text-cyan-300 bg-cyan-950/20 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  فحص جنائي وتحري أمني كامل لكل فرد
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-white">المعدات ودرجة التعقيم</td>
                <td className="py-4 px-6 text-zinc-400">مماسح تقليدية تنقل الجراثيم بين الغرف</td>
                <td className="py-4 px-6 text-cyan-300 bg-cyan-950/20 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  أجهزة بخار جاف ألمانية 180°C ومايكروفايبر معقم
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-white">سلامة الرخام والأرضيات الثمينة</td>
                <td className="py-4 px-6 text-zinc-400">فلاش وكلور يسبب حفر الرخام وتلف الخلاطات</td>
                <td className="py-4 px-6 text-cyan-300 bg-cyan-950/20 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  محاليل متوازنة PH خالية من الكاويات معزولة للرخام
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-white">توثيق الاستلام والتلفيات</td>
                <td className="py-4 px-6 text-zinc-400">لا يوجد أي محضر أو إثبات لحالة العقار</td>
                <td className="py-4 px-6 text-cyan-300 bg-cyan-950/20 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  محضر استلام رقمي وتوقيع حي قبل وبعد الخدمة
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-white">نظام الدفع وتأكيد الحجز</td>
                <td className="py-4 px-6 text-zinc-400">كاش عشوائي بدون إيصالات رسمية</td>
                <td className="py-4 px-6 text-cyan-300 bg-cyan-950/20 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  فودافون كاش، إنستا باي، أو USDT مع إشعار واتساب فوري
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Worker Recruitment Banner */}
      <section className="py-8 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/5">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>فرص انضمام للعاملات المتميزات</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              انضمي لفريق عاملات PureX الفندقيات
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              رواتب مجزية، بيئة عمل فندقية راقية، وتأمين وحماية كاملة تحت إشراف شبكة CyberX. سجلي الآن وارفعي صورة بطاقة الرقم القومي.
            </p>
          </div>

          <Link
            href="/workers/register"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>بوابة تسجيل العاملات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Floating CTA Banner */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-900/60 via-zinc-900 to-blue-900/60 border border-cyan-500/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl shadow-cyan-500/10">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              جاهز لتجربة نظافة تفوق توقعاتك؟
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              احجز موعدك الآن عبر الآلة التفاعلية، ادفع العربون بأمان عبر فودافون كاش أو Axis Pay أو USDT،
              ودع فريق PureX يتولى الباقي بأعلى المعايير الفندقية.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-sm shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105 cursor-pointer"
              >
                حجز موعد فوري
              </button>
              <a
                href={`https://wa.me/${PUREX_CONFIG.whatsappIntl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب م/ أحمد ({PUREX_CONFIG.whatsappNumber})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Global Unified Footer */}
      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={bookingPrefill}
      />
    </div>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
