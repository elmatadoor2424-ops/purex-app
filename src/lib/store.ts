import { Booking, DigitalInspection, WorkerRegistration, WorkerStatus } from '@/types/booking';

// SVG placeholder images for sample national IDs and receipts
const sampleIdFrontSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%231e293b" stroke="%2338bdf8" stroke-width="3"/><rect x="24" y="24" width="70" height="90" rx="8" fill="%23475569"/><circle cx="59" cy="55" r="22" fill="%2394a3b8"/><path d="M35 105 Q59 80 83 105" fill="%2394a3b8"/><text x="110" y="50" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23f8fafc">جمهورية مصر العربية</text><text x="110" y="70" font-family="sans-serif" font-size="11" fill="%2394a3b8">بطاقة تحقيق الشخصية (الرقم القومي)</text><text x="110" y="105" font-family="sans-serif" font-size="12" fill="%2338bdf8">الوجه الأمامي - توثيق الهوية</text><rect x="24" y="140" width="352" height="12" rx="4" fill="%23334155"/><rect x="24" y="165" width="280" height="10" rx="4" fill="%23334155"/><text x="24" y="215" font-family="monospace" font-size="14" fill="%2322c55e">29803150102948</text></svg>`;

const sampleIdBackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%230f172a" stroke="%2306b6d4" stroke-width="3"/><text x="30" y="45" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23f8fafc">الظهر - الرقم القومي والمهنة</text><rect x="30" y="65" width="340" height="40" rx="6" fill="%231e293b"/><text x="45" y="90" font-family="sans-serif" font-size="11" fill="%2394a3b8">المهنة: عاملة نظافة وضيافة فندقية</text><rect x="30" y="130" width="340" height="50" rx="4" fill="%230284c7" opacity="0.15"/><text x="45" y="160" font-family="monospace" font-size="11" fill="%2338bdf8">&lt;&lt;&lt;&lt; EGY29803150102948&lt;&lt;&lt;&lt;&lt;94200285</text><text x="30" y="215" font-family="sans-serif" font-size="11" fill="%2322c55e">تم الفحص والتحقق الأمني عبر CyberX</text></svg>`;

const sampleReceiptSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="380" height="260" viewBox="0 0 380 260"><rect width="380" height="260" rx="16" fill="%2309090b" stroke="%2310b981" stroke-width="2"/><text x="25" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="%2310b981">إشعار تحويل فودافون كاش / Axis Pay</text><text x="25" y="70" font-family="sans-serif" font-size="11" fill="%2394a3b8">المبلغ المحول: 500.00 ج.م (عربون تأكيد)</text><text x="25" y="100" font-family="sans-serif" font-size="11" fill="%2394a3b8">رقم المحول إليه: 01554597494 / 01094200285</text><text x="25" y="130" font-family="sans-serif" font-size="11" fill="%2394a3b8">رقم العملية: VF-89472910</text><rect x="25" y="155" width="330" height="40" rx="8" fill="%23064e3b"/><text x="40" y="180" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2334d399">تمت العملية بنجاح - مؤكد من البنك</text><text x="25" y="230" font-family="sans-serif" font-size="10" fill="%2364748b">تاريخ التحويل: 2026-11-06 09:14 ص</text></svg>`;

