import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import mcqQuestion from "@/modals/Question";
export async function POST(req: NextRequest){
    await connectDB();
    const {questions, id} = await req.json();
    const isPrevious = await mcqQuestion.findOne({id: id, isExam: false});
    if(isPrevious){
        isPrevious.questions = questions;
        await isPrevious.save();
        return NextResponse.json({message: "Updated"});
    }else{
        const newTest = new mcqQuestion({id:id, questions: questions, isExam: false});
        await newTest.save();
        return NextResponse.json({message: "Saved"});
    }
}
export async function PUT(req: NextRequest){
    await connectDB();
    const {id} = await req.json();
    const isPrevious = await mcqQuestion.findOne({id: id, isExam: false});
    if(isPrevious){
        return NextResponse.json({isPrevious});
    }else{
        return NextResponse.json({message: "No Exam Found"});
    }
}
export async function DELETE(req: NextRequest){
    await connectDB();
    const {id} = await req.json();
    const isTest = await mcqQuestion.find({id: id, isExam: false});
    if(isTest){
        await mcqQuestion.deleteOne({id:id, isExam: false});
        return NextResponse.json({message: "Deleted"});
    }else{
        return NextResponse.json({message: "No Exam Found"});
    }
}