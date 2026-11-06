'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Calendar,
  Upload,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Trash2,
  Eye,
  MessageCircle,
  ExternalLink,
  Award,
  Lock,
  Headphones,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { PUREX_CONFIG } from '@/lib/constants';

export default function WorkerRegisterPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [experienceYears, setExperienceYears] = useState('3');
  const [specialty, setSpecialty] = useState('نظافة فندقية للشقق والفلل');
  const [notes, setNotes] = useState('');

  // National ID Images
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idFrontName, setIdFrontName] = useState('');
  const [idBack, setIdBack] = useState<string | null>(null);
  const [idBackName, setIdBackName] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState<{ src: string; title: string } | null>(null);
  const [successResult, setSuccessResult] = useState<{
    referenceNumber: string;
    directWhatsAppUrl?: string;
    fullName: string;
  } | null>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setIdFront(reader.result as string);
          setIdFrontName(file.name);
        } else {
          setIdBack(reader.result as string);
          setIdBackName(file.name);
        }
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim() || !age) {
      setErrorMessage('يرجى استيفاء الحقول الإلزامية: الاسم الثلاثي، الهاتف، العنوان والسن');
      return;
    }

    if (Number(age) < 18 || Number(age) > 65) {
      setErrorMessage('يرجى إدخال سن مناسب للعمل (بين 18 و 60 سنة)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        address: address.trim(),
        age: Number(age),
        experienceYears: Number(experienceYears) || 0,
        specialty,
        nationalIdFront: idFront || '',
        nationalIdBack: idBack || '',
        notes: notes.trim(),
      };

      const res = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessResult({
          referenceNumber: data.referenceNumber,
          directWhatsAppUrl: data.directWhatsAppUrl,
          fullName: data.worker.fullName,
        });
      } else {
        setErrorMessage(data.message || 'حدث خطأ أثناء تقديم الطلب، يرجى المحاولة ثانية');
      }
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setWhatsapp('');
    setAddress('');
    setAge('');
    setExperienceYears('3');
    setNotes('');
    setIdFront(null);
    setIdFrontName('');
    setIdBack(null);
    setIdBackName('');
    setSuccessResult(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-zinc-900 to-amber-950/60 border-b border-amber-500/20 py-2.5 px-4 text-center text-xs text-amber-200">
        <span className="font-bold">✨ انضمي إلى نخبة عاملات PureX الفندقيات:</span> بيئة عمل محترمة، رواتب مجزية، وتأمين وحماية كاملة تحت إشراف شبكة CyberX.
      </div>

      {/* Navigation */}
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-10 md:pt-16 md:pb-14 overflow-hidden border-b border-zinc-850">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-6 backdrop-blur-md shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>بوابة التسجيل والتحقق من الهوية الرقمية للكوادر النسائية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            تسجيل العاملات والتحقق من الهوية{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-cyan-400">
              PureX Hotel Standards
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            يرجى ملء النموذج أدناه بدقة وإرفاق صورة واضحة لبطاقة الرقم القومي (وجه وظهر). يتم تدقيق كافة الطلبات والتحقق من صحتها تحت إشراف <strong>د. م/ احمد عمر</strong> و <strong>أ/ دنيا</strong>.
          </p>
        </div>
      </section>

      {/* Form Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Success View */}
        {successResult ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold inline-block mb-3">
                الحالة: قيد المراجعة والتدقيق الأمني ⏳
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                تم استلام طلب انضمامك بنجاح!
              </h2>
              <p className="text-sm text-zinc-300 mt-2">
                شكراً لكِ أ/ {successResult.fullName}. تم إرسال إشعار فوري إلى إدارة PureX.
              </p>
            </div>

            {/* Application Reference Code Card */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-md mx-auto text-center space-y-2">
              <span className="text-xs text-zinc-500 block">رقم الطلب المرجعي:</span>
              <div className="text-3xl font-mono font-black text-cyan-400 tracking-wider">
                {successResult.referenceNumber}
              </div>
              <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                سيتم التواصل معكِ هاتفياً بعد تدقيق بطاقة الرقم القومي لتحديد موعد المقابلة والتسليم.
              </p>
            </div>

            {/* Direct WhatsApp Action to Ahmad (Requirement 5) */}
            <div className="space-y-3 max-w-md mx-auto pt-2">
              <a
                href={
                  successResult.directWhatsAppUrl ||
                  `https://wa.me/${PUREX_CONFIG.whatsappIntl}?text=${encodeURIComponent(
                    `مرحباً م/ أحمد، قمت بتسجيل طلب انضمام كعاملة في PureX برقم: ${successResult.referenceNumber}. أرجو مراجعة الطلب وصورة البطاقة.`
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
              >
                <MessageCircle className="w-5 h-5" />
                <span>إرسال تأكيد التسجيل إلى واتساب م/ أحمد ({PUREX_CONFIG.whatsappNumber})</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                >
                  تقديم طلب جديد
                </button>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-800/90 shadow-2xl shadow-black/80 space-y-8"
          >
            {/* Status Default Notice */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 leading-relaxed">
                <strong className="text-amber-300 block mb-0.5">الحالة الافتراضية للطلب: قيد المراجعة</strong>
                يتم فحص بيانات الهوية الوطنية وتدقيقها أمنياً عبر منصة CyberX، وستتلقين رسالة واتساب بنتيجة الفحص خلال 24 ساعة.
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Section 1: Basic Info */}
            <div className="space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-zinc-850">
                <User className="w-4 h-4 text-cyan-400" />
                <span>1. البيانات الشخصية الأساسية</span>
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-2">
                  الاسم الثلاثي (كما هو في بطاقة الرقم القومي) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: منى إبراهيم أحمد السيد"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Phone & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2">
                    رقم الهاتف المحمول الأساسي *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-right focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2">
                    السن (بالسنوات) *
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="مثال: 28"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-2">
                  العنوان بالتفصيل (المحافظة، المنطقة، اسم الشارع ورقم العمارة) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: الجيزة - فيصل - شارع العشرين عمارة 15 الدور الثاني"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Experience & Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2">
                    سنوات الخبرة السابقة
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                  >
                    <option value="0">بدون خبرة سابقة (تدريب فندقي متاح)</option>
                    <option value="1">سنة واحدة</option>
                    <option value="2">سنتان</option>
                    <option value="3">3 إلى 5 سنوات</option>
                    <option value="6">أكثر من 5 سنوات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2">
                    المجال المفضل للعمل
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                  >
                    <option value="نظافة فندقية للشقق والفلل">نظافة فندقية للشقق والفلل</option>
                    <option value="نظافة ما بعد التشطيب">نظافة ما بعد التشطيب والدهان</option>
                    <option value="غسيل المفروشات والسجاد بالبخار">غسيل المفروشات بالبخار 180°C</option>
                    <option value="جلي وتلميع الرخام والأرضيات">جلي وتلميع الرخام والأرضيات</option>
                    <option value="ضيافة واستقبال بمقرات الشركات">ضيافة واستقبال بمقرات الشركات</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: National ID Upload (Front & Back) */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-850">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>2. صور بطاقة الرقم القومي (الوجه والظهر)</span>
                </h3>
                <span className="text-[11px] text-zinc-400 font-medium">مطلوبة للتحقق الأمني</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* ID Front */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-300 block">
                    بطاقة الرقم القومي - الوجه الأمامي (الصورة والاسم)
                  </span>

                  {!idFront ? (
                    <label className="border-2 border-dashed border-zinc-800 hover:border-cyan-400 rounded-2xl p-5 text-center cursor-pointer transition-all bg-zinc-900/50 hover:bg-zinc-900 flex flex-col items-center justify-center min-h-[170px] group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        className="sr-only"
                      />
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-cyan-300 block">
                        رفع صورة وجه البطاقة
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-1">تصوير مباشر بالكاميرا أو المعرض</span>
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-zinc-900 p-3 space-y-2">
                      <div className="h-32 rounded-xl overflow-hidden bg-black flex items-center justify-center relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={idFront}
                          alt="وجه البطاقة"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewModalImg({ src: idFront, title: 'وجه بطاقة الرقم القومي' })}
                          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          <span>تكبير</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> وجه البطاقة جاهز
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIdFront(null);
                            setIdFrontName('');
                          }}
                          className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ID Back */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-300 block">
                    بطاقة الرقم القومي - ظهر البطاقة (الرقم والمهنة)
                  </span>

                  {!idBack ? (
                    <label className="border-2 border-dashed border-zinc-800 hover:border-cyan-400 rounded-2xl p-5 text-center cursor-pointer transition-all bg-zinc-900/50 hover:bg-zinc-900 flex flex-col items-center justify-center min-h-[170px] group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'back')}
                        className="sr-only"
                      />
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-cyan-300 block">
                        رفع صورة ظهر البطاقة
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-1">تصوير مباشر بالكاميرا أو المعرض</span>
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-zinc-900 p-3 space-y-2">
                      <div className="h-32 rounded-xl overflow-hidden bg-black flex items-center justify-center relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={idBack}
                          alt="ظهر البطاقة"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewModalImg({ src: idBack, title: 'ظهر بطاقة الرقم القومي' })}
                          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          <span>تكبير</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ظهر البطاقة جاهز
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIdBack(null);
                            setIdBackName('');
                          }}
                          className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Notes */}
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-2">
                ملاحظات إضافية، ساعات العمل المناسبة، أو أماكن السكن المفضلة
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أذكري هنا أي تفاصيل تودين إخبار الإدارة بها..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none text-sm"
              />
            </div>

            {/* Privacy Security Note */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
              <Lock className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>
                تخضع كافة البيانات وصور الهوية لتشفير مشدد وأعلى معايير الخصوصية الرقمية تحت إشراف منظومة <strong>CyberX</strong> وتُستخدم حصراً للتحقق الأمني الداخلي.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-500 hover:from-amber-300 hover:to-cyan-400 text-black font-black text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل البيانات والتحقق الأمني...</span>
                </>
              ) : (
                <>
                  <span>إرسال طلب التسجيل (قيد المراجعة)</span>
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </main>

      {/* Modal for Full Image Zoom Preview */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-zinc-900 rounded-2xl border border-zinc-700 p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="text-sm font-bold text-white">{previewModalImg.title}</h4>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-black rounded-xl p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewModalImg.src}
                alt={previewModalImg.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Unified Footer */}
      <Footer />

      {/* Booking Modal Helper */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
