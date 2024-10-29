import mongoose from "mongoose";
const BuyCourseSchema = new mongoose.Schema({
    cId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    }
});
const BuyCourse = mongoose.models.BuyCourse || mongoose.model('BuyCourse', BuyCourseSchema);
export default BuyCourse;
