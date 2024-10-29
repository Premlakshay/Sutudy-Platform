import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Title from "@/modals/Titles";
import Content from "@/modals/Content";
export async function GET(req: NextRequest){
    await connectDB();
    const titles = await Title.find();
    if(!titles){
        return NextResponse.json({message: "No Data found"});
    }else{
        return NextResponse.json({titles});
    }
}
export async function POST(req: NextRequest){
    const {cId, name, paid} = await req.json();
    const newTitle = await new Title({cId: cId, name: name, paid: paid});
    await newTitle.save();
    return NextResponse.json({message: "Created"});
}
export async function PUT(req: NextRequest){
    const {_id, name, paid} = await req.json();
    await Title.findByIdAndUpdate(_id, {name: name, paid: paid});
    return NextResponse.json({message: "Updated"});
}
export async function DELETE(req: NextRequest){
    const {_id} = await req.json();
    await Title.findByIdAndDelete(_id);
    const findContet = await Content.findOne({tId: _id});
    if(findContet){
        await Content.deleteOne({tId: _id});
    }
    return NextResponse.json({message: "Deleted"});
}