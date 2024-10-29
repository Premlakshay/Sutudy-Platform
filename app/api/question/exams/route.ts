import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import mcqQuestion from "@/modals/Question";
export async function POST(req: NextRequest){
    await connectDB();
    const {questions, id, passMarks} = await req.json();
    const isPrevious = await mcqQuestion.findOne({id: id, isExam: true});
    if(isPrevious){
        isPrevious.questions = questions;
        isPrevious.passMarks = passMarks;
        await isPrevious.save();
        return NextResponse.json({message: "Updated"});
    }else{
        const newTest = new mcqQuestion({id:id, questions: questions, isExam: true, passMarks: passMarks});
        await newTest.save();
        return NextResponse.json({message: "Saved"});
    }
}
export async function PUT(req: NextRequest){
    await connectDB();
    const {id} = await req.json();
    const isPrevious = await mcqQuestion.findOne({id: id, isExam: true});
    if(isPrevious){
        return NextResponse.json({isPrevious});
    }else{
        return NextResponse.json({message: "No Exam Found"});
    }
}
export async function DELETE(req: NextRequest){
    await connectDB();
    const {id} = await req.json();
    const isTest = await mcqQuestion.find({id: id, isExam: true});
    if(isTest){
        await mcqQuestion.deleteOne({id:id, isExam: true});
        return NextResponse.json({message: "Deleted"});
    }else{
        return NextResponse.json({message: "No Exam Found"});
    }
}