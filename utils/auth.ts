export async function setAuthToken(token: string): Promise<void> {
  try {
    const response = await fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to set auth token');
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
    throw error;
  }
}

export async function removeAuthToken(): Promise<void> {
  try {
    const response = await fetch('/api/auth/set-cookie', { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove auth token');
    }
  } catch (error) {
    console.error('Error removing auth token:', error);
    throw error;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export function isAuthenticated(): boolean {
  const token = getCookie('token');
  return !!token;
}

