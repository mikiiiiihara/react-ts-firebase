import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

const firebase = initializeApp(firebaseConfig);
export default firebase;
export const db = getFirestore(firebase);
