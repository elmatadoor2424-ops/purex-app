'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Building2,
  Hammer,
  Briefcase,
  Sparkles,
  Check,
  ShieldCheck,
  ArrowLeft,
  ChevronDown,
  Info,
  Layers,
  Zap,
} from 'lucide-react';
import { PropertyType } from '@/types/booking';

interface PricingCalculatorProps {
  onOpenBooking: (calculation: {
    propertyType: PropertyType;
    areaSquareMeters: number;
    roomsCount: number;
    bathroomsCount: number;
    addOns: string[];
    estimatedPrice: number;
    depositAmount: number;
  }) => void;
}

interface PropertyOption {
  type: PropertyType;
  titleAr: string;
  subtitleAr: string;
  baseRatePerM2: number;
  minArea: number;
  maxArea: number;
  defaultArea: number;
  icon: React.ComponentType<{ className?: string }>;
}

const PROPERTY_OPTIONS: PropertyOption[] = [
  {
    type: 'apartment',
    titleAr: 'شقة سكنية',
    subtitleAr: 'تنظيف فندقي عميق للشقق والدوبلكس',
    baseRatePerM2: 12,
    minArea: 60,
    maxArea: 350,
    defaultArea: 140,
    icon: Home,
  },
  {
    type: 'villa',
    titleAr: 'فيلا مستقلة / تاون',
    subtitleAr: 'شامل المداخل والحديقة والأسطح',
    baseRatePerM2: 14,
    minArea: 200,
    maxArea: 900,
    defaultArea: 380,
    icon: Building2,
  },
  {
    type: 'post_construction',
    titleAr: 'ما بعد التشطيب',
    subtitleAr: 'إزالة الأسمنت، الدهانات، وغبار الفواصل',
    baseRatePerM2: 18,
    minArea: 80,
    maxArea: 600,
    defaultArea: 220,
    icon: Hammer,
  },
  {
    type: 'commercial',
    titleAr: 'مقرات ومكاتب إدارية',
    subtitleAr: 'بيئة عمل نقية ومعقمة بنظام الفترات',
    baseRatePerM2: 13,
    minArea: 100,
    maxArea: 1000,
    defaultArea: 280,
    icon: Briefcase,
  },
];

const AVAILABLE_ADD_ONS = [
  {
    id: 'carpet_steam',
    title: 'تنظيف وسحب أتربة السجاد بالبخار الجاف 180°C',
    description: 'تطهير وإزالة البقع المستعصية مع جفاف فوري خلال 30 دقيقة',
    price: 350,
    badge: 'الأكثر طلباً',
  },
  {
    id: 'sofa_deep_clean',
    title: 'غسيل وتطهير الانتريهات والصالونات',
    description: 'رغوة جافة ألمانية تحافظ على ألوان الأقمشة وتزيل الروائح',
    price: 450,
    badge: 'شامل التعقيم',
  },
  {
    id: 'crystal_polishing',
    title: 'تلميع النجف والكريستال والرخام الطبيعي',
    description: 'مواد إيطالية خاصة لعزل الرخام وإعادة بريق الكريستال',
    price: 400,
    badge: 'عناية فائقة',
  },
  {
    id: 'kitchen_degreasing',
    title: 'إزالة دهون المطابخ والأجهزة بالضغط العالي',
    description: 'تفكيك وتنظيف الشفاط، البوتاجاز، والأفران بتقنية البخار النفاث',
    price: 500,
    badge: 'تعقيم كيميائي آمن',
  },
  {
    id: 'ozone_sterilization',
    title: 'تعقيم نانو وتطهير بالغاز النشط (Ozone & Nano)',
    description: 'القضاء على 99.9% من البكتيريا والفيروسات في تكييفات الهواء',
    price: 300,
    badge: 'حماية طبية',
  },
];

