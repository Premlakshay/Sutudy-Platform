import mongoose from "mongoose";
const mcqQuestionchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
    },
    isExam: {
        type: Boolean,
        required: true
    }, 
    questions: [
        {
            question: {type: String, required: true},
            option1: {type: String, required: true},
            option2: {type: String, required: true},
            option3: {type: String, required: true},
            option4: {type: String, required: true},
            correct: {type: String, required: true},
            explanation: {type: String, required: true},
        }
    ],
    passMarks: {
        type: String,
        required: false,
    } 
});
const mcqQuestion = mongoose.models.mcqQuestion || mongoose.model('mcqQuestion', mcqQuestionchema);
export default mcqQuestion;