// Initial bookings
const initialBookings: Booking[] = [
  {
    id: 'PX-1049',
    referenceNumber: 'PX-1049',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    clientName: 'م. أحمد الشريف',
    clientPhone: '01012345678',
    clientWhatsApp: '01012345678',
    clientLocation: 'التجمع الخامس - كمبوند ميفيدا',
    compoundOrBuilding: 'فيلا 42 - ميفيدا البستان',
    propertyType: 'villa',
    areaSquareMeters: 380,
    roomsCount: 5,
    bathroomsCount: 4,
    serviceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: 'morning',
    addOns: ['carpet_steam', 'sofa_deep_clean', 'crystal_polishing'],
    estimatedPrice: 4850,
    depositAmount: 1000,
    paymentMethod: 'axis_pay',
    depositConfirmed: true,
    depositReference: 'AXIS-89214710',
    receiptUrl: sampleReceiptSvg,
    status: 'confirmed',
    notes: 'يرجى التركيز على تعقيم غرف الأطفال وجلي رخام المدخل الرئيسي.',
    inspection: {
      inspectedBy: 'كابتن / هاني محمود (مشرف PureX)',
      inspectedAt: '',
      approvedByClient: false,
      checklist: [
        { id: 'c1', titleAr: 'فحص سلامة الأثاث والتحف الثمينة قبل البدء', category: 'pre_service', status: 'passed' },
        { id: 'c2', titleAr: 'حصر وفحص سلامة الشاشات والأجهزة الكهربائية', category: 'pre_service', status: 'passed' },
        { id: 'c3', titleAr: 'توثيق الخدوش أو التلفيات السابقة في الرخام/الباركيه', category: 'pre_service', status: 'passed', notes: 'خدش بسيط بجانب باب الصالون' },
        { id: 'c4', titleAr: 'تنظيف وتطهير وتعقيم الحمامات بالبخار 180°C', category: 'post_service', status: 'pending' },
        { id: 'c5', titleAr: 'جلي وتلميع رخام المدخل والكريستال', category: 'post_service', status: 'pending' },
        { id: 'c6', titleAr: 'غسيل وتعطير السجاد والكنب بالرغوة الجافة', category: 'post_service', status: 'pending' },
      ],
      preExistingDamageNotes: 'تم تصوير خدش قديم بمدخل الصالون قبل البدء',
    }
  },
  {
    id: 'PX-1050',
    referenceNumber: 'PX-1050',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    clientName: 'د. نورهان المهدي',
    clientPhone: '01198765432',
    clientWhatsApp: '01198765432',
    clientLocation: 'الشيخ زايد - كمبوند الياسمين',
    compoundOrBuilding: 'عمارة 14 - شقة 302',
    propertyType: 'apartment',
    areaSquareMeters: 180,
    roomsCount: 3,
    bathroomsCount: 2,
    serviceDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: 'evening',
    addOns: ['carpet_steam', 'ozone_sterilization'],
    estimatedPrice: 2400,
    depositAmount: 500,
    paymentMethod: 'vodafone_cash',
    depositConfirmed: false,
    depositReference: 'VF-7749102',
    receiptUrl: sampleReceiptSvg,
    status: 'pending_deposit',
    notes: 'تحويل العربون قيد المراجعة عبر محفظة فودافون كاش 01554597494.'
  },
  {
    id: 'PX-1048',
    referenceNumber: 'PX-1048',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    clientName: 'أ. طارق عبد الرحمن',
    clientPhone: '01234567890',
    clientWhatsApp: '01234567890',
    clientLocation: 'المعادي دجلة',
    compoundOrBuilding: 'برج النيل 9',
    propertyType: 'post_construction',
    areaSquareMeters: 260,
    roomsCount: 4,
    bathroomsCount: 3,
    serviceDate: new Date().toISOString().split('T')[0],
    timeSlot: 'morning',
    addOns: ['carpet_steam', 'sofa_deep_clean', 'crystal_polishing', 'kitchen_degreasing'],
    estimatedPrice: 6200,
    depositAmount: 1500,
    paymentMethod: 'binance_usdt',
    depositConfirmed: true,
    depositReference: '0x4c9e...5071a (USDT TRC20)',
    receiptUrl: sampleReceiptSvg,
    status: 'in_progress',
    notes: 'تنظيف عميق بعد تشطيب دهانات وأرضيات بورسلين.',
    inspection: {
      inspectedBy: 'م/ دنيا (مديرة العمليات)',
      inspectedAt: new Date().toISOString(),
      approvedByClient: false,
      checklist: [
        { id: 'c1', titleAr: 'إزالة آثار الدهان والأسمنت من الأرضيات بدون خدش', category: 'pre_service', status: 'passed' },
        { id: 'c2', titleAr: 'تلميع شبابيك الألوميتال وإزالة اللواصق بالبخار', category: 'post_service', status: 'passed' },
        { id: 'c3', titleAr: 'شفط الأتربة الدقيقة من الفواصل ومجاري التكييف', category: 'post_service', status: 'passed' },
        { id: 'c4', titleAr: 'تطهير وتعقيم دورات المياه بالكامل', category: 'post_service', status: 'passed' },
      ],
      preExistingDamageNotes: 'لا توجد تلفيات مسبقة، التشطيب حديث بالكامل.',
    }
  },
  {
    id: 'PX-1047',
    referenceNumber: 'PX-1047',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    clientName: 'شركة فيوتشر تك للمقاولات',
    clientPhone: '01099887766',
    clientWhatsApp: '01099887766',
    clientLocation: 'القرية الذكية - مبنى B12',
    compoundOrBuilding: 'الدور الثاني - المقر الإداري',
    propertyType: 'commercial',
    areaSquareMeters: 450,
    roomsCount: 8,
    bathroomsCount: 4,
    serviceDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timeSlot: 'morning',
    addOns: ['carpet_steam', 'ozone_sterilization', 'crystal_polishing'],
    estimatedPrice: 7500,
    depositAmount: 2000,
    paymentMethod: 'axis_pay',
    depositConfirmed: true,
    depositReference: 'AXIS-11029471',
    receiptUrl: sampleReceiptSvg,
    status: 'completed',
    notes: 'تم التسليم بالكامل وتوقيع محضر الاستلام.',
    inspection: {
      inspectedBy: 'كابتن / سامح بدر',
      inspectedAt: new Date(Date.now() - 86400000).toISOString(),
      approvedByClient: true,
      clientRating: 5,
      clientFeedback: 'خدمة فندقية ممتازة والتزام فائق بالمواعيد وجودة المواد المستخدمة.',
      checklist: [
        { id: 'c1', titleAr: 'فحص مكاتب وأجهزة السيرفرات بحذر', category: 'pre_service', status: 'passed' },
        { id: 'c2', titleAr: 'غسيل سجاد المكاتب بالرغوة الجافة سريعة الجفاف', category: 'post_service', status: 'passed' },
        { id: 'c3', titleAr: 'تعقيم نانو للمكاتب وقاعات الاجتماعات', category: 'post_service', status: 'passed' },
      ]
    }
  }
];

