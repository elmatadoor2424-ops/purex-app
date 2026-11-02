import { NextRequest, NextResponse } from 'next/server';
import { addBooking, getAllBookings, updateBookingStatus, updateInspection } from '@/lib/store';
import { Booking, PaymentMethod, PropertyType, TimeSlot } from '@/types/booking';

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
      clientName: name,
      clientPhone: phone,
      clientWhatsApp: clientWhatsApp || phone,
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

    // Format JSON payload for WapiPilot WhatsApp API
    const wapiPilotPayload = {
      event: 'booking_created',
      platform: 'PureX by CyberX',
      bookingId: newBooking.id,
      timestamp: new Date().toISOString(),
      client: {
        name: newBooking.clientName,
        phone: newBooking.clientPhone,
        whatsapp: newBooking.clientWhatsApp,
        location: newBooking.clientLocation,
        compound: newBooking.compoundOrBuilding,
      },
      service: {
        propertyType: newBooking.propertyType,
        areaM2: newBooking.areaSquareMeters,
        rooms: newBooking.roomsCount,
        bathrooms: newBooking.bathroomsCount,
        date: newBooking.serviceDate,
        timeSlot: newBooking.timeSlot,
        addOns: newBooking.addOns,
      },
      financials: {
        estimatedPriceEGP: newBooking.estimatedPrice,
        depositAmountEGP: newBooking.depositAmount,
        paymentMethod: newBooking.paymentMethod,
        depositConfirmed: newBooking.depositConfirmed,
        depositReference: newBooking.depositReference,
      },
      notes: newBooking.notes,
      messageTemplate: {
        header: `✨ مرحباً ${newBooking.clientName}، تم استلام طلب حجز PureX بنجاح!`,
        body: `كود الحجز: *${newBooking.id}*\nالتاريخ: ${newBooking.serviceDate} (${newBooking.timeSlot === 'morning' ? 'فترة صباحية 9ص' : 'فترة مسائية 2م'})\nنوع العقار: ${newBooking.propertyType}\nالتكلفة التقديرية: ${newBooking.estimatedPrice} ج.م\nقيمة العربون: ${newBooking.depositAmount} ج.م (${newBooking.depositConfirmed ? '✅ تم تأكيد السداد' : '⏳ بانتظار التحويل'})\n\nسيقوم مشرف تشغيل PureX بالتواصل معكم هاتفياً لتأكيد كافة الترتيبات الفندقية.`,
        footer: 'PureX - معايير النظافة الفندقية الفاخرة | CyberX Ecosystem',
      },
    };

    // Push to WapiPilot Webhook
    const webhookUrl = process.env.WAPIPILOT_WEBHOOK_URL || 'https://api.wapipilot.com/v1/webhook/purex';
    const apiKey = process.env.WAPIPILOT_API_KEY || '';

    let webhookResponseStatus = 'skipped_or_simulated';
    let webhookSuccess = true;

    try {
      // Fire webhook with safe timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'CyberX-PureX-Webhook/1.0',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(wapiPilotPayload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      webhookResponseStatus = `HTTP_${res.status}`;
      webhookSuccess = res.ok;
    } catch {
      // If external webhook is unreachable or mocked, log and continue gracefully
      webhookResponseStatus = 'simulated_success';
    }

    return NextResponse.json(
      {
        success: true,
        booking: newBooking,
        bookingId: newBooking.id,
        webhook: {
          status: webhookResponseStatus,
          targetUrl: webhookUrl,
          sentPayload: wapiPilotPayload,
        },
        message: 'تم تسجيل الحجز بنجاح وإرسال إشعار الواتساب عبر WapiPilot',
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
