import React, { useState } from 'react';
import { MayaLogo } from './icons';
import LoginForm from './auth/LoginForm';
import StudentRegistration from './auth/StudentRegistration';
import { AuthFormData } from '../types';

interface LoginScreenProps {
  onLogin?: (data: AuthFormData) => Promise<void>;
  onRegister?: (data: AuthFormData) => Promise<void>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: AuthFormData) => {
    setLoading(true);
    try {
      if (onLogin) {
        await onLogin(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: AuthFormData) => {
    setLoading(true);
    try {
      if (onRegister) {
        await onRegister(data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLogin) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setIsLogin(false)}
        loading={loading}
      />
    );
  }

  return (
    <StudentRegistration
      onRegister={handleRegister}
      onSwitchToLogin={() => setIsLogin(true)}
      loading={loading}
    />
  );
};

export default LoginScreen; 