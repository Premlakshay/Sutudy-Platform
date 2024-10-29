import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import subBooks from "@/modals/subBooks";
import BooksCategory from "@/modals/BooksCategory"
export async function GET(req: NextRequest){
  await connectDB();
  const coureses = await subBooks.find();
  if(!coureses){
    return NextResponse.json({message: "In-valid"})
  }
  return NextResponse.json({coureses});
}
export async function DELETE(req: NextRequest){
  await connectDB();
  const {id} = await req.json();
  await subBooks.deleteOne({_id: id});
  return NextResponse.json({ message: "Deleted"});
}
export async function PUT(req: NextRequest){
  await connectDB();
  const {_id, info, name, price, img} = await req.json();
  await subBooks.findByIdAndUpdate(_id, {info, name, price, img});
  return NextResponse.json({message: "Updated"});
}
export async function POST(req: NextRequest) {
  await connectDB();
  const {_id, name, info, price, img}: any = await req.json();
  const chekcCourse = await BooksCategory.findById(_id);
  if(!chekcCourse){
    return NextResponse.json({message: "In-valid"})
  }else{
    const newCourse = new subBooks({bId: _id, name: name, info: info, price: price, img: img});
    await newCourse.save();
    return NextResponse.json({ message: "Book Added" });
  }
};