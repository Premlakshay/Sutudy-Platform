import connectDB from "@/connectDb/connectDB";
import Exam from "@/modals/ExamRecord";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest){
    await connectDB();
    const data = await Exam.find();
    return NextResponse.json({data});
}