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
  CreditCard,
  Image as ImageIcon,
  UserX,
  Users,
  Building,
  Upload,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  Booking,
  BookingStatus,
  ChecklistItem,
  DigitalInspection,
  WorkerRegistration,
  WorkerStatus,
} from '@/types/booking';
import { PUREX_CONFIG } from '@/lib/constants';

export default function OperationsDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Top Tabs: 'bookings' | 'workers'
  const [activeTab, setActiveTab] = useState<'bookings' | 'workers'>('bookings');

  // Bookings list state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookingsLoading, setIsBookingsLoading] = useState(false);
  const [selectedBookingFilter, setSelectedBookingFilter] = useState<string>('all');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');

  // Workers list state
  const [workers, setWorkers] = useState<WorkerRegistration[]>([]);
  const [isWorkersLoading, setIsWorkersLoading] = useState(false);
  const [selectedWorkerFilter, setSelectedWorkerFilter] = useState<string>('all');
  const [workerSearchQuery, setWorkerSearchQuery] = useState('');

  // Modal States
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);
  const [previewIdModal, setPreviewIdModal] = useState<{
    url: string;
    title: string;
    workerName: string;
  } | null>(null);

  // Reject Worker Modal State
  const [workerToReject, setWorkerToReject] = useState<WorkerRegistration | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Digital inspection form state
  const [inspectorName, setInspectorName] = useState('د. م/ احمد عمر & أ/ دنيا');
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
    setIsBookingsLoading(true);
    try {
      const res = await fetch('/api/booking');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setIsBookingsLoading(false);
    }
  };

  // Fetch workers from API
  const fetchWorkers = async () => {
    setIsWorkersLoading(true);
    try {
      const res = await fetch('/api/workers');
      const data = await res.json();
      if (data.success && Array.isArray(data.workers)) {
        setWorkers(data.workers);
      }
    } catch (err) {
      console.error('Failed to load workers', err);
    } finally {
      setIsWorkersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchWorkers();
    }
  }, [isAuthenticated]);

  // Admin Auth Verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (
      PUREX_CONFIG.adminPasscodes.includes(cleanPass) ||
      cleanPass === '01094200285' ||
      cleanPass === 'purex' ||
      cleanPass === 'ahmed' ||
      cleanPass === 'donia'
    ) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('كلمة المرور غير صحيحة. يرجى تجربة purex2026 أو ahmed أو donia');
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch('/api/booking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: newStatus, depositConfirmed: newStatus === 'confirmed' ? true : b.depositConfirmed } : b
          )
        );
        if (activeBooking && activeBooking.id === id) {
          setActiveBooking((prev) =>
            prev ? { ...prev, status: newStatus, depositConfirmed: newStatus === 'confirmed' ? true : prev.depositConfirmed } : null
          );
        }
      }
    } catch (err) {
      console.error('Failed to update booking status', err);
    }
  };

  // Update Worker Status
  const handleUpdateWorkerStatus = async (
    id: string,
    status: WorkerStatus,
    rejectionReason?: string
  ) => {
    try {
      const res = await fetch('/api/workers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status,
          reviewedBy: 'د. م/ احمد عمر & أ/ دنيا',
          rejectionReason: rejectionReason || '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkers((prev) =>
          prev.map((w) =>
            w.id === id
              ? {
                  ...w,
                  status,
                  reviewedBy: 'د. م/ احمد عمر & أ/ دنيا',
                  reviewedAt: new Date().toISOString(),
                  rejectionReason: rejectionReason || w.rejectionReason,
                }
              : w
          )
        );
        setWorkerToReject(null);
        setRejectionReasonInput('');
      }
    } catch (err) {
      console.error('Failed to update worker status', err);
    }
  };

  // Canvas drawing for inspection signatures
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

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

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = selectedBookingFilter === 'all' || b.status === selectedBookingFilter;
    const matchesSearch =
      bookingSearchQuery === '' ||
      b.clientName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.clientPhone.includes(bookingSearchQuery) ||
      b.referenceNumber.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.clientLocation.toLowerCase().includes(bookingSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Workers
  const filteredWorkers = workers.filter((w) => {
    const matchesFilter = selectedWorkerFilter === 'all' || w.status === selectedWorkerFilter;
    const matchesSearch =
      workerSearchQuery === '' ||
      w.fullName.toLowerCase().includes(workerSearchQuery.toLowerCase()) ||
      w.phone.includes(workerSearchQuery) ||
      w.referenceNumber.toLowerCase().includes(workerSearchQuery.toLowerCase()) ||
      w.address.toLowerCase().includes(workerSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Booking KPIs
  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending_deposit').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    inProgress: bookings.filter((b) => b.status === 'in_progress').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    totalDeposits: bookings.reduce((sum, b) => (b.depositConfirmed ? sum + b.depositAmount : sum), 0),
  };

  // Worker KPIs
  const workerStats = {
    total: workers.length,
    underReview: workers.filter((w) => w.status === 'under_review').length,
    approved: workers.filter((w) => w.status === 'approved').length,
    rejected: workers.filter((w) => w.status === 'rejected').length,
  };

  // Status badges config for bookings
  const bookingStatusConfig: Record<
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

  // Status badges config for workers
  const workerStatusConfig: Record<
    WorkerStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    under_review: {
      label: 'قيد المراجعة والتدقيق ⏳',
      bg: 'bg-amber-500/15',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
    },
    approved: {
      label: 'تم القبول والاعتماد ✓',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
    },
    rejected: {
      label: 'مرفوض ✕',
      bg: 'bg-red-500/15',
      text: 'text-red-400',
      border: 'border-red-500/40',
    },
  };

  // ------------------- Auth Gate -------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-950 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">
              لوحة العمليات الفندقية <span className="text-cyan-400">PureX</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              إدارة العمليات المشتركة: د. م/ احمد عمر & أ/ دنيا | CyberX Ecosystem
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="أدخل كلمة مرور الإدارة (Passcode)..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors tracking-widest text-lg font-mono"
                autoFocus
              />
              <span className="text-[11px] text-zinc-500 block mt-2">
                كلمة المرور الافتراضية: <code className="text-cyan-400">purex2026</code> أو <code className="text-cyan-400">ahmed</code> أو <code className="text-cyan-400">donia</code>
              </span>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>تسجيل الدخول للوحة التحكم</span>
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              ← العودة للموقع الرئيسي
            </Link>
            <span>CyberX SecOps v2.4</span>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- Authenticated Operations Dashboard -------------------
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black" dir="rtl">
      {/* Top Bar with Management & Contacts Info */}
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white flex items-center gap-2">
                  <span>لوحة إدارة العمليات - لدنيا وأحمد</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                    PureX & CyberX
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-zinc-400">
                إشراف <strong>د. م/ احمد عمر</strong> (تطوير وتأمين CyberX) & <strong>أ/ دنيا</strong> (إدارة التشغيل والمتابعة)
              </p>
            </div>
          </div>

          {/* Quick Actions & Contact */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Ahmad Quick Pill */}
            <a
              href={`https://wa.me/${PUREX_CONFIG.whatsappIntl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50 text-xs font-semibold transition-colors"
              title="واتساب م/ أحمد"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>م/ أحمد: {PUREX_CONFIG.whatsappNumber}</span>
            </a>

            {/* Refresh Button */}
            <button
              onClick={() => {
                fetchBookings();
                fetchWorkers();
              }}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBookingsLoading || isWorkersLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Bookings vs Workers) - Requirement 4 */}
        <div className="border-t border-zinc-900 bg-zinc-950/60 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-3 px-5 border-b-2 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>مراجعة الحجوزات وإثباتات التحويل ومواعيد الزيارات</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('workers')}
              className={`py-3 px-5 border-b-2 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'workers'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>طلبات تسجيل العاملات ومعاينة صور الهوية</span>
              {workerStats.underReview > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold animate-pulse">
                  {workerStats.underReview} جديد
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ======================= TAB 1: BOOKINGS & TRANSFERS ======================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">إجمالي الحجوزات</span>
                <div className="text-2xl font-black text-white mt-1">{bookingStats.total}</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 bg-amber-500/5">
                <span className="text-[11px] text-amber-400 font-semibold">بانتظار العربون</span>
                <div className="text-2xl font-black text-amber-300 mt-1">{bookingStats.pending}</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-cyan-500/30 bg-cyan-500/5">
                <span className="text-[11px] text-cyan-400 font-semibold">مؤكدة ومجدولة</span>
                <div className="text-2xl font-black text-cyan-300 mt-1">{bookingStats.confirmed}</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-blue-500/30 bg-blue-500/5">
                <span className="text-[11px] text-blue-400 font-semibold">جاري تنفيذها</span>
                <div className="text-2xl font-black text-blue-300 mt-1">{bookingStats.inProgress}</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 bg-emerald-500/5">
                <span className="text-[11px] text-emerald-400 font-semibold">مكتملة ومسلّمة</span>
                <div className="text-2xl font-black text-emerald-300 mt-1">{bookingStats.completed}</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">العربونات المحصلة</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {bookingStats.totalDeposits.toLocaleString()} ج.م
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'pending_deposit', label: 'بانتظار العربون' },
                  { id: 'confirmed', label: 'المؤكدة والمجدولة' },
                  { id: 'in_progress', label: 'قيد التنفيذ' },
                  { id: 'completed', label: 'المكتملة' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedBookingFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedBookingFilter === f.id
                        ? 'bg-cyan-400 text-black shadow-md shadow-cyan-500/20'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearchQuery}
                  onChange={(e) => setBookingSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، الهاتف، الكود، الموقع..."
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Bookings List Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>جدول مواعيد الزيارات وإثباتات التحويل</span>
                  <span className="text-xs text-zinc-400">({filteredBookings.length} حجز)</span>
                </h2>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 bg-zinc-950 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-400 text-sm">لا توجد حجوزات تطابق الفلتر المختار حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredBookings.map((order) => {
                    const conf = bookingStatusConfig[order.status] || bookingStatusConfig.pending_deposit;
                    const hasReceipt = Boolean(order.receiptUrl);

                    return (
                      <div
                        key={order.id}
                        className="p-5 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-800/90 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl shadow-black/50"
                      >
                        {/* Card Top: Code, Date, Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-850 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-750 text-cyan-400 font-mono font-bold text-sm">
                              {order.referenceNumber}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-xl text-xs font-bold border ${conf.bg} ${conf.text} ${conf.border}`}
                            >
                              {conf.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-zinc-400">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                              <span>موعد الزيارة: <strong className="text-white">{order.serviceDate}</strong></span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{order.timeSlot === 'morning' ? 'فترة صباحية (9ص)' : 'فترة مسائية (2م)'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Center: Client Info & Financials */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Client & Location */}
                          <div className="space-y-1.5 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850">
                            <div className="text-zinc-400 font-medium">بيانات العميل والموقع:</div>
                            <div className="text-sm font-bold text-white">{order.clientName}</div>
                            <div className="text-zinc-300 font-mono">{order.clientPhone}</div>
                            <div className="text-zinc-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate">{order.clientLocation} {order.compoundOrBuilding && `(${order.compoundOrBuilding})`}</span>
                            </div>
                          </div>

                          {/* Property Details */}
                          <div className="space-y-1.5 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-855">
                            <div className="text-zinc-400 font-medium">مواصفات العقار والخدمة:</div>
                            <div className="text-white font-semibold">
                              {order.propertyType === 'villa'
                                ? 'فيلا مستقلة'
                                : order.propertyType === 'post_construction'
                                ? 'ما بعد التشطيب'
                                : order.propertyType === 'commercial'
                                ? 'مقر إداري'
                                : 'شقة سكنية'} • {order.areaSquareMeters} م²
                            </div>
                            <div className="text-zinc-400">
                              {order.roomsCount} غرف نوم • {order.bathroomsCount} دورات مياه
                            </div>
                            {order.addOns.length > 0 && (
                              <div className="text-cyan-400 text-[11px] truncate">
                                إضافات: {order.addOns.join(' • ')}
                              </div>
                            )}
                          </div>

                          {/* Payment & Transfer Proof */}
                          <div className="space-y-1.5 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850">
                            <div className="text-zinc-400 font-medium">العربون وسداد الفاتورة:</div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">إجمالي الفاتورة:</span>
                              <span className="text-white font-bold">{order.estimatedPrice} ج.م</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">العربون المقرر:</span>
                              <span className="text-emerald-400 font-bold font-mono">
                                {order.depositAmount} ج.م {order.depositConfirmed ? '✓ مؤكد' : '⏳ قيد المراجعة'}
                              </span>
                            </div>
                            <div className="text-zinc-400 flex items-center gap-1 pt-0.5">
                              <CreditCard className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate">
                                وسيلة الدفع: {order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : order.paymentMethod === 'axis_pay' ? 'Axis Pay' : order.paymentMethod === 'binance_usdt' ? 'Binance USDT' : 'إنستا باي'}
                              </span>
                            </div>

                            {/* Transfer Proof Button (Requirement 3 & 4) */}
                            <div className="pt-1 flex items-center gap-2">
                              {hasReceipt ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewReceiptUrl(order.receiptUrl || null)}
                                  className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>معاينة إثبات التحويل المرفق ✓</span>
                                </button>
                              ) : (
                                <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                                  <Info className="w-3.5 h-3.5" />
                                  <span>لم يتم إرفاق صورة إشعار (المرجع: {order.depositReference || 'لا يوجد'})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Notes if any */}
                        {order.notes && (
                          <div className="p-3 rounded-xl bg-zinc-900 text-xs text-zinc-300">
                            <span className="font-bold text-zinc-400">ملاحظات العميل: </span>
                            {order.notes}
                          </div>
                        )}

                        {/* Actions Row */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900">
                          {/* Direct WhatsApp & Contact Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`https://wa.me/2${order.clientPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                                `مرحباً ${order.clientName}، معك إدارة تشغيل PureX بخصوص حجزكم رقم ${order.referenceNumber} لتاريخ ${order.serviceDate}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>واتساب العميل</span>
                            </a>

                            <a
                              href={`tel:${order.clientPhone}`}
                              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-cyan-400" />
                              <span>اتصال هاتفي</span>
                            </a>

                            {/* Forward to Ahmad on WhatsApp */}
                            <a
                              href={`https://wa.me/${PUREX_CONFIG.whatsappIntl}?text=${encodeURIComponent(
                                `تحديث بخصوص الحجز ${order.referenceNumber} للعميل ${order.clientName} (${order.clientPhone}) بتاريخ ${order.serviceDate}. العربون: ${order.depositAmount} ج.م عبر ${order.paymentMethod}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                              title="إرسال ملخص الحجز لم/ أحمد"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                              <span>إرسال لم/ أحمد ({PUREX_CONFIG.whatsappNumber})</span>
                            </a>
                          </div>

                          {/* Order Status Transition Controls */}
                          <div className="flex flex-wrap items-center gap-2">
                            {order.status === 'pending_deposit' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(order.id, 'confirmed')}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>تأكيد العربون وجدولة الموعد</span>
                              </button>
                            )}

                            {order.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(order.id, 'in_progress')}
                                className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>بدء التنفيذ الفندقي بالموقع</span>
                              </button>
                            )}

                            {order.status === 'in_progress' && (
                              <button
                                onClick={() => {
                                  setActiveBooking(order);
                                  setIsInspectionOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <PenTool className="w-3.5 h-3.5" />
                                <span>محضر المعاينة والاستلام والتوقيع</span>
                              </button>
                            )}

                            {order.status === 'completed' && order.inspection && (
                              <button
                                onClick={() => {
                                  setActiveBooking(order);
                                  setIsInspectionOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <FileCheck className="w-3.5 h-3.5" />
                                <span>عرض محضر الاستلام الموقع</span>
                              </button>
                            )}

                            {order.status !== 'cancelled' && order.status !== 'completed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(order.id, 'cancelled')}
                                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
                              >
                                إلغاء
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: WORKER REGISTRATIONS & ID VERIFICATION ======================= */}
        {activeTab === 'workers' && (
          <div className="space-y-6">
            {/* Worker KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">إجمالي طلبات العاملات</span>
                <div className="text-2xl font-black text-white mt-1">{workerStats.total}</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 bg-amber-500/10">
                <span className="text-[11px] text-amber-400 font-semibold">قيد المراجعة والتدقيق</span>
                <div className="text-2xl font-black text-amber-300 mt-1">{workerStats.underReview}</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 bg-emerald-500/10">
                <span className="text-[11px] text-emerald-400 font-semibold">تم القبول والاعتماد</span>
                <div className="text-2xl font-black text-emerald-300 mt-1">{workerStats.approved}</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-red-500/30 bg-red-500/10">
                <span className="text-[11px] text-red-400 font-semibold">طلبات مرفوضة</span>
                <div className="text-2xl font-black text-red-400 mt-1">{workerStats.rejected}</div>
              </div>
            </div>

            {/* Filter and Search Bar for Workers */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {[
                  { id: 'all', label: 'كافة الطلبات' },
                  { id: 'under_review', label: 'قيد المراجعة ⏳' },
                  { id: 'approved', label: 'المقبولة والمعتمدة ✓' },
                  { id: 'rejected', label: 'المرفوضة ✕' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedWorkerFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedWorkerFilter === f.id
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={workerSearchQuery}
                  onChange={(e) => setWorkerSearchQuery(e.target.value)}
                  placeholder="ابحث باسم العاملة، الهاتف، العنوان..."
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Workers Cards List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>طلبات تسجيل العاملات والتحقق من الهوية الوطنية</span>
                  <span className="text-xs text-zinc-400">({filteredWorkers.length} عاملة)</span>
                </h2>
              </div>

              {filteredWorkers.length === 0 ? (
                <div className="text-center py-16 bg-zinc-950 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-400 text-sm">لا توجد طلبات تطابق الفلتر المختار حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {filteredWorkers.map((worker) => {
                    const conf = workerStatusConfig[worker.status] || workerStatusConfig.under_review;

                    return (
                      <div
                        key={worker.id}
                        className="p-5 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-500/40 transition-all space-y-5 shadow-xl shadow-black/50"
                      >
                        {/* Header: Code & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-850 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-750 text-amber-300 font-mono font-bold text-sm">
                              {worker.referenceNumber}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-xl text-xs font-bold border ${conf.bg} ${conf.text} ${conf.border}`}
                            >
                              {conf.label}
                            </span>
                          </div>

                          <div className="text-xs text-zinc-400 flex items-center gap-2">
                            <span>تاريخ التسجيل:</span>
                            <span className="text-white font-medium">
                              {new Date(worker.createdAt).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Worker Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Personal Details */}
                          <div className="space-y-1.5 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850">
                            <span className="text-zinc-400 font-medium">البيانات الشخصية:</span>
                            <div className="text-sm font-bold text-white">{worker.fullName}</div>
                            <div className="text-zinc-300">
                              السن: <strong className="text-white">{worker.age} سنة</strong>
                            </div>
                            <div className="text-zinc-300 font-mono flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{worker.phone}</span>
                            </div>
                          </div>

                          {/* Address & Experience */}
                          <div className="space-y-1.5 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850">
                            <span className="text-zinc-400 font-medium">العنوان والخبرة:</span>
                            <div className="text-zinc-300 flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{worker.address}</span>
                            </div>
                            <div className="text-zinc-300 pt-1">
                              الخبرة: <strong className="text-white">{worker.experienceYears ?? 0} سنوات</strong>
                            </div>
                            <div className="text-cyan-300 truncate">
                              التخصص: {worker.specialty || 'نظافة فندقية'}
                            </div>
                          </div>

                          {/* Review status / Rejection reason */}
                          <div className="space-y-1.5 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850">
                            <span className="text-zinc-400 font-medium">سجل المراجعة والتدقيق:</span>
                            {worker.reviewedBy ? (
                              <div className="text-zinc-300">
                                راجع الطلب: <strong className="text-white">{worker.reviewedBy}</strong>
                              </div>
                            ) : (
                              <div className="text-amber-400">بانتظار قرار دنيا وأحمد</div>
                            )}

                            {worker.status === 'rejected' && worker.rejectionReason && (
                              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] mt-1">
                                سبب الرفض: {worker.rejectionReason}
                              </div>
                            )}

                            {worker.notes && (
                              <div className="text-zinc-400 text-[11px] mt-1">
                                ملاحظات: {worker.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* National ID Preview Cards (Requirement 4) */}
                        <div className="space-y-2 pt-1">
                          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-cyan-400" />
                            <span>معاينة صور بطاقة الرقم القومي (وجه وظهر):</span>
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Front Card */}
                            <div className="p-3 rounded-2xl bg-black border border-zinc-800 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400">وجه بطاقة الرقم القومي</span>
                                {worker.nationalIdFront ? (
                                  <span className="text-emerald-400 text-[11px]">مرفقة ✓</span>
                                ) : (
                                  <span className="text-zinc-600 text-[11px]">غير مرفقة</span>
                                )}
                              </div>

                              {worker.nationalIdFront ? (
                                <div
                                  onClick={() =>
                                    setPreviewIdModal({
                                      url: worker.nationalIdFront,
                                      title: 'بطاقة الرقم القومي (الوجه الأمامي)',
                                      workerName: worker.fullName,
                                    })
                                  }
                                  className="h-36 rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center cursor-pointer group relative border border-zinc-800"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={worker.nationalIdFront}
                                    alt="وجه البطاقة"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-bold">
                                    <Eye className="w-4 h-4 text-cyan-400" />
                                    <span>اضغط للتكبير والفحص</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-28 rounded-xl bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">
                                  لم يتم رفع صورة الوجه
                                </div>
                              )}
                            </div>

                            {/* Back Card */}
                            <div className="p-3 rounded-2xl bg-black border border-zinc-800 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400">ظهر بطاقة الرقم القومي</span>
                                {worker.nationalIdBack ? (
                                  <span className="text-emerald-400 text-[11px]">مرفقة ✓</span>
                                ) : (
                                  <span className="text-zinc-600 text-[11px]">غير مرفقة</span>
                                )}
                              </div>

                              {worker.nationalIdBack ? (
                                <div
                                  onClick={() =>
                                    setPreviewIdModal({
                                      url: worker.nationalIdBack,
                                      title: 'بطاقة الرقم القومي (الظهر)',
                                      workerName: worker.fullName,
                                    })
                                  }
                                  className="h-36 rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center cursor-pointer group relative border border-zinc-800"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={worker.nationalIdBack}
                                    alt="ظهر البطاقة"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-bold">
                                    <Eye className="w-4 h-4 text-cyan-400" />
                                    <span>اضغط للتكبير والفحص</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-28 rounded-xl bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">
                                  لم يتم رفع صورة الظهر
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Decision & Contact (Requirement 4) */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900">
                          {/* Direct WhatsApp & Contact Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`https://wa.me/2${worker.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                                `مرحباً أ/ ${worker.fullName}، معك إدارة PureX بخصوص طلب انضمامك للعمل رقم ${worker.referenceNumber}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>مراسلة العاملة واتساب</span>
                            </a>

                            <a
                              href={`tel:${worker.phone}`}
                              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-cyan-400" />
                              <span>اتصال هاتفي</span>
                            </a>

                            {/* Forward to Ahmad on WhatsApp */}
                            <a
                              href={`https://wa.me/${PUREX_CONFIG.whatsappIntl}?text=${encodeURIComponent(
                                `طلب العاملة ${worker.fullName} (${worker.phone})، السن: ${worker.age}، العنوان: ${worker.address}. كود: ${worker.referenceNumber}. الحالة الحالية: ${worker.status}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                              title="إرسال بيانات العاملة لم/ أحمد"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                              <span>إرسال لم/ أحمد ({PUREX_CONFIG.whatsappNumber})</span>
                            </a>
                          </div>

                          {/* Decision Buttons: Approve or Reject (Requirement 4) */}
                          <div className="flex flex-wrap items-center gap-2">
                            {worker.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateWorkerStatus(worker.id, 'approved')}
                                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>قبول واعتماد العاملة ✓</span>
                              </button>
                            )}

                            {worker.status !== 'rejected' && (
                              <button
                                onClick={() => setWorkerToReject(worker)}
                                className="px-3.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>رفض الطلب ✕</span>
                              </button>
                            )}

                            {worker.status !== 'under_review' && (
                              <button
                                onClick={() => handleUpdateWorkerStatus(worker.id, 'under_review')}
                                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                              >
                                إعادة لقيد المراجعة ⏳
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ======================= MODAL: RECEIPT PROOF FULL PREVIEW ======================= */}
      {previewReceiptUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewReceiptUrl(null)}
        >
          <div
            className="relative max-w-xl w-full bg-zinc-950 rounded-3xl border border-emerald-500/40 p-6 space-y-4 shadow-2xl shadow-emerald-500/10"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">معاينة إثبات التحويل الرسمي</h3>
              </div>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto flex items-center justify-center bg-black rounded-2xl p-3 border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewReceiptUrl}
                alt="إثبات التحويل"
                className="max-h-[60vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
              <span>تم الفحص والتحقق الأمني عبر شبكة CyberX</span>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: WORKER NATIONAL ID ZOOM ======================= */}
      {previewIdModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewIdModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-zinc-950 rounded-3xl border border-cyan-500/40 p-6 space-y-4 shadow-2xl shadow-cyan-500/10"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>{previewIdModal.title}</span>
                </h3>
                <span className="text-xs text-zinc-400">العاملة: {previewIdModal.workerName}</span>
              </div>
              <button
                onClick={() => setPreviewIdModal(null)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[68vh] overflow-auto flex items-center justify-center bg-black rounded-2xl p-3 border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewIdModal.url}
                alt={previewIdModal.title}
                className="max-h-[60vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
              <span>معايير التحقق من بطاقة الرقم القومي المصري - PureX Ops</span>
              <button
                onClick={() => setPreviewIdModal(null)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer"
              >
                تم التدقيق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: REJECT WORKER REASON ======================= */}
      {workerToReject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setWorkerToReject(null)}
        >
          <div
            className="relative max-w-md w-full bg-zinc-950 rounded-3xl border border-red-500/40 p-6 space-y-4 shadow-2xl shadow-red-500/10"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
                <UserX className="w-5 h-5 text-red-400" />
                <span>رفض طلب العاملة: {workerToReject.fullName}</span>
              </h3>
              <button
                onClick={() => setWorkerToReject(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                سبب الرفض (اختياري، لحفظه في السجل):
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="مثال: صورة البطاقة غير واضحة، السن غير مطابق، خارج نطاق التغطية..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWorkerToReject(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-xs text-zinc-300 hover:text-white cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => handleUpdateWorkerStatus(workerToReject.id, 'rejected', rejectionReasonInput)}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs cursor-pointer"
              >
                تأكيد رفض الطلب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: DIGITAL INSPECTION & SIGNATURE ======================= */}
      {isInspectionOpen && activeBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsInspectionOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-zinc-950 rounded-3xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-500/10 my-8"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-cyan-400" />
                  <span>محضر المعاينة والاستلام الفندقي الرقمي</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  كود الحجز: <strong className="text-cyan-400 font-mono">{activeBooking.referenceNumber}</strong> • العميل: {activeBooking.clientName}
                </p>
              </div>
              <button
                onClick={() => setIsInspectionOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>قائمة الفحص والمطابقة الفندقية (Hotel Checklist)</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto p-1">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-zinc-200">{item.titleAr}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setChecklist((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, status: i.status === 'passed' ? 'issue_flagged' : 'passed' }
                              : i
                          )
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        item.status === 'passed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {item.status === 'passed' ? 'مطابق ✓' : 'ملاحظة ⚠'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-damage Notes */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                توثيق التلفيات أو الخدوش السابقة قبل البدء (لإخلاء مسؤولية الطاقم):
              </label>
              <textarea
                rows={2}
                value={preDamageNotes}
                onChange={(e) => setPreDamageNotes(e.target.value)}
                placeholder="مثال: خدش قديم بمدخل الصالون، كسر بسيط بجانب الرخام..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Rating & Feedback */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  تقييم العميل للخدمة (1 - 5 نجوم):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setClientRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= clientRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-zinc-400 font-mono font-bold mr-2">
                    {clientRating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  المشرف المسؤول عن الاستلام:
                </label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Signature Canvas */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                  <span>توقيع العميل أو المشرف إلكترونياً (باللمس أو الماوس):</span>
                </label>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[11px] text-zinc-500 hover:text-red-400 transition-colors"
                >
                  مسح التوقيع
                </button>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={580}
                  height={130}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-32 cursor-crosshair touch-none"
                />
                {!hasSignature && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-zinc-600">
                    وقع هنا باللمس أو الماوس
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-850">
              <button
                type="button"
                onClick={() => setIsInspectionOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveInspection}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ واعتماد محضر الاستلام والتسليم النهائي</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
