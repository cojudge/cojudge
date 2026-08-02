import { deleteApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
	GoogleAuthProvider,
	getAuth,
	linkWithCredential,
	signInAnonymously,
	signInWithCredential,
	signOut,
	type Auth
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import {
	getFirebaseSettings,
	isDesktopRuntime,
	isFirebaseConfigured,
	type FirebaseSettings
} from '$lib/firebaseSettings';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let activeConfig = '';
let googleIdentityScript: Promise<void> | null = null;

const googleWebClientId = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID ?? '';

type GoogleTokenResponse = {
	access_token?: string;
	error?: string;
	error_description?: string;
};

type GoogleTokenClient = {
	requestAccessToken: (config?: { prompt?: string }) => void;
};

type GoogleIdentityApi = {
	accounts: {
		oauth2: {
			initTokenClient: (config: {
				client_id: string;
				scope: string;
				callback: (response: GoogleTokenResponse) => void;
				error_callback: (error: { message?: string; type?: string }) => void;
			}) => GoogleTokenClient;
		};
	};
};

type AuthSession = {
	uid: string | null;
	isAnonymous: boolean;
};

function getGoogleIdentityApi(): GoogleIdentityApi | undefined {
	return (window as Window & { google?: GoogleIdentityApi }).google;
}

function loadGoogleIdentityServices(): Promise<void> {
	if (getGoogleIdentityApi()) return Promise.resolve();
	if (googleIdentityScript) return googleIdentityScript;

	googleIdentityScript = new Promise<void>((resolve, reject) => {
		const existing = document.querySelector<HTMLScriptElement>('script[data-cojudge-google-identity]');
		const script = existing ?? document.createElement('script');
		const cleanup = () => {
			clearTimeout(timeout);
			script.removeEventListener('load', onLoad);
			script.removeEventListener('error', onError);
		};
		const fail = (error: Error) => {
			cleanup();
			script.remove();
			reject(error);
		};
		const onLoad = () => {
			cleanup();
			if (getGoogleIdentityApi()) resolve();
			else fail(new Error('Google sign-in did not initialize.'));
		};
		const onError = () => fail(new Error('Google sign-in could not be loaded. Check your connection.'));
		const timeout = setTimeout(
			() => fail(new Error('Google sign-in took too long to load. Try again.')),
			15_000
		);
		script.addEventListener('load', onLoad, { once: true });
		script.addEventListener('error', onError, { once: true });
		if (!existing) {
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.dataset.cojudgeGoogleIdentity = 'true';
			document.head.appendChild(script);
		}
	}).catch((error) => {
		googleIdentityScript = null;
		throw error;
	});
	return googleIdentityScript!;
}

function requestGoogleWebAccessToken(clientId: string): Promise<string> {
	const google = getGoogleIdentityApi();
	if (!google) {
		void loadGoogleIdentityServices().catch(() => undefined);
		return Promise.reject(new Error('Google sign-in is still loading. Try again in a moment.'));
	}

	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (callback: () => void) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			callback();
		};
		const timeout = setTimeout(
			() => finish(() => reject(new Error('Google sign-in timed out.'))),
			5 * 60 * 1000
		);
		const client = google.accounts.oauth2.initTokenClient({
			client_id: clientId,
			scope: 'openid email profile',
			callback: (response) => {
				if (response.access_token) finish(() => resolve(response.access_token!));
				else {
					const detail = response.error_description || response.error || 'Google sign-in failed.';
					finish(() => reject(new Error(detail)));
				}
			},
			error_callback: (error) => {
				const detail = error.message || error.type || 'Google sign-in was cancelled.';
				finish(() => reject(new Error(detail)));
			}
		});
		client.requestAccessToken({ prompt: 'select_account' });
	});
}

async function signInWithGoogleCredential(
	auth: Auth,
	credential: ReturnType<typeof GoogleAuthProvider.credential>,
	startingSession: AuthSession
) {
	const currentSession = captureAuthSession(auth);
	if (
		currentSession.uid !== startingSession.uid
		|| currentSession.isAnonymous !== startingSession.isAnonymous
	) {
		throw new Error('The signed-in account changed while Google sign-in was open.');
	}

	if (auth.currentUser?.isAnonymous) {
		try {
			return await linkWithCredential(auth.currentUser, credential);
		} catch (error) {
			if ((error as { code?: string })?.code !== 'auth/credential-already-in-use') throw error;
		}
	}
	return signInWithCredential(auth, credential);
}

function captureAuthSession(auth: Auth): AuthSession {
	return {
		uid: auth.currentUser?.uid ?? null,
		isAnonymous: auth.currentUser?.isAnonymous === true
	};
}

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
	const settings = getFirebaseSettings();
	if (!isFirebaseConfigured(settings)) return null;
	const {
		googleDesktopClientId: _googleDesktopClientId,
		googleDesktopClientSecret: _googleDesktopClientSecret,
		...firebaseConfig
	} = settings;

	const configKey = JSON.stringify(settings);
	if (app && activeConfig === configKey) return { app, db: db!, auth: auth! };

	const appName = appNameForProject(settings.apiKey, settings.projectId);
	if (app) await deleteApp(app);
	const existing = getApps().find((candidate) => candidate.name === appName);
	if (existing && JSON.stringify(existing.options) !== JSON.stringify(firebaseConfig)) await deleteApp(existing);
    app = getApps().find((candidate) => candidate.name === appName)
        ?? initializeApp(firebaseConfig, appName);
    db = getFirestore(app);
	auth = getAuth(app);
	activeConfig = configKey;
	if (!isDesktopRuntime() && googleWebClientId) {
		void loadGoogleIdentityServices().catch(() => undefined);
	}

    return { app, db, auth };
}

export async function ensureAuthenticated() {
	const { auth } = (await initFirebase()) || {};
	if (!auth) throw new Error('Firebase not initialized');
	await auth.authStateReady();
	if (!auth.currentUser) {
		return (await signInAnonymously(auth)).user;
	}
	return auth.currentUser;
}

export async function signInWithGoogle() {
	const initialized = await initFirebase();
	if (!initialized) throw new Error('Firebase is not configured.');
	const { auth } = initialized;
	await auth.authStateReady();
	const startingSession = captureAuthSession(auth);

	if (isDesktopRuntime()) {
		const { googleDesktopClientId, googleDesktopClientSecret } =
			getFirebaseSettings() as FirebaseSettings;
		if (!googleDesktopClientId) {
			throw new Error('The Google desktop OAuth client ID is not configured.');
		}

		const tauriInternals = (window as Window & {
			__TAURI_INTERNALS__?: {
				invoke: <T>(command: string, args?: Record<string, unknown>) => Promise<T>;
			};
		}).__TAURI_INTERNALS__;
		if (!tauriInternals) throw new Error('The desktop OAuth bridge is unavailable.');
		const accessToken = await tauriInternals.invoke<string>('google_oauth_access_token', {
			clientId: googleDesktopClientId,
			clientSecret: googleDesktopClientSecret || null
		});
		const credential = GoogleAuthProvider.credential(null, accessToken);
		return signInWithGoogleCredential(auth, credential, startingSession);
	}

	if (!googleWebClientId) {
		throw new Error('The Google web OAuth client ID is not configured.');
	}
	const accessToken = await requestGoogleWebAccessToken(googleWebClientId);
	return signInWithGoogleCredential(
		auth,
		GoogleAuthProvider.credential(null, accessToken),
		startingSession
	);
}

export async function signOutFirebase(): Promise<void> {
	const initialized = await initFirebase();
	if (initialized) await signOut(initialized.auth);
}
