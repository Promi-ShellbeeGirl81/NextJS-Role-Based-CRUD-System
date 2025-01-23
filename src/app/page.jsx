"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./page.module.css"; 

const Home = () => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return;

    const fetchTasks = async () => {
      if (!session?.user?.email) {
        setError("No user found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/tasks/show?userEmail=${session.user.email}`
        );
        const data = await response.json();

        if (response.ok) {
          setTasks(Array.isArray(data) ? data : []); // Safeguard against unexpected structure
        } else {
          setError(data?.message || "Failed to fetch tasks");
        }
      } catch (error) {
        setError("An unexpected error occurred.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [session?.user?.email, status]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/task/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className={styles.unauthenticatedContainer}>
        <p className={styles.welcomeText}>Please log in to see your tasks.</p>
        <div className={styles.authButtons}>
          <Link href="/login">
            <button className={styles.loginButton}>Login</button>
          </Link>
          <Link href="/sign-up">
            <button className={styles.signupButton}>Sign Up</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        {session && (
          <div>
            <p>Welcome, {session.user.name}!</p>
            <p>Email: {session.user.email}</p>
              <button onClick={handleSignOut} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
      <main>
        <div className={styles.addTaskContainer}>
          <Link href="/create-task">
            <button className={styles.addTaskButton}>Add Task</button>
          </Link>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading tasks...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className={styles.task}>
              <h2 className={styles.taskTitle}>{task.title}</h2>
              <p className={styles.taskDescription}>{task.description}</p>
              <div className={styles.taskActions}>
                <Link href={`/edit-task/${task._id}`}>
                  <button className={styles.editButton}>Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(task._id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noTasks}>No tasks available</div>
        )}
      </main>
    </div>
  );
};

export default Home;
