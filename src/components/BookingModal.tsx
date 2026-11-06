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
  ImageIcon,
  Trash2,
  Wallet,
  PhoneCall,
} from 'lucide-react';
import { PaymentMethod, PropertyType, TimeSlot } from '@/types/booking';
import { PUREX_CONFIG } from '@/lib/constants';

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [compound, setCompound] = useState('');
  const [date, setDate] = useState('2026-11-07');
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
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    id: string;
    referenceNumber: string;
    directWhatsAppUrl?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت');
        return;
      }
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceiptImage = () => {
    setReceiptImage(null);
    setReceiptFileName('');
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
        receiptUrl: receiptImage || '',
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
          directWhatsAppUrl: data.directWhatsAppUrl,
        });
        setStep(4);
      } else {
        setErrorMessage(data.message || 'حدث خطأ أثناء إرسال الحجز، يرجى المحاولة ثانية');
      }
    } catch {
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
    setReceiptFileName('');
    setNotes('');
    setBookingResult(null);
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden text-right z-10 my-8 font-sans"
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
                  تأمين وإشراف شبكة CyberX • د. م/ احمد عمر • ضمان شامل ضد أي تلفيات
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
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 1 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-zinc-800 text-zinc-600'
                    }`}
                  >
                    1
                  </span>
                  <span>بيانات العميل</span>
                </div>

                <div className="w-8 h-px bg-zinc-800" />

                <div
                  className={`flex items-center gap-2 ${
                    step >= 2 ? 'text-cyan-400' : 'text-zinc-600'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 2 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-zinc-800 text-zinc-600'
                    }`}
                  >
                    2
                  </span>
                  <span>الموعد والفترة</span>
                </div>

                <div className="w-8 h-px bg-zinc-800" />

                <div
                  className={`flex items-center gap-2 ${
                    step >= 3 ? 'text-cyan-400' : 'text-zinc-600'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 3 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-zinc-800 text-zinc-600'
                    }`}
                  >
                    3
                  </span>
                  <span>سداد العربون والإثبات</span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
                {errorMessage}
              </div>
            )}

            {/* STEP 1: Client Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" /> الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: د. أحمد عمر أو أ/ دنيا"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-cyan-400" /> رقم الهاتف الأساسي *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 01094200285"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 text-right focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" /> رقم الواتساب للتأكيد
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="نفس الرقم أو رقم آخر"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 text-right focus:outline-none focus:border-cyan-400 transition-colors"
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
                    <Building className="w-4 h-4 text-cyan-400" /> اسم الكمبوند / البرج ورقم الشقة
                  </label>
                  <input
                    type="text"
                    value={compound}
                    onChange={(e) => setCompound(e.target.value)}
                    placeholder="مثال: كمبوند ميفيدا - فيلا 42 أو عمارة 14 شقة 302"
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
                    <Calendar className="w-4 h-4 text-cyan-400" /> اختر تاريخ الخدمة أو الزيارة *
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
                    ملاحظات أو طلبات خاصة لفريق العمل والمشرف
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: يرجى التركيز على تعقيم المطبخ والباركيه وجلي رخام المدخل..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment Choice & Upload Proof of Transfer */}
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
                      يُخصم بالكامل من إجمالي الفاتورة ({initialData.estimatedPrice} ج.م). يضمن العربون
                      حجز طاقم العمل ومعدات البخار الفندقية 180°C خصيصاً لموعدكم.
                    </p>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    اختر وسيلة تحويل العربون المعتمدة:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('vodafone_cash')}
                      className={`p-3.5 rounded-2xl border text-right transition-all ${
                        paymentMethod === 'vodafone_cash' || paymentMethod === 'axis_pay'
                          ? 'bg-red-500/10 border-red-500 text-white shadow-lg shadow-red-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-red-400">فودافون كاش & Axis Pay</span>
                        {(paymentMethod === 'vodafone_cash' || paymentMethod === 'axis_pay') && (
                          <CheckCircle2 className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        تحويل عبر محفظة الهاتف أو تطبيق اكسيس باي
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('binance_usdt')}
                      className={`p-3.5 rounded-2xl border text-right transition-all ${
                        paymentMethod === 'binance_usdt'
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-amber-400">محفظة بينانس Binance USDT</span>
                        {paymentMethod === 'binance_usdt' && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400">شبكة TRC-20 Web3</div>
                    </button>
                  </div>
                </div>

                {/* Case 1: Vodafone Cash & Axis Pay Accounts Box */}
                {(paymentMethod === 'vodafone_cash' || paymentMethod === 'axis_pay') && (
                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-red-400" />
                        <span>أرقام التحويل المعتمدة (فودافون كاش واكسيس باي Axis Pay):</span>
                      </span>
                      <span className="text-xs text-cyan-400 font-mono font-bold">
                        العربون: {initialData.depositAmount} EGP
                      </span>
                    </div>

                    <div className="space-y-2">
                      {PUREX_CONFIG.vodafoneCashNumbers.map((num, idx) => (
                        <div
                          key={num}
                          className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500 font-mono">حساب {idx + 1}:</span>
                            <span className="font-mono font-bold text-cyan-300 text-base select-all">
                              {num}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(num, `acc-${idx}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors"
                          >
                            {copiedKey === `acc-${idx}` ? (
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
                      ))}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      💡 يمكن التحويل من أي محفظة فودافون كاش بكود التحويل أو عبر تطبيق <strong>Axis Pay</strong> مباشرة لأي من الرقمين أعلاه، ثم إرفاق صورة إشعار التحويل بالأسفل لتثبيت الحجز فوراً.
                    </p>
                  </div>
                )}

                {/* Case 2: Binance USDT Account Box */}
                {paymentMethod === 'binance_usdt' && (
                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-amber-400" />
                        <span>عنوان محفظة بينانس USDT (TRC-20):</span>
                      </span>
                      <span className="text-xs text-amber-400 font-mono font-bold">
                        يعادل ~ {Math.round(initialData.depositAmount / 50)} USDT
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800 gap-2">
                      <span className="font-mono font-bold text-amber-300 text-xs truncate select-all">
                        {PUREX_CONFIG.binanceWallet}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(PUREX_CONFIG.binanceWallet, 'binance-wallet')}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors"
                      >
                        {copiedKey === 'binance-wallet' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ العنوان</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400">
                      شبكة TRON (TRC-20) فقط. يرجى إرفاق لقطة شاشة للعملية لتأكيد الاستلام.
                    </p>
                  </div>
                )}

                {/* Upload Proof of Transfer (Requirement 3) */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-sm font-bold text-white mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-cyan-400" />
                        <span>إرفاق صورة إثبات التحويل (سكرين شوت الإشعار أو الإيصال) *</span>
                      </span>
                      {receiptImage && (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> تم الإرفاق
                        </span>
                      )}
                    </label>

                    {!receiptImage ? (
                      <label className="relative border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer transition-all bg-cyan-950/10 hover:bg-cyan-950/20 block group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-cyan-300 block">
                              اضغط هنا لرفع صورة إثبات التحويل
                            </span>
                            <span className="text-xs text-zinc-400 mt-1 block">
                              سكرين شوت من تطبيق فودافون كاش أو Axis Pay أو تطبيق البنك
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-500">يدعم JPG, PNG, WEBP حتى 8MB</span>
                        </div>
                      </label>
                    ) : (
                      <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {/* Thumbnail preview */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-zinc-700 shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={receiptImage}
                              alt="إثبات التحويل"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">
                              {receiptFileName || 'صورة إثبات التحويل'}
                            </div>
                            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>جاهز للإرسال الفوري لإدارة العمليات</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeReceiptImage}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors shrink-0"
                          title="حذف واختيار صورة أخرى"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reference ID input */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      رقم العملية أو المرجع (Reference / Transaction ID) إن وُجد:
                    </label>
                    <input
                      type="text"
                      value={depositReference}
                      onChange={(e) => setDepositReference(e.target.value)}
                      placeholder="مثال: VF-928410 أو AXIS-381928 أو TXID..."
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Success Confirmation */}
            {step === 4 && bookingResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">
                    تم استلام طلب الحجز وإثبات التحويل بنجاح!
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    أهلاً بك في عالم النظافة الفندقية الفاخرة مع PureX تحت إشراف د. م/ احمد عمر
                  </p>
                </div>

                {/* Booking Code Card */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-sm mx-auto text-center space-y-2">
                  <span className="text-xs text-zinc-500 block">كود الحجز المرجعي الخاص بك:</span>
                  <div className="text-3xl font-mono font-black text-cyan-400 tracking-wider">
                    {bookingResult.referenceNumber}
                  </div>
                  <div className="pt-2 border-t border-zinc-800/80 text-xs text-zinc-400 flex justify-between px-2">
                    <span>تاريخ الموعد:</span>
                    <span className="text-white font-medium">{date}</span>
                  </div>
                  <div className="text-xs text-zinc-400 flex justify-between px-2">
                    <span>إثبات التحويل:</span>
                    <span className="text-emerald-400 font-medium">
                      {receiptImage ? '✓ تم رفع الصورة' : 'مسجل برقم العملية'}
                    </span>
                  </div>
                </div>

                {/* Direct WhatsApp Notification to Ahmad */}
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed text-right">
                    تم توجيه إشعار الحجز تلقائياً إلى رقم إدارة العمليات. يمكنك الضغط أدناه لإرسال رسالة واتساب مباشرة إلى م/ أحمد ({PUREX_CONFIG.whatsappNumber}) مع كود الحجز وصورة التحويل لتأكيد الموعد فوراً.
                  </div>

                  <a
                    href={
                      bookingResult.directWhatsAppUrl ||
                      `https://wa.me/${PUREX_CONFIG.whatsappIntl}?text=${encodeURIComponent(
                        `مرحباً PureX، قمت بحجز موعد برقم مرجعي: ${bookingResult.referenceNumber} لتاريخ ${date}. أود تأكيد سداد العربون وتثبيت الموعد.`
                      )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>إرسال تفاصيل الحجز إلى واتساب م/ أحمد ({PUREX_CONFIG.whatsappNumber})</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a
                      href={`tel:${PUREX_CONFIG.supportNumber}`}
                      className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                      <span>اتصال بالدعم الفني: {PUREX_CONFIG.supportNumber}</span>
                    </a>

                    <button
                      onClick={resetForm}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
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
                  className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
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
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
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
                      <span>جاري إرسال الحجز والإثبات...</span>
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
