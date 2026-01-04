export { app, auth, db, storage } from './client';
export {
  signIn,
  signUp,
  logout,
  resetPassword,
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  subscribeToAuthChanges,
  getCurrentUser,
} from './auth';
export type { AuthResult } from './auth';
