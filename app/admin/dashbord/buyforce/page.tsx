"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as React from "react";
import { toast } from "sonner";
export default function Home(){
    const [email, setEmail] = React.useState('');
    const [dis, setDis] = React.useState(false);
    const [course, setCourse] = React.useState('');
    const [subCourse, setSubCourse] = React.useState([]);
    const loadSub = async () => {
        const req = await fetch('/api/admin/courses/sub', {
            method: 'GET',
        });
        const data = await req.json();
        setSubCourse(data.coureses);
    }
    const proceed = async() => {
        if(course == "" || email == ""){
            toast("Enter All fields");
        }else{
            setDis(true);
            const req = await fetch('/api/admin/buyforce',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email, course: course}),
            });
            const data = await req.json();
            toast(data.message);
            setDis(false);
        }
    }
    React.useEffect(()=>{
        loadSub();
    },[])
    return (
        <div className="justify-center content-center m-4">
            <Input placeholder="Enter email id of User " className="m-4 max-w-48" onChange={(e)=>{setEmail(e.target.value)}}/>
            <div className="m-4">
            <Select onValueChange={(value)=>{setCourse(value)}}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose a Course "></SelectValue>
                </SelectTrigger>
                <SelectContent>
                {subCourse.map((course: any) =>
                    course.price !== "Free" && (
                        <SelectItem key={course._id} value={course._id}>
                            {course.name}
                        </SelectItem>
                    )
                )}
                </SelectContent>
            </Select>
            </div>
            <Button disabled={dis} className="m-4" onClick={()=>{proceed()}}>Add</Button>
        </div>
    )
}