import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Content from "@/modals/Content";
export async function POST(req: NextRequest){
    await connectDB();
    const {tId, con} = await req.json();
    const existingCon = await Content.findOne({ tId });
    if(existingCon){
        await Content.updateOne({ tId }, { con });
        return NextResponse.json({ message: "Updated" });
    }else{
        const newCon = new Content({ tId, con });
        await newCon.save();
        return NextResponse.json({ message: "Saved" });
    }
}
export async function PUT(req: NextRequest){
    await connectDB();
    const {tId} = await req.json();
    const data = await Content.find({tId});
    return NextResponse.json({content: data});
}