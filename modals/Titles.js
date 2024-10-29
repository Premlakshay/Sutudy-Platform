import mongoose from "mongoose";
const TitleSchema = new mongoose.Schema({
    cId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    paid: {
        type: Boolean,
        required: true
    },
});
const Title = mongoose.models.Title || mongoose.model('Title', TitleSchema);
export default Title;
