import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDUptUHmo_lkUTpRSt4UqxktFUJhd-AuLs",
    authDomain: "swagod-38781.firebaseapp.com",
    projectId: "swagod-38781",
    storageBucket: "swagod-38781.firebasestorage.app",
    messagingSenderId: "792126071150",
    appId: "1:792126071150:web:2547451ce61265c417217f",
    measurementId: "G-940DWJYEY2"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { analytics };
export default app;
