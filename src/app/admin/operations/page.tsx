'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  PenTool,
  Printer,
  X,
  Check,
  RefreshCw,
  Eye,
  Star,
  UserCheck,
} from 'lucide-react';
import { Booking, BookingStatus, ChecklistItem, DigitalInspection } from '@/types/booking';

export default function OperationsDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Bookings list state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected booking for inspection or detail view
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);

  // Digital inspection form state
  const [inspectorName, setInspectorName] = useState('م/ دنيا (مديرة العمليات)');
  const [preDamageNotes, setPreDamageNotes] = useState('');
  const [clientRating, setClientRating] = useState<number>(5);
  const [clientFeedback, setClientFeedback] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', titleAr: 'فحص سلامة الأثاث، التحف، واللوحات الفنية قبل البدء', category: 'pre_service', status: 'passed' },
    { id: '2', titleAr: 'فحص سلامة شاشات التلفزيون والأجهزة الكهربائية الحساسة', category: 'pre_service', status: 'passed' },
    { id: '3', titleAr: 'معاينة رخام الأرضيات وتوثيق الخدوش أو الفواصل السابقة', category: 'pre_service', status: 'passed' },
    { id: '4', titleAr: 'تنظيف وتطهير وتعقيم دورات المياه بالبخار 180°C', category: 'post_service', status: 'passed' },
    { id: '5', titleAr: 'جلي وتلميع رخام المدخل والكريستال والزجاج بدون آثار', category: 'post_service', status: 'passed' },
    { id: '6', titleAr: 'شفط وسحب أتربة السجاد والمفروشات بالرغوة الجافة الفندقية', category: 'post_service', status: 'passed' },
    { id: '7', titleAr: 'تعطير العقار بمعطر PureX الفندقي الفاخر', category: 'post_service', status: 'passed' },
  ]);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Fetch bookings from API
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/booking');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  // Simple Admin Auth Verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default passcodes for Donia and operations
    if (passcode === 'purex2026' || passcode === 'cyberx' || passcode === 'donia') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('كلمة المرور غير صحيحة. يرجى تجربة purex2026 أو donia');
    }
  };

  // Update Status Helper
  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch('/api/booking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        if (activeBooking && activeBooking.id === id) {
          setActiveBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Open Inspection Modal for a specific booking
  const handleOpenInspection = (booking: Booking) => {
    setActiveBooking(booking);
    if (booking.inspection) {
      setInspectorName(booking.inspection.inspectedBy || 'م/ دنيا (مديرة العمليات)');
      setPreDamageNotes(booking.inspection.preExistingDamageNotes || '');
      setClientRating(booking.inspection.clientRating || 5);
      setClientFeedback(booking.inspection.clientFeedback || '');
      if (booking.inspection.checklist && booking.inspection.checklist.length > 0) {
        setChecklist(booking.inspection.checklist);
      }
      setHasSignature(Boolean(booking.inspection.clientSignature));
    } else {
      setHasSignature(false);
    }
    setIsInspectionOpen(true);
  };

  // Canvas drawing handlers for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00E5FF';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Submit Inspection Approval
  const handleSaveInspection = async () => {
    if (!activeBooking) return;

    let signatureData = '';
    if (canvasRef.current && hasSignature) {
      signatureData = canvasRef.current.toDataURL('image/png');
    }

    const inspectionData: DigitalInspection = {
      inspectedBy: inspectorName,
      inspectedAt: new Date().toISOString(),
      approvedByClient: true,
      clientRating,
      clientFeedback,
      preExistingDamageNotes: preDamageNotes,
      checklist,
      clientSignature: signatureData || activeBooking.inspection?.clientSignature,
    };

    try {
      const res = await fetch('/api/booking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeBooking.id,
          status: 'completed',
          inspection: inspectionData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === activeBooking.id
              ? { ...b, status: 'completed', inspection: inspectionData }
              : b
          )
        );
        setActiveBooking((prev) =>
          prev ? { ...prev, status: 'completed', inspection: inspectionData } : null
        );
        setIsInspectionOpen(false);
      }
    } catch (err) {
      console.error('Failed to save inspection', err);
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = selectedFilter === 'all' || b.status === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientPhone.includes(searchQuery) ||
      b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // KPI Calculations
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending_deposit').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    inProgress: bookings.filter((b) => b.status === 'in_progress').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    totalDeposits: bookings.reduce((sum, b) => (b.depositConfirmed ? sum + b.depositAmount : sum), 0),
  };

  // Status badge config
  const statusConfig: Record<
    BookingStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    pending_deposit: {
      label: 'بانتظار العربون',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
    },
    confirmed: {
      label: 'مؤكد ومجدول',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
    },
    in_progress: {
      label: 'جاري التنفيذ بالموقع',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
    },
    completed: {
      label: 'مكتمل ومسلّم بالمحضر',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    cancelled: {
      label: 'ملغي',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
    },
  };

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-950 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-right">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-6">
            <Shield className="w-7 h-7" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-white">لوحة تشغيل وإدارة PureX</h1>
            <p className="text-xs text-zinc-400 mt-1">
              مخصصة لـ &quot;م/ دنيا&quot; وفريق مشرفي العمليات والمعاينة الفندقية
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                رمز المرور الإداري (Passcode):
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="أدخل الرمز (مثال: purex2026)"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 text-center tracking-widest text-lg font-mono"
                  autoFocus
                />
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              تسجيل الدخول للوحة العمليات
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-zinc-500 block">
                تلميح سريع للاختبار: كلمة المرور هي <code className="text-cyan-400">purex2026</code> أو <code className="text-cyan-400">donia</code>
              </span>
              <Link href="/" className="text-xs text-zinc-400 hover:text-white mt-3 inline-block">
                ← العودة إلى الموقع الرئيسي
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black" dir="rtl">
      {/* Top Operations Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs">
              <ArrowRight className="w-4 h-4" />
              <span>الموقع الرئيسي</span>
            </Link>

            <div className="h-4 w-px bg-zinc-800" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white flex items-center gap-2">
                  <span>لوحة تشغيل PureX</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-normal">
                    إدارة دنيا
                  </span>
                </h1>
                <p className="text-[11px] text-zinc-400">متابعة العربونات ومحاضر الاستلام الفندقية</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 text-xs font-semibold transition-colors"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400">إجمالي الحجوزات</span>
            <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 bg-amber-500/5">
            <span className="text-[11px] text-amber-400 font-semibold">بانتظار العربون</span>
            <div className="text-2xl font-black text-amber-300 mt-1">{stats.pending}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-cyan-500/30 bg-cyan-500/5">
            <span className="text-[11px] text-cyan-400 font-semibold">حجوزات مؤكدة</span>
            <div className="text-2xl font-black text-cyan-300 mt-1">{stats.confirmed}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-blue-500/30 bg-blue-500/5">
            <span className="text-[11px] text-blue-400 font-semibold">جاري تنفيذها</span>
            <div className="text-2xl font-black text-blue-300 mt-1">{stats.inProgress}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 bg-emerald-500/5">
            <span className="text-[11px] text-emerald-400 font-semibold">مكتملة ومسلّمة</span>
            <div className="text-2xl font-black text-emerald-300 mt-1">{stats.completed}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400">العربونات المحصلة</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {stats.totalDeposits.toLocaleString()} ج.م
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'pending_deposit', label: 'بانتظار العربون' },
              { id: 'confirmed', label: 'المؤكدة' },
              { id: 'in_progress', label: 'قيد التنفيذ' },
              { id: 'completed', label: 'المكتملة' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-cyan-400 text-black shadow-md shadow-cyan-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، الهاتف، الكود..."
              className="w-full pr-10 pl-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Bookings Table / Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>قائمة طلبات المعاينة والنظافة</span>
              <span className="text-xs text-zinc-400">({filteredBookings.length} طلب)</span>
            </h2>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-zinc-950 rounded-3xl border border-zinc-800">
              <p className="text-zinc-400 text-sm">لا توجد طلبات تطابق الفلتر المختار حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBookings.map((order) => {
                const conf = statusConfig[order.status] || statusConfig.pending_deposit;
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Left: Info & Customer */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-bold text-cyan-400 text-sm">
                          {order.referenceNumber}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${conf.bg} ${conf.text} ${conf.border}`}
                        >
                          {conf.label}
                        </span>
                        <span className="text-xs text-zinc-500">
                          بتاريخ {order.serviceDate} •{' '}
                          {order.timeSlot === 'morning' ? 'فترة صباحية (9ص)' : 'فترة مسائية (2م)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-zinc-500 block">العميل:</span>
                          <span className="font-bold text-white text-sm">{order.clientName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">الموقع:</span>
                          <span className="text-zinc-300">
                            {order.clientLocation} {order.compoundOrBuilding ? `(${order.compoundOrBuilding})` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">العقار والمساحة:</span>
                          <span className="text-zinc-300">
                            {order.propertyType} • {order.areaSquareMeters} م² ({order.roomsCount} غرف)
                          </span>
                        </div>
                      </div>

                      {/* Financials & Deposit */}
                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                        <div className="text-zinc-400">
                          الإجمالي التقديري:{' '}
                          <span className="font-bold text-white">{order.estimatedPrice} ج.م</span>
                        </div>
                        <div className="text-zinc-400">
                          العربون:{' '}
                          <span className="font-bold text-emerald-400 font-mono">
                            {order.depositAmount} ج.م
                          </span>{' '}
                          ({order.paymentMethod})
                        </div>
                        {order.depositReference && (
                          <div className="text-zinc-400">
                            رقم العملية:{' '}
                            <span className="font-mono text-cyan-300">
                              {order.depositReference}
                            </span>
                          </div>
                        )}
                        {order.notes && (
                          <div className="text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded text-[11px]">
                            ملاحظة: {order.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-zinc-800">
                      {/* WhatsApp trigger */}
                      <a
                        href={`https://wa.me/20${order.clientPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                          `مرحباً ${order.clientName}، معك دنيا من إدارة تشغيل PureX بخصوص حجزكم كود (${order.referenceNumber}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="مراسلة العميل واتساب"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>واتساب</span>
                      </a>

                      {/* Call trigger */}
                      <a
                        href={`tel:${order.clientPhone}`}
                        className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="اتصال هاتفي"
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      {/* Status Change Quick Actions */}
                      {order.status === 'pending_deposit' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                          className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-xs font-bold transition-all"
                        >
                          تأكيد استلام العربون
                        </button>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'in_progress')}
                          className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400 text-blue-300 text-xs font-bold transition-all"
                        >
                          بدء تشغيل الموقع
                        </button>
                      )}

                      {/* Open Digital Inspection Checklist */}
                      <button
                        onClick={() => handleOpenInspection(order)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs flex items-center gap-2 shadow-md shadow-cyan-500/15 cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>محضر المعاينة والاستلام</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Digital Inspection Checklist Modal */}
      {isInspectionOpen && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-zinc-950 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden text-right my-8">
            {/* Modal Top Bar */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    محضر المعاينة والاستلام الرقمي (Digital Inspection)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    رقم الطلب: <span className="font-mono text-cyan-400">{activeBooking.referenceNumber}</span> • العميل: {activeBooking.clientName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="طباعة المحضر"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsInspectionOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Supervisor & Property Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">اسم المشرف المسؤول عن المعاينة:</label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white font-semibold focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">بيانات الوحدة والموقع:</span>
                  <p className="text-zinc-200 font-medium pt-1.5">
                    {activeBooking.clientLocation} - {activeBooking.propertyType} ({activeBooking.areaSquareMeters} م²)
                  </p>
                </div>
              </div>

              {/* Pre-Service Damage Notes */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  حصر التلفيات والخدوش السابقة (قبل بدء العمل):
                </label>
                <textarea
                  rows={2}
                  value={preDamageNotes}
                  onChange={(e) => setPreDamageNotes(e.target.value)}
                  placeholder="وثق أي خدوش في الرخام، دهانات متأثرة، أو كسور قديمة لإخلاء مسؤولية الطاقم..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Inspection Checklist */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  بنود الفحص الفندقي وجودة التسليم (Checklist):
                </label>
                <div className="space-y-2">
                  {checklist.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-zinc-200">{item.titleAr}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setChecklist((prev) =>
                              prev.map((c) =>
                                c.id === item.id ? { ...c, status: 'passed' } : c
                              )
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                            item.status === 'passed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          مطابق ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setChecklist((prev) =>
                              prev.map((c) =>
                                c.id === item.id ? { ...c, status: 'issue_flagged' } : c
                              )
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                            item.status === 'issue_flagged'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          ملاحظة ⚠
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Rating & Feedback */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">تقييم العميل لجودة الخدمة:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setClientRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= clientRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={clientFeedback}
                  onChange={(e) => setClientFeedback(e.target.value)}
                  placeholder="ملاحظات أو تعليق العميل عند الاستلام..."
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Digital Signature Pad (Canvas) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-cyan-400" />
                    توقيع العميل / المشرف الرقمي (Sign-off):
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-xs text-zinc-400 hover:text-red-400 underline"
                  >
                    مسح وإعادة التوقيع
                  </button>
                </div>

                <div className="border border-cyan-500/30 rounded-2xl bg-black p-2 overflow-hidden text-center">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-36 bg-zinc-950/90 rounded-xl cursor-crosshair touch-none"
                  />
                  <span className="text-[11px] text-zinc-500 block mt-1">
                    وقع هنا بإصبعك على شاشة اللمس أو بالماوس لاعتماد استلام العقار رسمياً
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsInspectionOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleSaveInspection}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>اعتماد المحضر وتأكيد اكتمال الطلب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
