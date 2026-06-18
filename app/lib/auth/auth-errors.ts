import type { Translations } from '@/app/lib/i18n/types';

export function getAuthErrorMessage(code: string, messages: Translations['auth']) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return messages.errInvalidCredential;
    case 'auth/email-already-in-use':
      return messages.errEmailInUse;
    case 'auth/weak-password':
      return messages.errWeakPassword;
    case 'auth/too-many-requests':
      return messages.errTooManyRequests;
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return messages.errPopupClosed;
    default:
      return messages.errGeneric;
  }
}

export function getAuthErrorCode(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return 'auth/unknown';
}
