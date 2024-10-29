import mongoose from "mongoose";
const BooksCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});
const BooksCategory = mongoose.models.BooksCategory || mongoose.model('BooksCategory', BooksCategorySchema);
export default BooksCategory;
