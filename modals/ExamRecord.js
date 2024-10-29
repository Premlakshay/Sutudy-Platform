import mongoose from "mongoose";
const ExamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    TotalMarks: {
        type: String,
        required: true,
    },
    ObtainedMarks: {
        type: String,
        required: true,
    },
    ExamName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    fName: {
        type: String,
        required: true,
    },
    mName: {
        type: String,
        required: true,
    },
    iName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    }, 
    cId: {
        type: String,
        required: true,
    }
});
const Exam = mongoose.models.Exams || mongoose.model('Exams', ExamSchema);
export default Exam;
