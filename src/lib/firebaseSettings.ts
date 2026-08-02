export type FirebaseSettings = {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
	googleDesktopClientId: string;
	googleDesktopClientSecret: string;
};

export const FIREBASE_SETTINGS_STORAGE_KEY = 'cojudge-firebase-settings';
const isBrowser = typeof window !== 'undefined';

const environmentSettings: FirebaseSettings = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
	appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
	googleDesktopClientId: import.meta.env.VITE_GOOGLE_DESKTOP_CLIENT_ID ?? '',
	googleDesktopClientSecret: import.meta.env.VITE_GOOGLE_DESKTOP_CLIENT_SECRET ?? ''
};

function normalizeSettings(value: unknown): Partial<FirebaseSettings> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

	const source = value as Record<string, unknown>;
	const settings: Partial<FirebaseSettings> = {};
	for (const key of Object.keys(environmentSettings) as (keyof FirebaseSettings)[]) {
		if (typeof source[key] === 'string') settings[key] = source[key].trim();
	}
	return settings;
}

export function emptyFirebaseSettings(): FirebaseSettings {
	return {
		apiKey: '',
		authDomain: '',
		projectId: '',
		storageBucket: '',
		messagingSenderId: '',
		appId: '',
		googleDesktopClientId: '',
		googleDesktopClientSecret: ''
	};
}

export function firebaseSettingsFromSaved(
	value: unknown,
	environment: FirebaseSettings = environmentSettings
): FirebaseSettings {
	const saved = { ...emptyFirebaseSettings(), ...normalizeSettings(value) };
	if (saved.projectId && saved.projectId === environment.projectId) {
		if (!saved.googleDesktopClientId) {
			saved.googleDesktopClientId = environment.googleDesktopClientId;
		}
		if (!saved.googleDesktopClientSecret) {
			saved.googleDesktopClientSecret = environment.googleDesktopClientSecret;
		}
	}
	return saved;
}

export function isDesktopRuntime(): boolean {
	if (!isBrowser) return false;
	const tauriWindow = window as Window & { __TAURI_INTERNALS__?: unknown };
	return window.location.hostname === 'cojudge.localhost' || Boolean(tauriWindow.__TAURI_INTERNALS__);
}

export function getFirebaseSettings(): FirebaseSettings {
	if (isDesktopRuntime()) {
		try {
			const saved = localStorage.getItem(FIREBASE_SETTINGS_STORAGE_KEY);
			if (saved) {
				const savedSettings = firebaseSettingsFromSaved(JSON.parse(saved));
				if (isFirebaseConfigured(savedSettings)) return savedSettings;
			}
		} catch (error) {
			console.error('Failed to read Firebase settings:', error);
		}
	}

	return { ...environmentSettings };
}

export function hasSavedFirebaseSettings(): boolean {
	if (!isDesktopRuntime()) return false;
	try {
		return localStorage.getItem(FIREBASE_SETTINGS_STORAGE_KEY) !== null;
	} catch (error) {
		console.error('Failed to inspect Firebase settings:', error);
		return false;
	}
}

export function saveFirebaseSettings(settings: FirebaseSettings): void {
	if (!isDesktopRuntime()) throw new Error('Runtime Firebase settings are only available in desktop mode.');
	localStorage.setItem(
		FIREBASE_SETTINGS_STORAGE_KEY,
		JSON.stringify(normalizeSettings(settings))
	);
}

export function clearFirebaseSettings(): void {
	if (isDesktopRuntime()) localStorage.removeItem(FIREBASE_SETTINGS_STORAGE_KEY);
}

export function isFirebaseConfigured(settings = getFirebaseSettings()): boolean {
	return Boolean(
		settings.apiKey &&
		settings.authDomain &&
		settings.projectId &&
		settings.messagingSenderId &&
		settings.appId
	);
}
