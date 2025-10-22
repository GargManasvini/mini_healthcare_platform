import mongoose from "mongoose";

const healthSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sleep: {
        type: Number,
        required: true,
    },
    appetite: {
        type: Number,
        required: true
    },
    stress: {
        type: Number,
        required: true
    },
    activity: {
        type: Number,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    recommendation: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const Health = mongoose.model('Health', healthSchema)