import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model('User', UserSchema);