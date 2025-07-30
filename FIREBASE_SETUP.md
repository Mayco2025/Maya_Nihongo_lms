# 🔥 Firebase Setup Guide for Maya LMS

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Project name**: `maya-nihongo-lms`
4. **Enable Google Analytics**: Yes (recommended)
5. **Click "Create project"**

## Step 2: Enable Authentication

1. **In Firebase Console**, go to "Authentication" → "Sign-in method"
2. **Enable these providers**:
   - ✅ Email/Password
   - ✅ Anonymous (for demo mode)
3. **Click "Save"**

## Step 3: Set Up Firestore Database

1. **Go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"** (for development)
4. **Select location**: Choose closest to your users
5. **Click "Done"**

## Step 4: Set Up Storage (Optional)

1. **Go to "Storage"**
2. **Click "Get started"**
3. **Choose "Start in test mode"**
4. **Select location**: Same as Firestore
5. **Click "Done"**

## Step 5: Get Firebase Configuration

1. **Go to Project Settings** (gear icon)
2. **Scroll down to "Your apps"**
3. **Click "Add app"** → "Web"
4. **App nickname**: `maya-lms-web`
5. **Copy the config object**

## Step 6: Environment Variables

Create a `.env` file in your project root:

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

## Step 7: Firestore Security Rules

Go to Firestore → Rules and update with:

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

## Step 8: Test the Setup

1. **Start your development server**:

   ```bash
   npm start
   ```

2. **Test registration and login**
3. **Verify data is being saved to Firestore**

## Troubleshooting

### Common Issues:

1. **"Firebase configuration is not available"**

   - Check your `.env` file exists
   - Verify all environment variables are set
   - Restart your development server

2. **"Permission denied" errors**

   - Check Firestore security rules
   - Verify authentication is working
   - Check user roles in database

3. **"Rate limit exceeded"**
   - This is expected behavior (security feature)
   - Wait 1 minute before trying again

## Production Deployment

For production, you'll also need:

1. **Custom domain** setup
2. **SSL certificate** (HTTPS required)
3. **Production Firebase project**
4. **Updated security rules**
5. **Monitoring and analytics**

---

**Need Help?** Check the Firebase documentation or contact the development team.