// Initial worker applications
const initialWorkers: WorkerRegistration[] = [
  {
    id: 'PX-WRK-101',
    referenceNumber: 'PX-WRK-101',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    fullName: 'مروة عبد السميع حسين',
    phone: '01091234567',
    whatsapp: '01091234567',
    address: 'الجيزة - فيصل - شارع العشرين، عمارة 12',
    age: 28,
    nationalIdFront: sampleIdFrontSvg,
    nationalIdBack: sampleIdBackSvg,
    experienceYears: 4,
    specialty: 'نظافة فندقية للشقق والفلل وغسيل المفروشات بالبخار',
    status: 'under_review',
    notes: 'لديها خبرة سابقة في فنادق 4 نجوم والالتزام الصارم بمعايير الأمان.',
  },
  {
    id: 'PX-WRK-102',
    referenceNumber: 'PX-WRK-102',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    fullName: 'فاطمة محمد إبراهيم الشامي',
    phone: '01154321987',
    whatsapp: '01154321987',
    address: 'القاهرة - حلوان - شارع عمر بن عبد العزيز',
    age: 33,
    nationalIdFront: sampleIdFrontSvg,
    nationalIdBack: sampleIdBackSvg,
    experienceYears: 6,
    specialty: 'تعقيم الحمامات والمطابخ وجلي الرخام',
    status: 'approved',
    reviewedBy: 'د. م/ احمد عمر',
    reviewedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    notes: 'تم التحقق من بطاقة الرقم القومي والمقابلة الشخصية بنجاح.',
  },
  {
    id: 'PX-WRK-103',
    referenceNumber: 'PX-WRK-103',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    fullName: 'صباح حسن عبد الرحمن',
    phone: '01287654321',
    whatsapp: '01287654321',
    address: 'القاهرة - المعادي - عزبة نافع',
    age: 41,
    nationalIdFront: sampleIdFrontSvg,
    nationalIdBack: sampleIdBackSvg,
    experienceYears: 2,
    specialty: 'نظافة ما بعد التشطيب',
    status: 'rejected',
    reviewedBy: 'أ/ دنيا (مديرة العمليات)',
    reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rejectionReason: 'صورة بطاقة الرقم القومي غير واضحة والسن خارج النطاق الفندقي المفضل.',
  }
];

