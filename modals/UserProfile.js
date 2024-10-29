import mongoose from "mongoose";
const ProfileSchema = new mongoose.Schema({
    name: {
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
    address: {
        type: String,
        required: true
    }
});
const Profile = mongoose.models.Profiles || mongoose.model('Profiles', ProfileSchema);
export default Profile;
