import mongoose from "mongoose";
const subCourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cId: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
    },
    cer: {
        type: Boolean,
        required: true,
    },
    it: {
        type: Boolean,
        required: true,
    }
});
const subCourses = mongoose.models.subCourses || mongoose.model('subCourses', subCourseSchema);
export default subCourses;
