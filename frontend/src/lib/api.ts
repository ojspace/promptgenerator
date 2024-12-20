const API_BASE_URL = 'http://localhost:8000';

export async function sendMagicLink(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/magic-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send magic link');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending magic link:', error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

export async function generatePrompt(prompt: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
}
