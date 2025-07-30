import { User } from '../types';

// Security configuration
const SECURITY_CONFIG = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  MAX_REQUESTS_PER_MINUTE: 60,
  ENCRYPTION_KEY: process.env.REACT_APP_ENCRYPTION_KEY || 'maya-lms-secure-key-2025',
};

// Token management
export interface AuthToken {
  token: string;
  expiresAt: number;
  userId: string;
  role: string;
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Generate secure authentication token
export const generateAuthToken = (user: User): AuthToken => {
  const token = btoa(JSON.stringify({
    uid: user.uid,
    role: user.role,
    email: user.email,
    timestamp: Date.now(),
    random: Math.random().toString(36).substring(2),
  }));
  
  return {
    token,
    expiresAt: Date.now() + SECURITY_CONFIG.TOKEN_EXPIRY,
    userId: user.uid,
    role: user.role,
  };
};

// Validate authentication token
export const validateAuthToken = (token: string): User | null => {
  try {
    const decoded = JSON.parse(atob(token));
    const now = Date.now();
    
    // Check if token is expired
    if (now > decoded.timestamp + SECURITY_CONFIG.TOKEN_EXPIRY) {
      return null;
    }
    
    return {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role as 'student' | 'teacher' | 'admin',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

// Rate limiting for API requests
export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(userId);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(userId, {
      count: 1,
      resetTime: now + 60000, // Reset every minute
    });
    return true;
  }
  
  if (userRequests.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  userRequests.count++;
  return true;
};

// Encrypt sensitive data
export const encryptData = (data: string): string => {
  try {
    // Simple encryption for demo - in production, use proper encryption libraries
    const encoded = btoa(encodeURIComponent(data));
    return encoded;
  } catch (error) {
    console.error('Encryption failed:', error);
    return data;
  }
};

// Decrypt sensitive data
export const decryptData = (encryptedData: string): string => {
  try {
    // Simple decryption for demo - in production, use proper encryption libraries
    const decoded = decodeURIComponent(atob(encryptedData));
    return decoded;
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData;
  }
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate student ID format
export const validateStudentId = (studentId: string): boolean => {
  // Customize this based on your student ID format
  const studentIdRegex = /^[A-Z0-9]{6,10}$/;
  return studentIdRegex.test(studentId);
};

// Secure API request headers
export const getSecureHeaders = (authToken?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Client-Version': '1.0.0',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Check if user has permission for specific action
export const checkPermission = (
  user: User,
  requiredRole: 'student' | 'teacher' | 'admin',
  resourceOwnerId?: string
): boolean => {
  // Check role-based access
  const roleHierarchy = {
    student: 1,
    teacher: 2,
    admin: 3,
  };
  
  const userRoleLevel = roleHierarchy[user.role] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
  
  if (userRoleLevel < requiredRoleLevel) {
    return false;
  }
  
  // Check resource ownership (if applicable)
  if (resourceOwnerId && user.uid !== resourceOwnerId && user.role !== 'admin') {
    return false;
  }
  
  return true;
};

// Secure storage for sensitive data
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Secure storage set failed:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return decryptData(encrypted);
    } catch (error) {
      console.error('Secure storage get failed:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Secure storage remove failed:', error);
    }
  },
};

// Session management
export class SecureSession {
  private static instance: SecureSession;
  private currentToken: AuthToken | null = null;
  
  static getInstance(): SecureSession {
    if (!SecureSession.instance) {
      SecureSession.instance = new SecureSession();
    }
    return SecureSession.instance;
  }
  
  setToken(token: AuthToken): void {
    this.currentToken = token;
    secureStorage.setItem('auth_token', JSON.stringify(token));
  }
  
  getToken(): AuthToken | null {
    if (!this.currentToken) {
      const stored = secureStorage.getItem('auth_token');
      if (stored) {
        try {
          this.currentToken = JSON.parse(stored);
        } catch (error) {
          console.error('Failed to parse stored token:', error);
        }
      }
    }
    
    // Check if token is expired
    if (this.currentToken && Date.now() > this.currentToken.expiresAt) {
      this.clearToken();
      return null;
    }
    
    return this.currentToken;
  }
  
  clearToken(): void {
    this.currentToken = null;
    secureStorage.removeItem('auth_token');
  }
  
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

// Export singleton instance
export const secureSession = SecureSession.getInstance(); 