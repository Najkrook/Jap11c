import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAVzJYllXNHuYW_PZT2VbCHaEPTYtWSPuQ',
  authDomain: 'hiraganaskolan.firebaseapp.com',
  projectId: 'hiraganaskolan',
  storageBucket: 'hiraganaskolan.firebasestorage.app',
  messagingSenderId: '915052473209',
  appId: '1:915052473209:web:e376cdb180f3f4262d5da8'
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
