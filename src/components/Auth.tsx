"use client";

import { auth, googleProvider } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { FormEvent, useState } from "react";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.email);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in email & password:", error);
    }
  }
  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <div className="flex">
      <h1 className="text-3xl">Login</h1>

      <form onSubmit={handleLogin}>
        <input
          className="border-2 border-gray-300 p-2 rounded-lg"
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border-2 border-gray-300 p-2 rounded-lg"
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="border-2 bg-green-600 text-white p-3 rounded-lg"
          type="submit"
        >
          Login
        </button>
      </form>

      {auth?.currentUser?.email ? (
        <button
          className="border-2 rounded-3xl p-2 bg-red-400 text-amber-50"
          onClick={handleSignOut}
        >
          sign out
        </button>
      ) : (
        <button
          className="border-2 space-x-2 rounded-3xl p-2 bg-blue-400 text-amber-50"
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
export default Auth;
