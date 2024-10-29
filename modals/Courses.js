import mongoose from "mongoose";
const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    it: {
        type: Boolean,
        required: true,
    }
});
const Courses = mongoose.models.Courses || mongoose.model('Courses', CourseSchema);
export default Courses;