export default function PricingCalculator({ onOpenBooking }: PricingCalculatorProps) {
  const [selectedType, setSelectedType] = useState<PropertyType>('apartment');
  const [area, setArea] = useState<number>(140);
  const [rooms, setRooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['carpet_steam']);

  const currentOption = useMemo(
    () => PROPERTY_OPTIONS.find((o) => o.type === selectedType) || PROPERTY_OPTIONS[0],
    [selectedType]
  );

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Pricing formula
  const calculation = useMemo(() => {
    const basePropertyCost = Math.round(area * currentOption.baseRatePerM2);
    const roomsFactor = (rooms - 2) * 120; // minor room adjustment
    const bathroomsFactor = (bathrooms - 1) * 150; // bathroom deep sanitizing
    const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
      const found = AVAILABLE_ADD_ONS.find((a) => a.id === addOnId);
      return sum + (found ? found.price : 0);
    }, 0);

    const subtotal = Math.max(
      1200,
      basePropertyCost + Math.max(0, roomsFactor) + Math.max(0, bathroomsFactor) + addOnsTotal
    );

    // Online booking discount 10%
    const onlineDiscount = Math.round(subtotal * 0.1);
    const estimatedTotal = subtotal - onlineDiscount;

    // Deposit is either 20% or flat 500/1000 minimum
    const depositAmount = Math.max(500, Math.round((estimatedTotal * 0.25) / 50) * 50);

    return {
      basePropertyCost,
      roomsFactor: Math.max(0, roomsFactor),
      bathroomsFactor: Math.max(0, bathroomsFactor),
      addOnsTotal,
      subtotal,
      onlineDiscount,
      estimatedTotal,
      depositAmount,
    };
  }, [area, currentOption.baseRatePerM2, rooms, bathrooms, selectedAddOns]);

  const handleBookNow = () => {
    onOpenBooking({
      propertyType: selectedType,
      areaSquareMeters: area,
      roomsCount: rooms,
      bathroomsCount: bathrooms,
      addOns: selectedAddOns,
      estimatedPrice: calculation.estimatedTotal,
      depositAmount: calculation.depositAmount,
    });
  };

  return (
    <div id="pricing-calculator" className="relative w-full py-12" dir="rtl">
      {/* Background glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>حاسبة الأسعار التفاعلية والذكية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            احسب تكلفة نظافة عقارك <span className="text-cyan-400">بدقة وشفافية مطلقة</span>
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base leading-relaxed">
            اختر نوع العقار، حدد المساحة، وأضف باقات التعقيم المطلوبة للحصول على تسعير فوري
            وفندقي بدون أي تكاليف خفية.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Controls Column (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Property Type Selection */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-md">
              <label className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  1
                </span>
                اختر نوع العقار أو الوحدة:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PROPERTY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => {
                        setSelectedType(opt.type);
                        setArea(opt.defaultArea);
                      }}
                      className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/10 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                          isSelected ? 'bg-cyan-400 text-black' : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{opt.titleAr}</div>
                        <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                          {opt.subtitleAr}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Area Slider & Dimensions */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                    2
                  </span>
                  المساحة الإجمالية للعقار:
                </label>
                <div className="px-3.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-base">
                  {area} م²
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={currentOption.minArea}
                  max={currentOption.maxArea}
                  step={10}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>{currentOption.minArea} م²</span>
                  <span>{Math.round((currentOption.minArea + currentOption.maxArea) / 2)} م²</span>
                  <span>{currentOption.maxArea} م²</span>
                </div>
              </div>

              {/* Rooms & Bathrooms selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-800/80">
                <div>
                  <span className="text-xs text-zinc-400 block mb-2">عدد الغرف والمساحات:</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRooms(num)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          rooms === num
                            ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {num === 6 ? '+5' : num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 block mb-2">عدد دورات المياه:</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBathrooms(num)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          bathrooms === num
                            ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {num === 5 ? '+4' : num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Add-on Checkboxes */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-md">
              <label className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  3
                </span>
                الخدمات الفندقية الإضافية (Add-ons):
              </label>

              <div className="space-y-3">
                {AVAILABLE_ADD_ONS.map((addOn) => {
                  const isChecked = selectedAddOns.includes(addOn.id);
                  return (
                    <div
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isChecked
                          ? 'bg-cyan-500/10 border-cyan-400/80 shadow-md shadow-cyan-500/5'
                          : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-cyan-400 border-cyan-400 text-black'
                              : 'border-zinc-700 bg-zinc-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{addOn.title}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold">
                              {addOn.badge}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{addOn.description}</p>
                        </div>
                      </div>

                      <div className="text-left shrink-0 font-mono">
                        <span className="text-sm font-bold text-cyan-300">+{addOn.price}</span>
                        <span className="text-[11px] text-zinc-400 block">ج.م</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing Estimation Summary Sticky Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 space-y-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    عرض التسعير اللحظي
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  خصم الحجز الذاتي 10%
                </span>
              </div>

              {/* Total Price Display */}
              <div className="space-y-1">
                <span className="text-xs text-zinc-400">إجمالي التكلفة المتوقعة:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 tracking-tight">
                    {calculation.estimatedTotal.toLocaleString()}
                  </span>
                  <span className="text-lg text-cyan-400 font-bold">ج.م</span>
                  <span className="text-sm text-zinc-500 line-through mr-2">
                    {calculation.subtotal.toLocaleString()} ج.م
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  شامل كافة المواد والمعدات الفندقية ورسوم الفريق والمشرف المخصص.
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800/80 space-y-2.5 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>
                    نظافة أساسية ({currentOption.titleAr} - {area} م²):
                  </span>
                  <span className="font-mono">{calculation.basePropertyCost} ج.م</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>
                    الخدمات والغرف ({rooms} غرف + {bathrooms} حمام):
                  </span>
                  <span className="font-mono">
                    {calculation.roomsFactor + calculation.bathroomsFactor} ج.م
                  </span>
                </div>

                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between text-cyan-300">
                    <span>الباقات الإضافية المختارة ({selectedAddOns.length}):</span>
                    <span className="font-mono">+{calculation.addOnsTotal} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-400 pt-2 border-t border-zinc-800">
                  <span>خصم المنصة الفوري (10%):</span>
                  <span className="font-mono">-{calculation.onlineDiscount} ج.م</span>
                </div>
              </div>

              {/* Deposit Required Card */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-cyan-300 font-medium block">
                    العربون المطلوب لتأكيد الموعد:
                  </span>
                  <span className="text-[11px] text-zinc-400">يُخصم من الإجمالي عند الاستلام</span>
                </div>
                <div className="text-left font-mono">
                  <span className="text-2xl font-black text-emerald-400">
                    {calculation.depositAmount}
                  </span>
                  <span className="text-xs text-emerald-400 mr-1">ج.م</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>ضمان CyberX الماسي: إعادة التنظيف مجاناً في حال وجود أي ملاحظة.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>محضر استلام وفحص رقمي قبل وبعد الخدمة لضمان أمان المقتنيات.</span>
                </div>
              </div>

              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-base shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <span>احجز موعدك الآن وأكد العربون</span>
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="text-center">
                <span className="text-[11px] text-zinc-500">
                  دفع العربون متاح عبر فودافون كاش، إنستا باي، وUSDT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
