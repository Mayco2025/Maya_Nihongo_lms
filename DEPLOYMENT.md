# 🚀 Maya LMS Deployment Guide

## Overview

This guide will help you deploy the Maya Learning Management System so students and teachers can start using it immediately.

## 📋 Pre-Deployment Checklist

### ✅ Required Setup

- [ ] Firebase project created and configured
- [ ] Environment variables set up
- [ ] Security measures implemented
- [ ] User management system ready
- [ ] Database security rules configured

## 🎯 **Step 1: Quick Start (Demo Mode)**

For immediate testing without Firebase setup:

```bash
# Clone and start the application
git clone https://github.com/Mayco2025/Maya_Nihongo_lms.git
cd Maya_Nihongo_lms
npm install
npm start
```

The app will run in **demo mode** with:

- ✅ Pre-loaded sample data
- ✅ Mock authentication
- ✅ All features functional
- ✅ No external dependencies

**Access URL**: http://localhost:3000

## 🔥 **Step 2: Firebase Setup (Production Ready)**

### 2.1 Create Firebase Project

1. **Visit**: https://console.firebase.google.com/
2. **Create Project**: `maya-nihongo-lms`
3. **Enable Analytics**: Yes

### 2.2 Configure Authentication

1. **Go to**: Authentication → Sign-in method
2. **Enable**:
   - ✅ Email/Password
   - ✅ Anonymous (for demo)

### 2.3 Set Up Firestore Database

1. **Go to**: Firestore Database
2. **Create Database**: Start in test mode
3. **Location**: Choose closest to your users

### 2.4 Get Configuration

1. **Project Settings** → Add app → Web
2. **Copy the config object**

### 2.5 Environment Variables

Create `.env` file in project root:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Security Configuration
REACT_APP_ENCRYPTION_KEY=maya-lms-secure-key-2025
REACT_APP_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# App Configuration
REACT_APP_APP_ID=default-japanese-school
```

## 👥 **Step 3: User Setup**

### 3.1 Create Admin Account

1. **Start the application**
2. **Register as a teacher**:
   - Email: `admin@maya-lms.com`
   - Password: `securepassword123`
   - Role: Teacher

### 3.2 Create Student Accounts

**Option A: Self-Registration**

- Students can register themselves
- Teachers approve accounts

**Option B: Bulk Import**

- Use the User Management interface
- Import student data from CSV

### 3.3 Sample Student Data

```json
{
  "students": [
    {
      "firstName": "Abebe",
      "lastName": "Kebede",
      "email": "abebe@example.com",
      "studentId": "STU001",
      "level": "N5"
    },
    {
      "firstName": "Fatima",
      "lastName": "Ahmed",
      "email": "fatima@example.com",
      "studentId": "STU002",
      "level": "N4"
    }
  ]
}
```

## 📚 **Step 4: Content Setup**

### 4.1 Create Class Groups

1. **Login as teacher**
2. **Go to**: Teacher Dashboard → User Management
3. **Create classes**:
   - N5 Beginners (Morning)
   - N4 Intermediate (Evening)
   - N3 Advanced (Weekend)

### 4.2 Upload Materials

1. **Go to**: Materials page
2. **Upload**:
   - Lesson PDFs
   - Video recordings
   - Audio files
   - Practice exercises

### 4.3 Set Up Schedule

1. **Go to**: Schedule page
2. **Create classes** with:
   - Google Meet links
   - Duration
   - Teacher assignment

## 🌐 **Step 5: Production Deployment**

### 5.1 Build for Production

```bash
npm run build
```

### 5.2 Deploy Options

**Option A: Firebase Hosting (Recommended)**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy
```

**Option B: Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Option C: Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### 5.3 Custom Domain Setup

1. **Purchase domain** (e.g., `maya-lms.com`)
2. **Configure DNS**:
   - A record → Firebase hosting IP
   - CNAME → your-app.web.app
3. **Add domain** in Firebase Console
4. **Update environment variables**

## 🔒 **Step 6: Security Configuration**

### 6.1 Firestore Security Rules

Update rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /artifacts/{appId}/users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated users to read public data
    match /artifacts/{appId}/public/data/{collection}/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Allow teachers to manage class data
    match /artifacts/{appId}/classes/{classId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (resource.data.teacherId == request.auth.uid ||
         get(/databases/$(database)/documents/artifacts/$(appId)/users/$(request.auth.uid)).data.role in ['teacher', 'admin']);
    }
  }
}
```

### 6.2 Environment Variables (Production)

```env
# Production Security
REACT_APP_ENCRYPTION_KEY=your-production-encryption-key
REACT_APP_ALLOWED_ORIGINS=https://yourdomain.com
NODE_ENV=production
```

## 📊 **Step 7: Monitoring & Analytics**

### 7.1 Firebase Analytics

1. **Enable** in Firebase Console
2. **Track**:
   - User engagement
   - Feature usage
   - Error rates

### 7.2 Performance Monitoring

1. **Enable** Firebase Performance
2. **Monitor**:
   - Page load times
   - API response times
   - User experience

## 🧪 **Step 8: Testing**

### 8.1 User Acceptance Testing

**Test as Student:**

- [ ] Registration and login
- [ ] View class schedule
- [ ] Access materials
- [ ] Ask questions in Q&A
- [ ] Join Google Meet classes

**Test as Teacher:**

- [ ] Create class groups
- [ ] Upload materials
- [ ] Answer student questions
- [ ] Manage user accounts
- [ ] Schedule classes

### 8.2 Security Testing

- [ ] Authentication flow
- [ ] Role-based access
- [ ] Data privacy
- [ ] Rate limiting
- [ ] Input validation

## 📱 **Step 9: User Onboarding**

### 9.1 Student Welcome Email

```html
Subject: Welcome to Maya Nihongo LMS! Dear [Student Name], Welcome to Maya
Nihongo Learning Management System! Your login credentials: - Email: [email] -
Password: [temporary_password] Please change your password after first login.
Best regards, Maya LMS Team
```

### 9.2 Teacher Training

1. **Schedule training session**
2. **Cover**:
   - User management
   - Material upload
   - Class scheduling
   - Q&A management

## 🚨 **Step 10: Go Live Checklist**

### Final Verification

- [ ] **All features working**
- [ ] **Security measures active**
- [ ] **User accounts created**
- [ ] **Content uploaded**
- [ ] **Schedule configured**
- [ ] **Domain configured**
- [ ] **SSL certificate active**
- [ ] **Backup system ready**
- [ ] **Support contact established**

## 📞 **Support & Maintenance**

### Contact Information

- **Technical Support**: tech@maya-lms.com
- **User Support**: support@maya-lms.com
- **Emergency**: +1-XXX-XXX-XXXX

### Regular Maintenance

- **Weekly**: Check error logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: Full system review

---

## 🎉 **You're Ready!**

Your Maya LMS is now ready for students and teachers to use!

**Production URL**: https://yourdomain.com

**Next Steps**:

1. Send welcome emails to users
2. Schedule training sessions
3. Monitor system performance
4. Gather user feedback
5. Plan future enhancements

---

**Need Help?** Check the documentation or contact the development team.
