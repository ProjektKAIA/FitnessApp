import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { FIREBASE_CONFIG } from '@/constants/config';

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(FIREBASE_CONFIG);
} else {
  app = getApps()[0];
}

db = getFirestore(app);
storage = getStorage(app);

export { app, db, storage };
