import { Booking, DigitalInspection, PropertyType } from '@/types/booking';

// Initial dummy orders to showcase the operations dashboard right away
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
    paymentMethod: 'instapay',
    depositConfirmed: true,
    depositReference: 'INSTA-89214710',
    receiptUrl: '',
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
    status: 'pending_deposit',
    notes: 'تحويل العربون قيد المراجعة عبر محفظة فودافون كاش.'
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
    depositReference: '0x3f8a...9c12 (USDT TRC20)',
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
    paymentMethod: 'instapay',
    depositConfirmed: true,
    depositReference: 'INSTA-11029471',
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

// Global in-memory storage to survive hot reloads in dev
const globalForBookings = globalThis as unknown as {
  purexBookingsStore: Booking[] | undefined;
};

export const bookingsStore = globalForBookings.purexBookingsStore ?? initialBookings;
if (process.env.NODE_ENV !== 'production') {
  globalForBookings.purexBookingsStore = bookingsStore;
}

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
