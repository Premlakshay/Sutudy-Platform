import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/connectDb/connectDB";
import Content from "@/modals/Content";
export async function POST(req: NextRequest){
    await connectDB();
    const {tId} = await req.json();
    const getTitles = await Content.find({tId});
    return NextResponse.json({content: getTitles});
}