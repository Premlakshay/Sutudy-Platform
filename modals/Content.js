import mongoose from "mongoose";
const ContentSchema = new mongoose.Schema({
    tId: {
        type: String,
        required: true,
    },
    con: {
        type: String,
        required: true,
    },
});
const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
export default Content;
