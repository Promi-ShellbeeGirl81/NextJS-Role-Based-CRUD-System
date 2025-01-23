import mongoose, {Document, Model, Schema} from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    id: { type: String, required: true, unique: true },
    picture: { type: String },
    role: { type: String, default: 'Member', enum: ['Member', 'Admin', 'Trainer'] },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
