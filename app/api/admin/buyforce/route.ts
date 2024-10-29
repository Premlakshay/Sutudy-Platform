import { NextRequest, NextResponse } from "next/server";
import BuyCourse from "@/modals/buyCourse";
export async function POST(req: NextRequest){
    const {email, course} = await req.json();
    const date = new Date();
    await BuyCourse.deleteMany({
        endDate: {$lt: date}
    });
    const IsCourse = await BuyCourse.findOne({email: email, cId: course});
    if(IsCourse){
        return NextResponse.json({message: "Already Purchsed"});
    }else{
        const currentDate = new Date();
        const date = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
        const addNew = new BuyCourse({email: email, cId: course, endDate: date});
        await addNew.save();
        return NextResponse.json({message: "Done"});
    }
}