import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import subCourses from "@/modals/SubCourse";
export async function POST(req: NextRequest){
    await connectDB();
    const {id} = await req.json();
    const getCourse = await subCourses.findOne({email: id});
    if(!getCourse){
        return NextResponse.json({message: "You Are Not An Admin"});
    }else{
        return NextResponse.json({message: "Logged-IN:", cId: getCourse._id, it: getCourse.it});
    }
}