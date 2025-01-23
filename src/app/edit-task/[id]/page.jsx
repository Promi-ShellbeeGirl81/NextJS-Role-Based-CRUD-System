"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 

export default function EditTaskPage() {
    const { id } = useParams(); 
    const router = useRouter(); 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    // Fetch task data on component mount
    useEffect(() => {
        if (id) {
            const fetchTask = async () => {
                try {
                    const res = await fetch(`/api/task/${id}`);
                    if (!res.ok) {
                        throw new Error('Failed to fetch task');
                    }

                    const task = await res.json();
                    if (task) {
                        setTitle(task.title);
                        setDescription(task.description);
                    } else {
                        setError('Task not found');
                    }
                } catch (error) {
                    setError(error.message || 'Something went wrong');
                    console.error('Error fetching task:', error);
                }
            };

            fetchTask();
        }
    }, [id]); 

    const handleEditbyId = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors before submitting

        // Check for missing fields before sending the request
        if (!title || !description) {
            setError('Title and Description are required');
            return;
        }

        try {
            const res = await fetch(`/api/task/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Task updated successfully!");
                router.push("/");  // Redirect to home page after success
            } else {
                setError(data.message || 'Failed to update task');
            }
        } catch (error) {
            setError(error.message || 'Something went wrong');
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className="p-5 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-5">Edit Task</h2>
            {error && <p className="text-red-500">{error}</p>}  {/* Display error messages */}
            <form onSubmit={handleEditbyId}>
                <div className="mb-2.5">
                    <label className="block mb-1.25">Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full p-2 box-border border border-gray-300" 
                    />
                </div>
                <div className="mb-2.5">
                    <label className="block mb-1.25">Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="w-full p-2 box-border border border-gray-300" 
                    />
                </div>
                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white">
                    Update Task
                </button>
            </form>
        </div>
    );
}
