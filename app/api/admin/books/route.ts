import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import BooksCategory from "@/modals/BooksCategory";
import subBooks from "@/modals/subBooks";
export async function GET(req: NextRequest){
  await connectDB();
  const coureses = await BooksCategory.find({});
  return NextResponse.json({coureses});
}
export async function DELETE(req: NextRequest){
  await connectDB();
  const {id} = await req.json();
  await BooksCategory.deleteOne({_id: id});
  const subBooksTem = await subBooks.find({bId: id});
  if(subBooksTem){
    await subBooks.deleteMany({bId: id});
  }
  return NextResponse.json({ message: "Deleted"});
}
export async function PUT(req: NextRequest){
  await connectDB();
  const {_id, name} = await req.json();
  await BooksCategory.findByIdAndUpdate(_id, {name});
  return NextResponse.json({message: "Updated"});
}
export async function POST(req: NextRequest) {
  await connectDB();
  const {bName}: any = await req.json();
      const newCourse = new BooksCategory({name: bName});
      await newCourse.save();
      return NextResponse.json({ message: "Course Created" });
};