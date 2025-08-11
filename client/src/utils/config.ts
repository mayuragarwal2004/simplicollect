import axios from 'axios';
import Cookies from 'universal-cookie'; // Or use localStorage if preferred
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const cookies = new Cookies();

// Determine the base URL based on platform
const getBaseURL = (): string => {
  // If running in Capacitor (native app), use the full API URL
  if (Capacitor.isNativePlatform()) {
    const isDevelopment = (import.meta as any).env.DEV;
    const apiUrl = isDevelopment 
      ? (import.meta as any).env.VITE_API_URL 
      : (import.meta as any).env.VITE_API_URL_PRODUCTION || (import.meta as any).env.VITE_API_URL;
    
    const baseUrl = apiUrl || 'http://localhost:5000';
    
    // Log for debugging in development
    if (isDevelopment) {
      console.log(`[Capacitor] Using API base URL: ${baseUrl}`);
    }
    console.log(`[Capacitor] Using API base URL: ${baseUrl}`);
    
    return baseUrl;
  }
  
  // If running in web browser, use empty string (relative URLs)
  if ((import.meta as any).env.DEV) {
    console.log('[Web] Using relative URLs (empty baseURL)');
  }
  
  return '';
};

// Get platform information for debugging
const getPlatformInfo = () => {
  return {
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform(),
    isDevelopment: (import.meta as any).env.DEV,
    baseURL: getBaseURL(),
  };
};

// Log platform info in development
if ((import.meta as any).env.DEV) {
  console.log('[Config] Platform info:', getPlatformInfo());
}

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
});

// Add an interceptor to include the authorization token in every request
axiosInstance.interceptors.request.use(
  async (config: any) => {
    let token: string | undefined | null;

    if (Capacitor.isNativePlatform()) {
      // Use Capacitor Preferences on native
      const { value } = await Preferences.get({ key: 'accessToken' });
      token = value;
    } else {
      // Use cookies on web
      token = cookies.get('token');
    }

    // If a token exists, add it to the request headers
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Token ${token}`;
      } else {
        config.headers = { Authorization: `Token ${token}` };
      }
    }

    return config;
  },
  (error) => {
    // Handle errors before they are sent
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle the response data
    return response;
  },
  async (error) => {
    // Handle errors globally
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('[Auth] Token expired or unauthorized, cleaning up...');
      
      // Platform-specific token cleanup
      if (Capacitor.isNativePlatform()) {
        // Native app: remove tokens from Capacitor Preferences
        try {
          await Preferences.remove({ key: 'accessToken' });
          await Preferences.remove({ key: 'refreshToken' });
          console.log('[Auth] Native tokens removed from Preferences');
        } catch (prefError) {
          console.error('[Auth] Error removing native tokens:', prefError);
        }
      } else {
        // Web: remove tokens from cookies and sessionStorage
        cookies.remove('token');
        cookies.remove('refreshToken'); // Also remove refresh token cookie
        sessionStorage.removeItem('accessToken');
        console.log('[Auth] Web tokens removed from cookies and sessionStorage');
      }
      
      // Trigger a custom event for AuthContext to listen to
      window.dispatchEvent(new CustomEvent('authTokenExpired', {
        detail: { 
          status: error.response.status,
          platform: Capacitor.isNativePlatform() ? 'native' : 'web'
        }
      }));
      
      // For native apps, don't use window.location.href
      if (Capacitor.isNativePlatform()) {
        // Let the AuthContext handle navigation for native apps
        console.log('[Auth] Native app token expired - AuthContext will handle navigation');
      } else {
        // Web: redirect to login page
        setTimeout(() => {
          window.location.href = '/auth/signin';
        }, 100); // Small delay to allow event dispatch
      }
    }
    return Promise.reject(error);
  },
);

// Export platform info for use in other parts of the app
export { getPlatformInfo };
