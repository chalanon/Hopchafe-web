// Firebase Configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firestore with settings
const db = firebase.firestore();
const settings = {
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
};
db.settings(settings);

// Initialize Auth
const auth = firebase.auth();

// ฟังก์ชันตรวจสอบสถานะการล็อกอิน
function checkAuthState() {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    }, reject);
  });
}

// ฟังก์ชันตรวจสอบสิทธิ์แอดมิน
async function checkAdminRole(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    return userDoc.exists && userDoc.data().role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

// Export functions
window.fbConfig = {
  db,
  auth,
  checkAuthState,
  checkAdminRole
};
