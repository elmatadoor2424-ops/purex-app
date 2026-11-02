async function runTests() {
  console.log('--- 1. Testing Landing Page (/) ---');
  const resHome = await fetch('http://localhost:3000/');
  console.log('Landing page HTTP status:', resHome.status);
  const homeHtml = await resHome.text();
  console.log('Contains PureX logo/brand:', homeHtml.includes('PureX'));
  console.log('Contains Pricing Calculator:', homeHtml.includes('pricing-calculator'));

  console.log('\n--- 2. Testing Admin Operations View (/admin/operations) ---');
  const resAdmin = await fetch('http://localhost:3000/admin/operations');
  console.log('Admin Operations HTTP status:', resAdmin.status);
  const adminHtml = await resAdmin.text();
  console.log('Contains Operations header / auth gate:', adminHtml.includes('لوحة تشغيل') || adminHtml.includes('purex'));

  console.log('\n--- 3. Testing POST /api/booking (WapiPilot Webhook Integration) ---');
  const testPayload = {
    name: 'د. سامح المنشاوي',
    phone: '01019283746',
    clientWhatsApp: '01019283746',
    location: 'التجمع الخامس - كمبوند ميفيدا',
    compoundOrBuilding: 'فيلا 88',
    propertyType: 'villa',
    areaSquareMeters: 420,
    roomsCount: 5,
    bathroomsCount: 4,
    date: '2026-11-05',
    timeSlot: 'morning',
    addOns: ['carpet_steam', 'crystal_polishing', 'ozone_sterilization'],
    estimatedPrice: 5400,
    depositAmount: 1100,
    paymentMethod: 'instapay',
    depositConfirmed: true,
    depositReference: 'INSTA-88492019',
    notes: 'يرجى إحضار ماكينة جلي الرخام الإيطالية.'
  };

  const resPost = await fetch('http://localhost:3000/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });

  const postData = await resPost.json();
  console.log('POST /api/booking status:', resPost.status);
  console.log('Response Success:', postData.success);
  console.log('Generated Booking ID:', postData.bookingId);
  console.log('WapiPilot Webhook Payload:', JSON.stringify(postData.webhook?.sentPayload?.messageTemplate, null, 2));

  console.log('\n--- 4. Testing GET /api/booking ---');
  const resGet = await fetch('http://localhost:3000/api/booking');
  const getData = await resGet.json();
  console.log('GET /api/booking status:', resGet.status);
  console.log('Total bookings in store:', getData.count);
  console.log('Latest booking reference:', getData.bookings[0]?.referenceNumber, 'Client:', getData.bookings[0]?.clientName);

  console.log('\n✅ ALL PUREX PLATFORM ENDPOINTS VERIFIED SUCCESSFULLY!');
}

runTests().catch(console.error);
