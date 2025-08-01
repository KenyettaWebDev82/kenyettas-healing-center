npm run dev
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
