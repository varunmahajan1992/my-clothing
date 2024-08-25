import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnK563EsMCyzo_d4c41XSq0qPRkNHAoms",
  authDomain: "my-clothing-db-6fb23.firebaseapp.com",
  projectId: "my-clothing-db-6fb23",
  storageBucket: "my-clothing-db-6fb23.appspot.com",
  messagingSenderId: "345223839857",
  appId: "1:345223839857:web:aa3a0cf254ea758ac85bd0",
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocref = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocref);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocref, {
        displayName,
        email,
        createdAt,
      });
    } catch (err) {
      console.log("Error creating user", err.message);
    }
  }
};
