import { NextRequest, NextResponse } from 'next/server';
import { addBooking, getAllBookings, updateBookingStatus, updateInspection } from '@/lib/store';
import { Booking, PaymentMethod, PropertyType, TimeSlot } from '@/types/booking';
import { notifyAhmadViaWebhook, generateBookingWhatsAppMessage, getDirectWhatsAppUrl } from '@/lib/whatsapp';
import { PUREX_CONFIG } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let bookings = getAllBookings();
    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings', error: errMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      clientWhatsApp,
      location,
      compoundOrBuilding,
      propertyType,
      areaSquareMeters,
      roomsCount = 3,
      bathroomsCount = 2,
      date,
      timeSlot = 'morning',
      addOns = [],
      estimatedPrice,
      depositAmount = 500,
      paymentMethod = 'vodafone_cash',
      depositConfirmed = false,
      depositReference,
      receiptUrl,
      notes,
    } = body;

    // Validate required fields
    if (!name || !phone || !propertyType || !date) {
      return NextResponse.json(
        {
          success: false,
          message: 'الحقول المطلوبة غير مكتملة: الاسم، الهاتف، نوع العقار وتاريخ الخدمة إلزامية.',
        },
        { status: 400 }
      );
    }

    // Create booking in store
    const newBooking = addBooking({
      clientName: name.trim(),
      clientPhone: phone.trim(),
      clientWhatsApp: (clientWhatsApp || phone).trim(),
      clientLocation: location || 'القاهرة الكبرى',
      compoundOrBuilding: compoundOrBuilding || '',
      propertyType: propertyType as PropertyType,
      areaSquareMeters: Number(areaSquareMeters) || 120,
      roomsCount: Number(roomsCount) || 3,
      bathroomsCount: Number(bathroomsCount) || 2,
      serviceDate: date,
      timeSlot: timeSlot as TimeSlot,
      addOns: Array.isArray(addOns) ? addOns : [],
      estimatedPrice: Number(estimatedPrice) || 2000,
      depositAmount: Number(depositAmount) || 500,
      paymentMethod: (paymentMethod as PaymentMethod) || 'vodafone_cash',
      depositConfirmed: Boolean(depositConfirmed),
      depositReference: depositReference || '',
      receiptUrl: receiptUrl || '',
      status: depositConfirmed ? 'confirmed' : 'pending_deposit',
      notes: notes || '',
    });

    // Send instant notification to Ahmad (01094200285)
    const notificationResult = await notifyAhmadViaWebhook('booking', newBooking);
    const whatsappMessage = generateBookingWhatsAppMessage(newBooking);
    const directWhatsAppUrl = getDirectWhatsAppUrl(PUREX_CONFIG.whatsappNumber, whatsappMessage);

    return NextResponse.json(
      {
        success: true,
        booking: newBooking,
        bookingId: newBooking.id,
        referenceNumber: newBooking.referenceNumber,
        directWhatsAppUrl,
        notification: notificationResult,
        message: 'تم تسجيل الحجز بنجاح وإرسال إشعار فوري إلى إدارة العمليات',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء معالجة الحجز',
        error: errMessage,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, inspection } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف الحجز مطلوب' }, { status: 400 });
    }

    let updated: Booking | null = null;
    if (status) {
      updated = updateBookingStatus(id, status);
    }
    if (inspection) {
      updated = updateInspection(id, inspection);
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: 'الحجز غير موجود' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking: updated,
      message: 'تم تحديث بيانات الحجز بنجاح',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'خطأ في تحديث الحجز', error: errMessage },
      { status: 500 }
    );
  }
}
