export type PropertyType = 'apartment' | 'villa' | 'post_construction' | 'commercial';

export type TimeSlot = 'morning' | 'evening' | 'flexible';

export type PaymentMethod = 'vodafone_cash' | 'instapay' | 'binance_usdt';

export type BookingStatus = 'pending_deposit' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface AddOnItem {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  description: string;
  iconName: string;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientWhatsApp?: string;
  clientLocation: string;
  compoundOrBuilding?: string;
  propertyType: PropertyType;
  areaSquareMeters: number;
  roomsCount: number;
  bathroomsCount: number;
  serviceDate: string;
  timeSlot: TimeSlot;
  addOns: string[];
  estimatedPrice: number;
  depositAmount: number;
  paymentMethod: PaymentMethod;
  depositConfirmed: boolean;
  depositReference?: string;
  receiptUrl?: string;
  status: BookingStatus;
  notes?: string;
  inspection?: DigitalInspection;
}

export interface ChecklistItem {
  id: string;
  titleAr: string;
  category: 'safety' | 'pre_service' | 'post_service';
  status: 'pending' | 'passed' | 'issue_flagged';
  notes?: string;
}

export interface DigitalInspection {
  inspectedBy: string;
  inspectedAt: string;
  checklist: ChecklistItem[];
  preExistingDamageNotes?: string;
  clientSignature?: string; // base64 canvas image data
  inspectorSignature?: string;
  clientRating?: number;
  clientFeedback?: string;
  approvedByClient: boolean;
}
