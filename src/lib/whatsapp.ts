import { PUREX_CONFIG } from './constants';
import { Booking, WorkerRegistration } from '@/types/booking';

/**
 * Generate formatted WhatsApp message for customer booking notification to Ahmad
 */
export function generateBookingWhatsAppMessage(booking: Booking): string {
  const paymentLabels: Record<string, string> = {
    vodafone_cash: 'فودافون كاش (Vodafone Cash)',
    axis_pay: 'اكسيس باي (Axis Pay)',
    instapay: 'إنستا باي (InstaPay)',
    binance_usdt: 'Binance USDT (TRC-20)',
  };

  const propertyLabels: Record<string, string> = {
    apartment: 'شقة سكنية',
    villa: 'فيلا مستقلة / تاون',
    post_construction: 'ما بعد التشطيب الفندقي',
    commercial: 'مقر إداري / شركات',
  };

  const slotLabels: Record<string, string> = {
    morning: 'فترة صباحية (09:00 ص - 01:00 م)',
    evening: 'فترة مسائية (02:00 م - 06:00 م)',
    flexible: 'فترة مرنة',
  };

  const receiptStatus = booking.receiptUrl
    ? '✅ تم إرفاق صورة إشعار التحويل'
    : '⏳ بانتظار إشعار التحويل';

  return `🔔 *إشعار حجز فندقي جديد - PureX* 🔔
-----------------------------------------
👤 *بيانات العميل:*
• الاسم: ${booking.clientName}
• الهاتف: ${booking.clientPhone}
• العنوان: ${booking.clientLocation} ${booking.compoundOrBuilding ? `(${booking.compoundOrBuilding})` : ''}

🗓️ *تفاصيل الموعد والخدمة:*
• كود الحجز: *${booking.referenceNumber}*
• تاريخ الزيارة: ${booking.serviceDate}
• الفترة: ${slotLabels[booking.timeSlot] || booking.timeSlot}
• نوع العقار: ${propertyLabels[booking.propertyType] || booking.propertyType}
• المساحة: ${booking.areaSquareMeters} م² (${booking.roomsCount} غرف - ${booking.bathroomsCount} حمامات)

💰 *الماليات وسداد العربون:*
• إجمالي التكلفة: ${booking.estimatedPrice} ج.م
• العربون المطلوب: ${booking.depositAmount} ج.م
• وسيلة الدفع: ${paymentLabels[booking.paymentMethod] || booking.paymentMethod}
• رقم المرجع: ${booking.depositReference || 'لم يُحدد بعد'}
• حالة إثبات التحويل: ${receiptStatus}
${booking.notes ? `\n📝 *ملاحظات خاصة:*\n${booking.notes}` : ''}

-----------------------------------------
🔒 *تأمين وإشراف شبكة CyberX - د. م/ احمد عمر*
رابط لوحة العمليات للمعاينة والاعتماد:
https://purex.cyberx.com/admin/operations`;
}

/**
 * Generate formatted WhatsApp message for worker registration to Ahmad
 */
export function generateWorkerWhatsAppMessage(worker: WorkerRegistration): string {
  const hasIdFront = worker.nationalIdFront ? '✅ مرفقة' : '❌ غير مرفقة';
  const hasIdBack = worker.nationalIdBack ? '✅ مرفقة' : '❌ غير مرفقة';

  return `👩‍💼 *طلب تسجيل عاملة جديدة - PureX* 👩‍💼
-----------------------------------------
• كود الطلب: *${worker.referenceNumber}*
• الاسم الثلاثي: ${worker.fullName}
• السن: ${worker.age} سنة
• رقم الهاتف: ${worker.phone}
• العنوان بالتفصيل: ${worker.address}
${worker.experienceYears ? `• سنوات الخبرة: ${worker.experienceYears} سنوات` : ''}
${worker.specialty ? `• التخصص/المجال: ${worker.specialty}` : ''}

🪪 *التحقق من الهوية الرقمية:*
• بطاقة الرقم القومي (وجه): ${hasIdFront}
• بطاقة الرقم القومي (ظهر): ${hasIdBack}
• حالة الطلب: ⏳ *قيد المراجعة والتدقيق*

-----------------------------------------
يرجى فتح لوحة عمليات PureX لمراجعة صورة بطاقة الرقم القومي واتخاذ قرار القبول أو الرفض:
https://purex.cyberx.com/admin/operations

🔒 *تطوير وتأمين CyberX - إشراف د. م/ احمد عمر*`;
}

/**
 * Returns direct wa.me link for WhatsApp chat
 */
export function getDirectWhatsAppUrl(
  phone: string = PUREX_CONFIG.whatsappNumber,
  message: string = ''
): string {
  // Normalize phone to international format without leading zeros or symbols
  let cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '2' + cleanPhone;
  }
  if (!cleanPhone.startsWith('20') && cleanPhone.length === 10) {
    cleanPhone = '20' + cleanPhone;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Push notification to Ahmad WhatsApp and Webhook
 */
export async function notifyAhmadViaWebhook(
  type: 'booking' | 'worker',
  data: Booking | WorkerRegistration
) {
  const webhookUrl = process.env.WAPIPILOT_WEBHOOK_URL;
  const apiKey = process.env.WAPIPILOT_API_KEY;

  const textMessage =
    type === 'booking'
      ? generateBookingWhatsAppMessage(data as Booking)
      : generateWorkerWhatsAppMessage(data as WorkerRegistration);

  const payload = {
    targetPhone: PUREX_CONFIG.whatsappIntl,
    recipient: 'د. م/ احمد عمر',
    type,
    timestamp: new Date().toISOString(),
    messageText: textMessage,
    data,
  };

  if (!webhookUrl) {
    console.log(`[WhatsApp Notification to Ahmad ${PUREX_CONFIG.whatsappNumber}]`, payload);
    return { success: true, simulated: true, payload, messageText: textMessage };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    return { success: res.ok, status: res.status, messageText: textMessage };
  } catch (err) {
    console.warn('Webhook delivery error:', err);
    return { success: false, error: err, messageText: textMessage };
  }
}
