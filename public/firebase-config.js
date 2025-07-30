// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlNofFy2Q0xZNrQRGdTT-7Tf3ELoL4gZg",
  authDomain: "hopchafe-184ad.firebaseapp.com",
  projectId: "hopchafe-184ad",
  storageBucket: "hopchafe-184ad.appspot.com",
  messagingSenderId: "314546539339",
  appId: "1:314546539339:web:22b31673662662f27236ce"
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
