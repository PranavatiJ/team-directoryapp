
const AUTH_URL = 'https://dummyjson.com/auth';

export async function loginUser(username, password) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed.');
  }

  return data;
}

export async function refreshAuthToken(refreshToken) {
  const response = await fetch(`${AUTH_URL}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
      expiresInMins: 30,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to refresh token.');
  }

  return data;
}

export async function getCurrentUser(accessToken) {
  const response = await fetch(`${AUTH_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to verify user.');
  }

  return data;
}
