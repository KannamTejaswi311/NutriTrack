import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,      // ← add this
  User,
} from "firebase/auth";
import { auth } from "@/firebase";

type AuthCtx = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  guestLogin: () => Promise<User>;       // 🆕
};

// Create context with default fallback functions
const AuthContext = createContext<AuthCtx>({
  currentUser: null,
  login: async () => {
    throw new Error("AuthContext not initialised");
  },
  signup: async () => {
    throw new Error("AuthContext not initialised");
  },
  logout: async () => {
    throw new Error("AuthContext not initialised");
  },
  guestLogin: async () => {
    throw new Error("AuthContext not initialised");
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // keep user in sync
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setCurrentUser);
    return unsub;
  }, []);

  /* helper actions */
  const login  = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password).then(res => res.user);

  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password).then(res => res.user);

  const logout = () => signOut(auth);

   const guestLogin = () =>
    signInAnonymously(auth).then((res) => res.user); // ✅ This was missing

   const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, user => {
    setCurrentUser(user);
    setLoading(false);
  });
  return unsub;
}, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, guestLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
