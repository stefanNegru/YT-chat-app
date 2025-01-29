import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }
}, { _id: false })

const historySchema = new mongoose.Schema({
    role: {
        type: String,
    },
    parts: {
        type: [partSchema],
        default: [],
    }
}, { versionKey: false })

const HistorySchema = mongoose.model('History', historySchema)
export default HistorySchema