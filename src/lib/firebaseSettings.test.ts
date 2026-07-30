import { describe, expect, it } from 'vitest';
import {
	emptyFirebaseSettings,
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
			appId: '1:123456789:web:abc'
		};
		expect(isFirebaseConfigured(configured)).toBe(true);
		expect(isFirebaseConfigured({ ...configured, projectId: '' })).toBe(false);
	});
});
