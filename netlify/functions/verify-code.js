exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const { code } = JSON.parse(event.body);

    // Valid codes (in production, this could come from a database or environment variables)
    const validCodes = [
      'BOOK12345678',
      'DEMO98765432',
      'TEST11111111',
      'SUCCESS22222',
      'PREMIUM67890',
      'VERIFY123456'
    ];

    // Check if the code is valid
    const isValidCode = validCodes.includes(code?.toUpperCase()?.trim());

    if (isValidCode) {
      // Generate a temporary access token
      const accessToken = generateAccessToken();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Code verified successfully!',
          accessToken: accessToken
        }),
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid code. Please check your book for the correct code.' 
        }),
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Server error. Please try again later.' 
      }),
    };
  }
};

// Simple token generator (in production, use a proper JWT library)
function generateAccessToken() {
  return 'verified_' + Math.random().toString(36).substr(2, 9) + Date.now();
}
