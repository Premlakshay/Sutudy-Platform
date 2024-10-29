import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Courses from "@/modals/Courses";
import subCourses from "@/modals/SubCourse";
import Title from "@/modals/Titles";
import Content from "@/modals/Content";
import mcqQuestion from "@/modals/Question";
export async function GET(req: NextRequest) {
  await connectDB();
  const coureses = await Courses.find({it: true});
  return NextResponse.json({ coureses });
}
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { id } = await req.json();
  await Courses.deleteOne({ _id: id });
  const subCourse = await subCourses.find({ cId: id });
  if (subCourse) {
    for (const record of subCourse) {
      const content = await Title.find({ cId: record._id });
      if (content) {
        for (const record of content) {
          const record12 = await Content.find({ tId: record._id });
          if (record12) {
            await Content.deleteOne({ tId: record._id });
          }
        }
        await Title.deleteMany({ cId: id });
      }
      const isExam = await mcqQuestion.find({ id: id, isExam: true });
      if (isExam) {
        await mcqQuestion.deleteOne({ id: id });
      }
    }
    await subCourses.deleteMany({ cId: id });
  }
  return NextResponse.json({ message: "Deleted" });
}
export async function PUT(req: NextRequest) {
  await connectDB();
  const { _id, img, name } = await req.json();
  await Courses.findByIdAndUpdate(_id, { img, name, it: true });
  return NextResponse.json({ message: "Updated" });
}
export async function POST(req: NextRequest) {
  await connectDB();
  const { imgUrl, cName }: any = await req.json();
  const newCourse = new Courses({ name: cName, img: imgUrl, it: true });
  await newCourse.save();
  return NextResponse.json({ message: "Course Category Created" });
}
