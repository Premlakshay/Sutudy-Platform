import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Profile from "@/modals/UserProfile";
import BuyCourse from "@/modals/buyCourse";
import { currentUser } from "@clerk/nextjs/server";
import subCourses from "@/modals/SubCourse";
import Exam from "@/modals/ExamRecord";
export async function GET(req: NextRequest) {
  await connectDB();
  const user = await currentUser();
  if (!user?.emailAddresses[0].emailAddress) {
    return NextResponse.json({ message: "Login To Your Account First", flag: false });
  } else {
    const userProfile = await Profile.findOne({ userId: user.emailAddresses[0].emailAddress });
    const purchasedCourses = await BuyCourse.find({ email: user.emailAddresses[0].emailAddress });
    const examResult = await Exam.find({userId: user?.emailAddresses[0].emailAddress});
    const currentDate = new Date();
    const activeCourses = await Promise.all(
      purchasedCourses.map(async (course) => {
        const subCourse = await subCourses.findOne({ _id: course.cId });
        if (subCourse && course.endDate > currentDate) {
          return {
            courseId: course.cId,
            courseName: subCourse.name,
            expiryDate: course.endDate,
          };
        }
        return null;
      })
    );
    const filteredCourses = activeCourses.filter(course => course !== null);
    return NextResponse.json({ Courses: filteredCourses, flag: true, user: userProfile, exam: examResult });
  }
}
export async function POST(req: NextRequest){
  await connectDB();
  const {name, m, f, i, a} = await req.json();
  const user = await currentUser();
  const newUser = new Profile({name, userId: user?.emailAddresses[0].emailAddress, fName: f, mName: m, iName: i, address: a});
  await newUser.save();
  return NextResponse.json({message: "Saved"});
}