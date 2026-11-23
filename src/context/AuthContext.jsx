import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  loginUser,
  refreshAuthToken,
  getCurrentUser,
} from '../services/authService.js';

const AuthContext = createContext(null);

function getStoredAuth() {
  const storage = localStorage.getItem('accessToken')
    ? localStorage
    : sessionStorage;

  const accessToken = storage.getItem('accessToken');
  const savedUser = storage.getItem('authUser');

  if (!accessToken || !savedUser) {
    return { accessToken: null, user: null };
  }

  try {
    return {
      accessToken,
      user: JSON.parse(savedUser),
    };
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('authUser');

    return { accessToken: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);
useEffect(() => {
  async function verifySession() {
    if (!auth.accessToken) {
      return;
    }

    try {
      let currentUser;

      try {
        currentUser = await getCurrentUser(auth.accessToken);
      } catch {
        console.log('Access token invalid. Trying refresh...');

        const newAccessToken = await refreshToken();

        if (!newAccessToken) {
          logout();
          return;
        }

        currentUser = await getCurrentUser(newAccessToken);
      }

      setAuth((previousAuth) => ({
        ...previousAuth,
        user: currentUser,
      }));

      const storage = localStorage.getItem('accessToken')
        ? localStorage
        : sessionStorage;

      storage.setItem('authUser', JSON.stringify(currentUser));

    } catch (error) {
      console.error('Session verification failed:', error);
      logout();
    }
  }

  verifySession();
}, []);


  async function login(username, password, rememberMe) {
    const data = await loginUser(username, password);

    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    };

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('authUser');

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('accessToken', data.accessToken);
    storage.setItem('refreshToken', data.refreshToken);
    storage.setItem('authUser', JSON.stringify(user));

    setAuth({
      accessToken: data.accessToken,
      user,
    });

    return user;
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('authUser');

    setAuth({
      accessToken: null,
      user: null,
    });
  }

 
async function refreshToken() {
  const storage = localStorage.getItem('refreshToken')
    ? localStorage
    : sessionStorage;

  const storedRefreshToken = storage.getItem('refreshToken');

  if (!storedRefreshToken) {
    logout();
    return null;
  }

  try {
    const data = await refreshAuthToken(storedRefreshToken);

    storage.setItem('accessToken', data.accessToken);

    if (data.refreshToken) {
      storage.setItem('refreshToken', data.refreshToken);
    }

    setAuth((previousAuth) => ({
      ...previousAuth,
      accessToken: data.accessToken,
    }));

    return data.accessToken;

  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return null;
  }
}


  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        accessToken: auth.accessToken,
        isAuthenticated: Boolean(auth.accessToken && auth.user),
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
