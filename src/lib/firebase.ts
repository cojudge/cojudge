import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';
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
let auth: Auth | undefined;

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
    auth = getAuth(app);
    
    return { app, db, auth };
}

export async function ensureAuthenticated() {
    const { auth } = initFirebase() || {};
    if (!auth) throw new Error('Firebase not initialized');
    if (!auth.currentUser) {
        await signInAnonymously(auth);
    }
    return auth.currentUser;
}

export const firebaseApp = getApps().length ? getApp() : (firebaseConfig.apiKey ? initializeApp(firebaseConfig) : undefined);
export const firestore = firebaseApp ? getFirestore(firebaseApp) : undefined;
