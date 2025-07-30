// Security configuration for Maya LMS
export const SECURITY_CONFIG = {
  // Authentication settings
  AUTH: {
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },
  
  // Rate limiting
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_REQUESTS_PER_HOUR: 1000,
    MAX_REQUESTS_PER_DAY: 10000,
  },
  
  // Data encryption
  ENCRYPTION: {
    KEY: process.env.REACT_APP_ENCRYPTION_KEY || 'maya-lms-secure-key-2025',
    ALGORITHM: 'AES-256-GCM',
  },
  
  // Input validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    STUDENT_ID_PATTERN: /^[A-Z0-9]{6,10}$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  
  // Privacy settings
  PRIVACY: {
    ANONYMIZE_STUDENT_NAMES: true,
    LOG_USER_ACTIONS: true,
    ENCRYPT_SENSITIVE_DATA: true,
  },
  
  // API security
  API: {
    REQUIRE_HTTPS: true,
    CORS_ORIGINS: process.env.REACT_APP_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    MAX_REQUEST_SIZE: '10mb',
  },
};

// Environment-specific security settings
export const getSecurityConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    ...SECURITY_CONFIG,
    AUTH: {
      ...SECURITY_CONFIG.AUTH,
      TOKEN_EXPIRY: isProduction ? 2 * 60 * 60 * 1000 : SECURITY_CONFIG.AUTH.TOKEN_EXPIRY, // 2 hours in production
    },
    PRIVACY: {
      ...SECURITY_CONFIG.PRIVACY,
      ANONYMIZE_STUDENT_NAMES: isProduction,
      LOG_USER_ACTIONS: isProduction,
    },
  };
};

// Security headers for API requests
export const getSecurityHeaders = (authToken?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Client-Version': '1.0.0',
    'X-Client-Platform': 'web',
    'X-Client-Timestamp': Date.now().toString(),
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  // Add security headers
  headers['X-Content-Type-Options'] = 'nosniff';
  headers['X-Frame-Options'] = 'DENY';
  headers['X-XSS-Protection'] = '1; mode=block';
  
  return headers;
};

// Security middleware configuration
export const SECURITY_MIDDLEWARE = {
  // CORS settings
  CORS: {
    origin: SECURITY_CONFIG.API.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  
  // Helmet settings for security headers
  HELMET: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://firebase.googleapis.com"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },
};

// Export default configuration
export default getSecurityConfig(); 