// Global in-memory storage to survive hot reloads in dev
const globalForStore = globalThis as unknown as {
  purexBookingsStore: Booking[] | undefined;
  purexWorkersStore: WorkerRegistration[] | undefined;
};

export const bookingsStore = globalForStore.purexBookingsStore ?? initialBookings;
export const workersStore = globalForStore.purexWorkersStore ?? initialWorkers;

if (process.env.NODE_ENV !== 'production') {
  globalForStore.purexBookingsStore = bookingsStore;
  globalForStore.purexWorkersStore = workersStore;
}

// ------------------- Bookings Store Operations -------------------

export function getAllBookings(): Booking[] {
  return [...bookingsStore];
}

export function getBookingById(id: string): Booking | undefined {
  return bookingsStore.find((b) => b.id === id || b.referenceNumber === id);
}

export function addBooking(bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt'>): Booking {
  const count = bookingsStore.length + 1051;
  const newBooking: Booking = {
    ...bookingData,
    id: `PX-${count}`,
    referenceNumber: `PX-${count}`,
    createdAt: new Date().toISOString(),
  };

  bookingsStore.unshift(newBooking);
  return newBooking;
}

export function updateBookingStatus(id: string, status: Booking['status']): Booking | null {
  const booking = bookingsStore.find((b) => b.id === id || b.referenceNumber === id);
  if (!booking) return null;
  booking.status = status;
  if (status === 'confirmed') {
    booking.depositConfirmed = true;
  }
  return booking;
}

export function updateInspection(id: string, inspection: DigitalInspection): Booking | null {
  const booking = bookingsStore.find((b) => b.id === id || b.referenceNumber === id);
  if (!booking) return null;
  booking.inspection = inspection;
  return booking;
}

// ------------------- Workers Store Operations -------------------

export function getAllWorkers(): WorkerRegistration[] {
  return [...workersStore];
}

export function getWorkerById(id: string): WorkerRegistration | undefined {
  return workersStore.find((w) => w.id === id || w.referenceNumber === id);
}

export function addWorker(
  workerData: Omit<WorkerRegistration, 'id' | 'referenceNumber' | 'createdAt' | 'status'>
): WorkerRegistration {
  const count = workersStore.length + 104;
  const newWorker: WorkerRegistration = {
    ...workerData,
    id: `PX-WRK-${count}`,
    referenceNumber: `PX-WRK-${count}`,
    createdAt: new Date().toISOString(),
    status: 'under_review', // Default status: قيد المراجعة
  };

  workersStore.unshift(newWorker);
  return newWorker;
}

export function updateWorkerStatus(
  id: string,
  status: WorkerStatus,
  options?: {
    reviewedBy?: string;
    rejectionReason?: string;
    notes?: string;
  }
): WorkerRegistration | null {
  const worker = workersStore.find((w) => w.id === id || w.referenceNumber === id);
  if (!worker) return null;

  worker.status = status;
  worker.reviewedAt = new Date().toISOString();
  if (options?.reviewedBy) worker.reviewedBy = options.reviewedBy;
  if (options?.rejectionReason !== undefined) worker.rejectionReason = options.rejectionReason;
  if (options?.notes) worker.notes = options.notes;

  return worker;
}
