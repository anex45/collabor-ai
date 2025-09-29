# Firebase Setup Instructions

## Current Issue
You're getting a 400 Bad Request error when trying to write to Firestore. This means your Firestore database hasn't been set up yet.

## Steps to Fix:

### 1. Create Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `collabor-ai` project
3. Click "Firestore Database" in the left sidebar
4. Click "Create database"
5. Choose "Start in test mode" (allows read/write for development)
6. Select a location close to you
7. Click "Done"

### 2. Set Security Rules (Development Mode)
After creating the database, go to the "Rules" tab and ensure you have:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

### 3. Collections Created by App
Your app will automatically create these collections:
- `Workspace` - Stores workspace information
- `workspaceDocuments` - Stores document metadata
- `documentOutput` - Stores document content
- `LoopUsers` - Stores user information

### 4. Test Connection
After setting up Firestore, try creating a new workspace. The error should disappear.

## Status
- ✅ Firebase Config Updated
- ✅ Error Handling Added
- ⚠️ **Need to create Firestore Database in Firebase Console**