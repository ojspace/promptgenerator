const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function sendMagicLink(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send magic link');
    }

    return await response.json();
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

    return await response.json();
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

export async function generatePrompt(prompt: string, projectType: string, imageData?: string) {
  try {
    console.log('Sending request with:', { prompt, projectType, imageData: imageData ? 'present' : 'absent' });
    
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        project_type: projectType,
        image_data: imageData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error response:', errorData);
      throw new Error(errorData?.detail || 'Failed to generate prompt');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
}
