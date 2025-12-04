// app/api/verify/route.js
export async function POST(request) {
  try {
    const { licenseKey } = await request.json();
    
    if (!licenseKey) {
      return Response.json(
        { error: 'License key required' },
        { status: 400 }
      );
    }

    // Mock validation - In production, call Gumroad API:
    // const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer YOUR_GUMROAD_ACCESS_TOKEN'
    //   },
    //   body: JSON.stringify({
    //     product_permalink: 'markdown-pro',
    //     license_key: licenseKey
    //   })
    // });
    
    // Mock response for now
    const isValid = licenseKey.includes('PRO') || licenseKey.includes('TRIAL');
    
    return Response.json({
      valid: isValid,
      plan: isValid ? (licenseKey.includes('TRIAL') ? 'trial' : 'pro') : null,
      message: isValid ? 'License is valid' : 'Invalid license key'
    });
    
  } catch (error) {
    console.error('License verification error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}