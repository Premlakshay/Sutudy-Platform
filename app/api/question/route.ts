import connectDB from "@/connectDb/connectDB";
import mcqQuestion from "@/modals/Question";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest){
    await connectDB();
    const {cId} = await req.json();
    const isExam = await mcqQuestion.find({id: cId, isExam: true});
    if(isExam){
        return NextResponse.json({questions: isExam});
    }else{
        return NextResponse.json({message: "Not Found"});
    }
}