"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from './page.module.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res.ok) {
      router.push("/");
      alert("Logged in successfully");
    } else if (res.status === 400) {
      setPending(false);
      setError("Invalid credentials");
    } else {
      setError("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Login</h2>
          <p className={styles.cardDescription}>
            Use Email or Social Media to log in to your account
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            disabled={pending}
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Enter your password"
            disabled={pending}
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={pending}
          >
            Continue
          </button>
        </form>

        <div className={styles.socialLogin}>
            <button
              disabled={false}
              onClick={() => handleProvider("google")}
              className={styles.socialButton}
            >
              <FcGoogle size={24} />
            </button>
            <button
              disabled={false}
              onClick={() => handleProvider("github")}
              className={styles.socialButton}
            >
              <FaGithub size={24} />
            </button>
        </div>

        <p className={styles.signupText}>
          Don't have an account? 
          <Link href="/sign-up" className={styles.signupLink}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
