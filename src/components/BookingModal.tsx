'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  CreditCard,
  Upload,
  Copy,
  Check,
  Building,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { PaymentMethod, PropertyType, TimeSlot } from '@/types/booking';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    propertyType: PropertyType;
    areaSquareMeters: number;
    roomsCount: number;
    bathroomsCount: number;
    addOns: string[];
    estimatedPrice: number;
    depositAmount: number;
  };
}

export default function BookingModal({
  isOpen,
  onClose,
  initialData = {
    propertyType: 'apartment',
    areaSquareMeters: 140,
    roomsCount: 3,
    bathroomsCount: 2,
    addOns: ['carpet_steam'],
    estimatedPrice: 2200,
    depositAmount: 500,
  },
}: BookingModalProps) {
  // Steps: 1: Client Info, 2: Schedule & Slots, 3: Deposit & Payment, 4: Success
  const [step, setStep] = useState<number>(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [compound, setCompound] = useState('');
  const [date, setDate] = useState('2026-11-02');
  const [minDate, setMinDate] = useState('');

  React.useEffect(() => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setMinDate(new Date().toISOString().split('T')[0]);
    } catch {
      // fallback
    }
  }, []);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone_cash');
  const [depositReference, setDepositReference] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    id: string;
    referenceNumber: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Payment details
  const paymentDetails = {
    vodafone_cash: {
      title: 'فودافون كاش (Vodafone Cash)',
      number: '010 2489 7750',
      instruction: 'حول العربون عبر كود (*9*7*الرقم*المبلغ#) أو تطبيق أنا فودافون',
      color: 'from-red-500/20 to-red-600/10 border-red-500/40 text-red-400',
    },
    instapay: {
      title: 'إنستا باي (InstaPay اللحظي)',
      number: 'purex.ops@instapay',
      instruction: 'تحويل لحظي مباشر بدون أي رسوم إضافية، تأكيد فوري للحجز',
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/40 text-purple-400',
    },
    binance_usdt: {
      title: 'USDT (Binance / Web3 TRC20)',
      number: 'TX7nLp98Wqy8eN6X4yZ2b9M3qL1kRt54Aa',
      instruction: 'شبكة TRON (TRC-20) فقط. يعادل 1 USDT = 50 ج.م',
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-400',
    },
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitBooking = async () => {
    if (!name.trim() || !phone.trim() || !location.trim()) {
      setErrorMessage('يرجى ملء الاسم، رقم الهاتف والعنوان للمتابعة');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        name,
        phone,
        clientWhatsApp: whatsapp || phone,
        location,
        compoundOrBuilding: compound,
        propertyType: initialData.propertyType,
        areaSquareMeters: initialData.areaSquareMeters,
        roomsCount: initialData.roomsCount,
        bathroomsCount: initialData.bathroomsCount,
        date,
        timeSlot,
        addOns: initialData.addOns,
        estimatedPrice: initialData.estimatedPrice,
        depositAmount: initialData.depositAmount,
        paymentMethod,
        depositConfirmed: Boolean(depositReference || receiptImage),
        depositReference,
        receiptUrl: receiptImage ? 'data:image/receipt_uploaded' : '',
        notes,
      };

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingResult({
          id: data.bookingId,
          referenceNumber: data.booking.referenceNumber || data.bookingId,
        });
        setStep(4);
      } else {
        setErrorMessage(data.message || 'حدث خطأ أثناء إرسال الحجز، يرجى المحاولة ثانية');
      }
    } catch (err: unknown) {
      setErrorMessage('تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setName('');
    setPhone('');
    setWhatsapp('');
    setLocation('');
    setCompound('');
    setDepositReference('');
    setReceiptImage(null);
    setNotes('');
    setBookingResult(null);
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden text-right z-10 my-8"
          dir="rtl"
        >
          {/* Header Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  تأكيد حجز خدمة <span className="text-cyan-400">PureX</span> الفندقية
                </h3>
                <p className="text-xs text-zinc-400">
                  معايير فندقية راقية • ضمان شامل ضد التلفيات • عربون تأكيد الموعد
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Indicator (Only for steps 1-3) */}
          {step < 4 && (
            <div className="px-6 pt-4 pb-2 bg-zinc-900/30 border-b border-zinc-800/50">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
                <div
                  className={`flex items-center gap-2 ${
                    step >= 1 ? 'text-cyan-400' : 'text-zinc-600'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                      step >= 1
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'border-zinc-700'
                    }`}
                  >
                    1
                  </span>
                  بيانات العميل والموقع
                </div>
                <div className="w-8 h-px bg-zinc-800" />
                <div
                  className={`flex items-center gap-2 ${
                    step >= 2 ? 'text-cyan-400' : 'text-zinc-600'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                      step >= 2
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'border-zinc-700'
                    }`}
                  >
                    2
                  </span>
                  الموعد والفترة
                </div>
                <div className="w-8 h-px bg-zinc-800" />
                <div
                  className={`flex items-center gap-2 ${
                    step >= 3 ? 'text-cyan-400' : 'text-zinc-600'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                      step >= 3
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'border-zinc-700'
                    }`}
                  >
                    3
                  </span>
                  العربون وتأكيد الحجز
                </div>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Client Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Cost Summary Pill */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400">التكلفة التقديرية للخدمة:</span>
                    <p className="text-lg font-bold text-cyan-400">
                      {initialData.estimatedPrice.toLocaleString()} ج.م
                    </p>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-zinc-400">عربون تأكيد الموعد:</span>
                    <p className="text-lg font-bold text-emerald-400">
                      {initialData.depositAmount.toLocaleString()} ج.م
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" /> الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: المهندس محمد أحمد"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-cyan-400" /> رقم الهاتف المحمول *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" /> رقم الواتساب (للتأكيدات)
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="نفس رقم الهاتف أو بديل"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> المدينة / المنطقة *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="مثال: التجمع الخامس، الشيخ زايد، المعادي، الرحاب..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                    <Building className="w-4 h-4 text-cyan-400" /> اسم الكمبوند / العمارة ورقم الشقة
                  </label>
                  <input
                    type="text"
                    value={compound}
                    onChange={(e) => setCompound(e.target.value)}
                    placeholder="مثال: كمبوند بالم هيلز - فيلا 18 أو عمارة 4 شقة 12"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: Date & Time */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" /> اختر تاريخ الخدمة أو المعاينة *
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={minDate || undefined}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" /> الفترة الزمنية المفضلة
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setTimeSlot('morning')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        timeSlot === 'morning'
                          ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">فترة صباحية فندقية</span>
                        {timeSlot === 'morning' && (
                          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">09:00 صباحاً حتى 01:00 ظهراً</p>
                    </div>

                    <div
                      onClick={() => setTimeSlot('evening')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        timeSlot === 'evening'
                          ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">فترة ما بعد الظهر</span>
                        {timeSlot === 'evening' && (
                          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">02:00 ظهراً حتى 06:00 مساءً</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    ملاحظات أو طلبات خاصة لفريق العمل
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: يرجى إحضار مادة مخصصة للباركيه الطبيعي، أو التركيز على رخام الدرج..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment Choice & Deposit Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                {/* Deposit Notice Banner */}
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      عربون تأكيد حجز الموعد: {initialData.depositAmount} ج.م
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      يتم خصم هذا المبلغ بالكامل من إجمالي الفاتورة عند الاستلام النهائي. يضمن
                      العربون حجز طاقم العمل ومعدات البخار الفندقية خصيصاً لموعدكم.
                    </p>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    اختر وسيلة تحويل العربون:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('vodafone_cash')}
                      className={`p-3 rounded-2xl border text-right transition-all ${
                        paymentMethod === 'vodafone_cash'
                          ? 'bg-red-500/10 border-red-500 text-white shadow-lg shadow-red-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-sm font-bold text-red-400">فودافون كاش</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">محفظة الهاتف</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('instapay')}
                      className={`p-3 rounded-2xl border text-right transition-all ${
                        paymentMethod === 'instapay'
                          ? 'bg-purple-500/10 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-sm font-bold text-purple-400">إنستا باي InstaPay</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">تحويل بنكي لحظي</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('binance_usdt')}
                      className={`p-3 rounded-2xl border text-right transition-all ${
                        paymentMethod === 'binance_usdt'
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-sm font-bold text-amber-400">Binance USDT</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">TRC20 Wallet</div>
                    </button>
                  </div>
                </div>

                {/* Selected Payment Details Box */}
                <div
                  className={`p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      بيانات التحويل الخاصة بـ: {paymentDetails[paymentMethod].title}
                    </span>
                    <span className="text-xs text-cyan-400 font-mono">
                      القيمة: {initialData.depositAmount} EGP
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800">
                    <div className="font-mono font-bold text-cyan-300 text-sm select-all">
                      {paymentDetails[paymentMethod].number}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          paymentDetails[paymentMethod].number,
                          paymentMethod
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors"
                    >
                      {copiedField === paymentMethod ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الرقم</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400">
                    {paymentDetails[paymentMethod].instruction}
                  </p>
                </div>

                {/* Proof of Transfer / Reference Confirmation */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      رقم العملية أو المرجع (Reference / Transaction ID):
                    </label>
                    <input
                      type="text"
                      value={depositReference}
                      onChange={(e) => setDepositReference(e.target.value)}
                      placeholder="مثال: VF-928410 أو INSTA-381928..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      أو ارفع إشعار/سكرين شوت التحويل (اختياري لتسريع التأكيد):
                    </label>
                    <div className="relative border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-zinc-900/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {receiptImage ? (
                        <div className="flex items-center justify-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-medium">
                            تم إرفاق إيصال التحويل بنجاح
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-zinc-400">
                          <Upload className="w-6 h-6 text-cyan-400" />
                          <span className="text-xs text-zinc-300">
                            اضغط هنا لرفع صورة الإيصال أو اسحب الصورة هنا
                          </span>
                          <span className="text-[11px] text-zinc-500">PNG, JPG حتى 5MB</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Success Confirmation */}
            {step === 4 && bookingResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">
                    تم استلام طلب الحجز بنجاح!
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    أهلاً بك في عالم النظافة الفندقية الفاخرة مع PureX
                  </p>
                </div>

                {/* Booking Code Card */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-sm mx-auto">
                  <span className="text-xs text-zinc-500">كود الحجز المرجعي:</span>
                  <div className="text-2xl font-mono font-bold text-cyan-400 mt-0.5 tracking-wider">
                    {bookingResult.referenceNumber}
                  </div>
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 text-xs text-zinc-400 flex justify-between">
                    <span>تاريخ الموعد:</span>
                    <span className="text-white font-medium">{date}</span>
                  </div>
                </div>

                {/* WhatsApp Webhook Notification Status */}
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 max-w-md mx-auto leading-relaxed">
                  تم إرسال إشعار التذكير التلقائي عبر بوابة <strong>WapiPilot</strong> إلى رقم
                  الواتساب الخاص بك. سيقوم مشرف العمليات بالاتصال بك خلال 15 دقيقة للتأكيد النهائي.
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/201024897750?text=${encodeURIComponent(
                      `مرحباً PureX، قمت للتو بتسجيل الحجز برقم مرجعي: ${bookingResult.referenceNumber}. أود تأكيد الموعد لتاريخ ${date}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>تأكيد الموعد فوراً عبر واتساب</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={resetForm}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors"
                  >
                    إغلاق والعودة للرئيسية
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer Controls (Steps 1-3) */}
          {step < 4 && (
            <div className="p-6 border-t border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1) {
                      if (!name.trim() || !phone.trim() || !location.trim()) {
                        setErrorMessage('يرجى إكمال الاسم، رقم الهاتف والمنطقة');
                        return;
                      }
                      setErrorMessage('');
                    }
                    setStep(step + 1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitBooking}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>جاري إرسال الحجز...</span>
                    </>
                  ) : (
                    <>
                      <span>تأكيد الحجز وتثبيت العربون</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
