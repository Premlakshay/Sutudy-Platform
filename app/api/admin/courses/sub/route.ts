import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import subCourses from "@/modals/SubCourse";
import Courses from "@/modals/Courses";
import Title from "@/modals/Titles";
import Content from "@/modals/Content";
import mcqQuestion from "@/modals/Question";
export async function GET(req: NextRequest){
  await connectDB();
  const coureses = await subCourses.find();
  if(!coureses){
    return NextResponse.json({message: "In-valid"})
  }
  return NextResponse.json({coureses});
}
export async function DELETE(req: NextRequest){
  await connectDB();
  const {id} = await req.json();
  await subCourses.deleteOne({_id: id});
  const content = await Title.find({cId: id});
  if(content){
    for(const record of content){
      const record12 = await Content.find({tId: record._id});
      if(record12){
        await Content.deleteOne({tId: record._id});
      }
    }
    await Title.deleteMany({cId: id});
  }
  const isExam = await mcqQuestion.find({id: id, isExam: true});
  if(isExam){
    await mcqQuestion.deleteOne({id:id});
  }
  return NextResponse.json({ message: "Deleted"});
}
export async function PUT(req: NextRequest){
  await connectDB();
  const {_id, email, name, price, cer} = await req.json();
  await subCourses.findByIdAndUpdate(_id, {email, name, price, cer, it: false});
  return NextResponse.json({message: "Updated"});
}
export async function POST(req: NextRequest) {
  await connectDB();
  const {_id, name, email, price, cer}: any = await req.json();
  const chekcCourse = await Courses.findById(_id);
  if(!chekcCourse){
    return NextResponse.json({message: "In-valid"})
  }else{
    const newCourse = new subCourses({cId: _id, name: name, email: email, price: price, cer, it: false});
    await newCourse.save();
    return NextResponse.json({ message: "Course Created" });
  }
};