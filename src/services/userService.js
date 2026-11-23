
const USERS_URL = 'https://dummyjson.com/users';

// Reusable function to handle authenticated API requests
async function authorizedFetch(
  url,
  accessToken,
  refreshTokenFn,
  options = {}
) {
  const sendRequest = (token) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  let response = await sendRequest(accessToken);

  // If access token expires, refresh it and retry once
  if (response.status === 401) {
    const newAccessToken = await refreshTokenFn();

    if (!newAccessToken) {
      throw new Error('Session expired. Please log in again.');
    }

    response = await sendRequest(newAccessToken);
  }

  return response;
}

export async function getUsers(
  accessToken,
  signal,
  refreshTokenFn
) {
  const response = await authorizedFetch(
    USERS_URL,
    accessToken,
    refreshTokenFn,
    { method: 'GET', signal }
  );

  if (!response.ok) {
    throw new Error('Unable to load team members. Please try again.');
  }

  const data = await response.json();
  return data.users;
}

export async function addUser(
  accessToken,
  memberData,
  refreshTokenFn
) {
  const response = await authorizedFetch(
    'https://dummyjson.com/users/add',
    accessToken,
    refreshTokenFn,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to add member.');
  }

  return data;
}

export async function deleteUser(
  accessToken,
  userId,
  refreshTokenFn
) {
  const response = await authorizedFetch(
    `https://dummyjson.com/users/${userId}`,
    accessToken,
    refreshTokenFn,
    { method: 'DELETE' }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to delete member.');
  }

  return data;
}
