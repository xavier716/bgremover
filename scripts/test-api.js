// Test Remove.bg API key
const API_KEY = 'BCcx32apbAZkjeqcrATRtzab';

async function testApiKey() {
  console.log('Testing Remove.bg API key...');
  console.log('API Key:', API_KEY.substring(0, 10) + '...');

  try {
    // Create a simple test image (1x1 red pixel PNG)
    const testImage = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const formData = new FormData();
    formData.append('image_file', new Blob([testImage]), 'test.png');
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      console.log('✅ API key is valid!');
      const data = await response.text();
      console.log('Response size:', data.length, 'bytes');
    } else {
      console.log('❌ API key error!');
      const errorText = await response.text();
      console.log('Error:', errorText);

      if (response.status === 401) {
        console.log('Error: Invalid API key');
      } else if (response.status === 402) {
        console.log('Error: Insufficient credits');
      } else if (response.status === 429) {
        console.log('Error: Rate limit exceeded');
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testApiKey();
