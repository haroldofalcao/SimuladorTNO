import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBe65fTFrWVJtQ1xgjpLeE3H0qaKzapMR8",
    authDomain: "nutripath-9ac89.firebaseapp.com",
    projectId: "nutripath-9ac89",
    storageBucket: "nutripath-9ac89.firebasestorage.app",
    messagingSenderId: "861502942591",
    appId: "1:861502942591:web:6226d6a738e428f9887e4a",
    measurementId: "G-KK0T1BBMMD"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDatabase = getDatabase(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

// Analytics só funciona no cliente
let firebaseAnalytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    try {
        firebaseAnalytics = getAnalytics(firebaseApp);
    } catch (e) {
        console.debug('Analytics initialization failed:', e);
    }
}

export { firebaseApp, firebaseAuth, firebaseDatabase, firebaseStorage, firebaseAnalytics };
export default firebaseApp;
