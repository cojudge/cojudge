import { deleteApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseSettings, isFirebaseConfigured } from '$lib/firebaseSettings';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let activeConfig = '';

function appNameForProject(apiKey: string, projectId: string): string {
    const identity = `${apiKey}:${projectId}`;
    let hash = 2166136261;
    for (let i = 0; i < identity.length; i++) {
        hash ^= identity.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return `cojudge-${(hash >>> 0).toString(36)}`;
}

export async function initFirebase() {
    const firebaseConfig = getFirebaseSettings();
    if (!isFirebaseConfigured(firebaseConfig)) return null;

    const configKey = JSON.stringify(firebaseConfig);
    if (app && activeConfig === configKey) return { app, db: db!, auth: auth! };

    const appName = appNameForProject(firebaseConfig.apiKey, firebaseConfig.projectId);
    if (app) await deleteApp(app);
    const existing = getApps().find((candidate) => candidate.name === appName);
    if (existing && JSON.stringify(existing.options) !== configKey) await deleteApp(existing);
    app = getApps().find((candidate) => candidate.name === appName)
        ?? initializeApp(firebaseConfig, appName);
    db = getFirestore(app);
    auth = getAuth(app);
    activeConfig = configKey;

    return { app, db, auth };
}

export async function ensureAuthenticated() {
    const { auth } = (await initFirebase()) || {};
    if (!auth) throw new Error('Firebase not initialized');
    if (!auth.currentUser) {
        await signInAnonymously(auth);
    }
    return auth.currentUser;
}
