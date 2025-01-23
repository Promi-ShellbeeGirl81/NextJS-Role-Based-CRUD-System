"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddTask = () => {
  const router = useRouter();
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    completed: false, // Optional task status
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/tasks/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      alert('Task added successfully!');
      setTaskData({ title: '', description: '', completed: false });
      router.push("/");
    } else {
      alert('Failed to add task');
    }
  };

  return (
    <div className="add-task-container">
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <label htmlFor="title" className="form-label">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={taskData.title}
          onChange={handleInputChange}
          className="input-field"
          required
        />
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={taskData.description}
          onChange={handleInputChange}
          className="textarea-field"
          required
        />
        <button type="submit" className="submit-button">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
