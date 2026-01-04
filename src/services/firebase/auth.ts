import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { auth } from './client';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const result: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen';
    return { success: false, error: message };
  }
};

export const signUp = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registrierung fehlgeschlagen';
    return { success: false, error: message };
  }
};

export const logout = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Abmeldung fehlgeschlagen';
    return { success: false, error: message };
  }
};

export const resetPassword = async (email: string): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Passwort-Reset fehlgeschlagen';
    return { success: false, error: message };
  }
};

export const signInWithGoogle = async (idToken: string): Promise<AuthResult> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return { success: true, user: result.user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Google-Anmeldung fehlgeschlagen';
    return { success: false, error: message };
  }
};

export const signInWithApple = async (
  identityToken: string,
  nonce: string
): Promise<AuthResult> => {
  try {
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce,
    });
    const result = await signInWithCredential(auth, credential);
    return { success: true, user: result.user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Apple-Anmeldung fehlgeschlagen';
    return { success: false, error: message };
  }
};

export const signInWithFacebook = async (accessToken: string): Promise<AuthResult> => {
  try {
    const credential = FacebookAuthProvider.credential(accessToken);
    const result = await signInWithCredential(auth, credential);
    return { success: true, user: result.user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Facebook-Anmeldung fehlgeschlagen';
    return { success: false, error: message };
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
