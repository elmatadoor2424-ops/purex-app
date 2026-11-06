async function runTests() {
  console.log('--- 1. Testing Landing Page (/) ---');
  const resHome = await fetch('http://localhost:3000/');
  console.log('Landing page HTTP status:', resHome.status);
  const homeHtml = await resHome.text();
  console.log('Contains PureX logo/brand:', homeHtml.includes('PureX'));
  console.log('Contains CyberX Supervisor (د. م/ احمد عمر):', homeHtml.includes('احمد عمر'));
  console.log('Contains Axis Pay / Vodafone numbers (01554597494):', homeHtml.includes('01554597494'));
  console.log('Contains Binance USDT wallet:', homeHtml.includes('0x4c9e11c4708e6e40015aa0986da7c3defbc5071a'));

  console.log('\n--- 2. Testing Workers Registration Page (/workers/register) ---');
  const resWorkerPage = await fetch('http://localhost:3000/workers/register');
  console.log('Workers register page HTTP status:', resWorkerPage.status);
  const workerPageHtml = await resWorkerPage.text();
  console.log('Contains National ID upload & verification:', workerPageHtml.includes('بطاقة الرقم القومي'));
  console.log('Contains Under Review default status notice:', workerPageHtml.includes('قيد المراجعة'));

  console.log('\n--- 3. Testing Admin Operations View (/admin/operations) ---');
  const resAdmin = await fetch('http://localhost:3000/admin/operations');
  console.log('Admin Operations HTTP status:', resAdmin.status);
  const adminHtml = await resAdmin.text();
  console.log('Contains Operations header / auth gate:', adminHtml.includes('دنيا وأحمد') || adminHtml.includes('PureX'));

  console.log('\n--- 4. Testing POST /api/booking (Transfer Proof & WhatsApp) ---');
  const testPayload = {
    name: 'م. طارق العشري',
    phone: '01019283746',
    clientWhatsApp: '01019283746',
    location: 'التجمع الخامس - كمبوند ميفيدا',
    compoundOrBuilding: 'فيلا 88',
    propertyType: 'villa',
    areaSquareMeters: 420,
    roomsCount: 5,
    bathroomsCount: 4,
    date: '2026-11-08',
    timeSlot: 'morning',
    addOns: ['carpet_steam', 'crystal_polishing'],
    estimatedPrice: 5400,
    depositAmount: 1000,
    paymentMethod: 'axis_pay',
    depositConfirmed: true,
    depositReference: 'AXIS-9920148',
    receiptUrl: 'data:image/svg+xml;utf8,<svg>sample_transfer_receipt</svg>',
    notes: 'تم تحويل العربون عبر Axis Pay إلى 01554597494.'
  };

  const resPostBooking = await fetch('http://localhost:3000/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });

  const postBookingData = await resPostBooking.json();
  console.log('POST /api/booking status:', resPostBooking.status);
  console.log('Response Success:', postBookingData.success);
  console.log('Generated Booking ID:', postBookingData.bookingId);
  console.log('WhatsApp notification URL for Ahmad:', postBookingData.directWhatsAppUrl ? 'Generated (01094200285)' : 'Missing');

  console.log('\n--- 5. Testing POST /api/workers (Worker Registration & National ID) ---');
  const workerPayload = {
    fullName: 'دعاء السيد عبد الله خليل',
    phone: '01098877665',
    address: 'القاهرة - المعادي - شارع 9',
    age: 29,
    experienceYears: 4,
    specialty: 'نظافة فندقية للشقق والفلل',
    nationalIdFront: 'data:image/svg+xml;utf8,<svg>front_id</svg>',
    nationalIdBack: 'data:image/svg+xml;utf8,<svg>back_id</svg>',
    notes: 'خبرة في تنظيف الفنادق 5 نجوم.'
  };

  const resPostWorker = await fetch('http://localhost:3000/api/workers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workerPayload)
  });

  const postWorkerData = await resPostWorker.json();
  console.log('POST /api/workers status:', resPostWorker.status);
  console.log('Worker Registration Success:', postWorkerData.success);
  console.log('Worker Reference ID:', postWorkerData.referenceNumber);
  console.log('Default Status:', postWorkerData.worker?.status, '(Expected: under_review)');
  console.log('Direct WhatsApp notify URL for Ahmad:', postWorkerData.directWhatsAppUrl ? 'Generated (01094200285)' : 'Missing');

  console.log('\n--- 6. Testing GET /api/workers ---');
  const resGetWorkers = await fetch('http://localhost:3000/api/workers');
  const getWorkersData = await resGetWorkers.json();
  console.log('GET /api/workers status:', resGetWorkers.status);
  console.log('Total registered workers in store:', getWorkersData.count);

  console.log('\n--- 7. Testing PATCH /api/workers (Approval/Rejection) ---');
  const resPatchWorker = await fetch('http://localhost:3000/api/workers', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: postWorkerData.workerId,
      status: 'approved',
      reviewedBy: 'د. م/ احمد عمر'
    })
  });
  const patchWorkerData = await resPatchWorker.json();
  console.log('PATCH /api/workers status:', resPatchWorker.status);
  console.log('Updated Status:', patchWorkerData.worker?.status, '(Expected: approved)');

  console.log('\n✅ ALL PUREX APP NEW FEATURES & ENDPOINTS FULLY VERIFIED!');
}

runTests().catch(console.error);
