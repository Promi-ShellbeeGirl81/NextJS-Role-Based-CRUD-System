import mongoose, { Document, Model, Schema } from 'mongoose';

const taskSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
