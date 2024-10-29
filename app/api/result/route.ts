import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Exam from "@/modals/ExamRecord";
import { currentUser } from "@clerk/nextjs/server";
import Profile from "@/modals/UserProfile";
import BuyCourse from "@/modals/buyCourse";
import subCourses from "@/modals/SubCourse";
export async function POST(req: NextRequest) {
  await connectDB();
  const user = await currentUser();
  const { cId, tMarks, oMarks } = await req.json();
  const date = new Date();
  if (!user?.emailAddresses[0].emailAddress) {
    return NextResponse.json({ message: "You Need To Login To Process Further" });
  } else {
    const isExam = await Exam.findOne({ userId: user?.emailAddresses[0].emailAddress, cId: cId });
    if (isExam) {
      return NextResponse.json({ message: "Already Genrated Certificate", flag: 1 });
    } else {
      const getCourse = await subCourses.findOne({ _id: cId });
      if (getCourse) {
        if (getCourse.price == "Free") {
          const getProfile = await Profile.findOne({ userId: user?.emailAddresses[0].emailAddress });
          if (!getProfile) {
            return NextResponse.json({ message: "Complete Your Onboarding & Information Details First Then Try Again", flag: 1 });
          } else {
            const saveRecord = new Exam({ name: getProfile.name, userId: user?.emailAddresses[0].emailAddress, TotalMarks: tMarks, ObtainedMarks: oMarks, ExamName: getCourse.name, fName: getProfile.fName, mName: getProfile.mName, iName: getProfile.iName, date: date, cId: cId });
            await saveRecord.save();
            return NextResponse.json({ message: "Congratulations, Get Your Certificate From Dashboard", flag: 1 });
          }
        } else {
          const course12 = await BuyCourse.findOne({ cId: cId, email: user?.emailAddresses[0].emailAddress });
          if (course12) {
            if (date > course12.endDate) {
              await BuyCourse.deleteOne({ cId: cId, email: user?.emailAddresses[0].emailAddress });
              return NextResponse.json({ message: "Course Is Expired. Please Repurchase Then Try Again", flag: 0 });
            } else {
              const getProfile = await Profile.findOne({ userId: user?.emailAddresses[0].emailAddress });
              if(getProfile){
                const saveRecord = new Exam({ name: getProfile.name, userId: user?.emailAddresses[0].emailAddress, TotalMarks: tMarks, ObtainedMarks: oMarks, ExamName: getCourse.name, fName: getProfile.fName, mName: getProfile.mName, iName: getProfile.iName, date: date, cId: cId });
                await saveRecord.save();
                return NextResponse.json({ message: "Congratulations, Get Your Certificate From Dashboard", flag: 1 });
              }else{
                return NextResponse.json({ message: "Complete Your Onboarding & Information Details First Then Try Again", flag: 1 });
              }
            }
          } else {
            return NextResponse.json({ message: "Buy The Course First", flag: 0 });
          }
        }
      } else {
        return NextResponse.json({ message: "Something Went Wrong Try Again", flag: 0 });
      }
    }
  }
}
