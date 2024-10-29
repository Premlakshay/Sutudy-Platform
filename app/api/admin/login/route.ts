import { NextResponse, NextRequest } from "next/server";
import connectDB from "../../../../connectDb/connectDB";
import Admin from "../../../../modals/Admin";
export async function GET() {
    return NextResponse.json({ message: "hooray" });
}
export async function POST(req: NextRequest) {
    await connectDB();
    const { id } = await req.json();
    console.log(id);
    const existingAdmins: any = await Admin.find({});
    if (existingAdmins.length > 0) {
        const existingAdmin = await Admin.findOne({ email: id });
        if (!existingAdmin) {
            return NextResponse.json({ message: "Unauthorized Access" });
        } else {
            return NextResponse.json({ message: "Logged-IN:" });
        }
    } else {
        const newAdmin = new Admin({ email: id });
        await newAdmin.save();
        return NextResponse.json({ message: "Refresh Now" });
    }
}
