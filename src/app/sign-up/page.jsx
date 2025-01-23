"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./page.module.css"

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleProvider = async (provider) => {
    await signIn(provider, {
      callbackUrl: "/",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const user = await res.json();
      if (res.ok) {
        setPending(false);
        alert(user.message);
        router.push("/login");
      } else {
        setPending(false);
        setError(user.message);
      }
    } catch (error) {
      console.error(error);
      setPending(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.card}>
        <h2>Sign-Up</h2>
        <p>Use Email or Social Media to create an account</p>
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Enter your name"
              disabled={pending}
              value={form.name}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Enter your email"
              disabled={pending}
              value={form.email}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Enter your password"
              disabled={pending}
              value={form.password}
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Confirm your password"
              disabled={pending}
              value={form.confirmPassword}
              required
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit" disabled={pending}>
              Continue
            </button>
          </div>
        </form>
        <div className={styles.socialButtons}>
          <button onClick={() => handleProvider("google")}>
            <FcGoogle size={20} style={{ marginRight: "5px" }} /> Google
          </button>
          <button onClick={() => handleProvider("github")}>
            <FaGithub size={20} style={{ marginRight: "5px" }} /> GitHub
          </button>
        </div>
        <div className={styles.footer}>
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
