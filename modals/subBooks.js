import mongoose from "mongoose";
const subBookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
    },
    bId: {
        type: String,
        required: true,
    }
});
const subBooks = mongoose.models.subBooks || mongoose.model('subBooks', subBookSchema);
export default subBooks;
