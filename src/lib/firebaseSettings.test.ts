import { describe, expect, it } from 'vitest';
import {
	emptyFirebaseSettings,
	firebaseSettingsFromSaved,
	isFirebaseConfigured,
	type FirebaseSettings
} from './firebaseSettings';

describe('Firebase settings', () => {
	it('requires all five sharing fields', () => {
		expect(isFirebaseConfigured(emptyFirebaseSettings())).toBe(false);

		const configured: FirebaseSettings = {
			apiKey: 'api-key',
			authDomain: 'cojudge.firebaseapp.com',
			projectId: 'cojudge',
			storageBucket: '',
			messagingSenderId: '123456789',
			appId: '1:123456789:web:abc',
			googleDesktopClientId: '',
			googleDesktopClientSecret: ''
		};
		expect(isFirebaseConfigured(configured)).toBe(true);
		expect(isFirebaseConfigured({ ...configured, projectId: '' })).toBe(false);
	});

	it('inherits release OAuth credentials for legacy settings from the same project', () => {
		const environment: FirebaseSettings = {
			apiKey: 'release-key',
			authDomain: 'cojudge.firebaseapp.com',
			projectId: 'cojudge',
			storageBucket: '',
			messagingSenderId: '123456789',
			appId: '1:123456789:web:abc',
			googleDesktopClientId: '123-example.apps.googleusercontent.com',
			googleDesktopClientSecret: 'GOCSPX-example'
		};
		const inherited = firebaseSettingsFromSaved(
			{ ...environment, googleDesktopClientId: undefined, googleDesktopClientSecret: undefined },
			environment
		);
		expect(inherited.googleDesktopClientId).toBe(environment.googleDesktopClientId);
		expect(inherited.googleDesktopClientSecret).toBe(environment.googleDesktopClientSecret);
		const custom = firebaseSettingsFromSaved(
			{
				...environment,
				projectId: 'custom',
				googleDesktopClientId: undefined,
				googleDesktopClientSecret: undefined
			},
			environment
		);
		expect(custom.googleDesktopClientId).toBe('');
		expect(custom.googleDesktopClientSecret).toBe('');
	});
});
