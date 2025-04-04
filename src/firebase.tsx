import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxgZrPpUB6lWwoWX165FoTtkBKeRWHz3w",
  authDomain: "nwitter-reloaded-b3ccc.firebaseapp.com",
  projectId: "nwitter-reloaded-b3ccc",
  storageBucket: "nwitter-reloaded-b3ccc.firebasestorage.app",
  messagingSenderId: "478359346840",
  appId: "1:478359346840:web:2eb32b9537527f20d27aed",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
