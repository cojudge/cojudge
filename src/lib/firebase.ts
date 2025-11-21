import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function initFirebase() {
    if (!firebaseConfig.apiKey) {
        return null;
    }
    
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    db = getFirestore(app);
    return { app, db };
}

export const firebaseApp = getApps().length ? getApp() : (firebaseConfig.apiKey ? initializeApp(firebaseConfig) : undefined);
export const firestore = firebaseApp ? getFirestore(firebaseApp) : undefined;
