import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/connectDb/connectDB";
import Title from "@/modals/Titles";
import mcqQuestion from "@/modals/Question";
export async function POST(req: NextRequest) {
    await connectDB();
    const { cId } = await req.json();
    const titleMap = new Map();
    const getTitles = await Title.find({ cId });
    getTitles.forEach((title) => {
        titleMap.set(title._id.toString(), { ...title.toObject(), mcq: [] });
    });
    for (let title of getTitles) {
        const mcqTest: any = await mcqQuestion.find({ id: title._id, isExam: false });
        if (mcqTest.length > 0) {
            const courseInMap = titleMap.get(title._id.toString());
            if (courseInMap) {
                courseInMap.mcq = mcqTest;  
            }
        }
    }
    const result = Array.from(titleMap.values());
    return NextResponse.json({ result });
}
