import { NextRequest, NextResponse } from 'next/server';
import { addWorker, getAllWorkers, updateWorkerStatus } from '@/lib/store';
import { WorkerStatus } from '@/types/booking';
import { notifyAhmadViaWebhook, generateWorkerWhatsAppMessage, getDirectWhatsAppUrl } from '@/lib/whatsapp';
import { PUREX_CONFIG } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as WorkerStatus | null;

    let workers = getAllWorkers();
    if (status) {
      workers = workers.filter((w) => w.status === status);
    }

    return NextResponse.json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to fetch workers', error: errMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      whatsapp,
      address,
      age,
      nationalIdFront,
      nationalIdBack,
      experienceYears,
      specialty,
      notes,
    } = body;

    // Validate required fields
    if (!fullName || !phone || !address || !age) {
      return NextResponse.json(
        {
          success: false,
          message: 'الحقول الأساسية غير مكتملة: الاسم الثلاثي، رقم الهاتف، العنوان والسن مطلوبة.',
        },
        { status: 400 }
      );
    }

    // Default status: under_review (قيد المراجعة)
    const newWorker = addWorker({
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      address: address.trim(),
      age: Number(age) || 25,
      nationalIdFront: nationalIdFront || '',
      nationalIdBack: nationalIdBack || '',
      experienceYears: experienceYears ? Number(experienceYears) : undefined,
      specialty: specialty || 'نظافة وضيافة فندقية',
      notes: notes || '',
    });

    // Notify Ahmad (01094200285) via WhatsApp webhook & prepare link
    const notificationResult = await notifyAhmadViaWebhook('worker', newWorker);
    const whatsappMessage = generateWorkerWhatsAppMessage(newWorker);
    const directWhatsAppUrl = getDirectWhatsAppUrl(PUREX_CONFIG.whatsappNumber, whatsappMessage);

    return NextResponse.json(
      {
        success: true,
        worker: newWorker,
        workerId: newWorker.id,
        referenceNumber: newWorker.referenceNumber,
        directWhatsAppUrl,
        notification: notificationResult,
        message: 'تم استلام طلب التسجيل بنجاح، والطلب الآن قيد المراجعة والتحقق الأمني.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تسجيل العاملة', error: errMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, reviewedBy, rejectionReason, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'معرف الطلب وحالة الاعتماد مطلوبة' },
        { status: 400 }
      );
    }

    const updated = updateWorkerStatus(id, status as WorkerStatus, {
      reviewedBy: reviewedBy || 'إدارة PureX (دنيا وأحمد)',
      rejectionReason,
      notes,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'طلب العاملة غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      worker: updated,
      message: `تم تحديث حالة طلب العاملة إلى: ${status}`,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'خطأ في تحديث حالة العاملة', error: errMessage },
      { status: 500 }
    );
  }
}
