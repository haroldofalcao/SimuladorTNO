
// ESM module using the installed Firebase SDK (modular)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: "AIzaSyBe65fTFrWVJtQ1xgjpLeE3H0qaKzapMR8",
	authDomain: "nutripath-9ac89.firebaseapp.com",
	projectId: "nutripath-9ac89",
	storageBucket: "nutripath-9ac89.firebasestorage.app",
	messagingSenderId: "861502942591",
	appId: "1:861502942591:web:5b6640368f8ed793887e4a",
	measurementId: "G-0XLD34WSDQ"
};

// Initialize app and services (idempotent if used with bundlers/hot-reload)
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDatabase = getDatabase(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
let firebaseAnalytics = null;
try {
	firebaseAnalytics = getAnalytics(firebaseApp);
} catch (e) {
	// Analytics may fail in non-browser environments; that's fine.
}

// Export named bindings for use by other modules
export { firebaseApp, firebaseAuth, firebaseDatabase, firebaseStorage, firebaseAnalytics };

// Default export for convenience
export default firebaseApp;

