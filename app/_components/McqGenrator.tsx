"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { toast } from "sonner";
export function MCQGenrator({params}: {params: {id: String}}){
    type Question = {
        question: string;
        option1: string;
        option2: string;
        option3: string;
        option4: string;
        correct: string;
        explanation: string;
    };
    const tId = params.id;
    const [que, setQue] = React.useState<Question []>([]);
    const [dis, setDis] = React.useState(false);
    const loadQuestion = async() => {
        const req = await fetch('/api/subAdmin/mcq', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: tId}),
        });
        const data = await req.json()
        if(data.isPrevious){
            setQue(data.isPrevious.questions);
        }
    }
    const addQue = () => {
        setQue((prev) => [...prev, {question: "", option1: "", option2: "", option3: "", option4: "", correct: "", explanation: ""}]);
    }
    const save = async() => {
        if(que.length <= 0){
            toast("Please try to add question");
        }else{
            setDis(true);
            const req = await fetch('/api/subAdmin/mcq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: tId, questions: que}),
            });
            const data = await req.json();
            toast(data.message);
            loadQuestion();
            setDis(false);
        }
    }
    const handleInput = (index: number, field: string, value: String) => {
        const updatedQue = [...que];
        updatedQue[index] = {
            ...updatedQue[index],
            [field]: value
        }; 
        setQue(updatedQue); 
    }
    React.useEffect(()=>{
        loadQuestion();
    },[]);
    return(
        <div className="grid col-span-1 m-4 mx-auto w-3/4">
        {que.length > 0 && (
            <>
            {que.map((q, index) => (
                <div key={index} className="mb-4 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-2">{index + 1}</h3>
                    <Label className="m-3">Enter Question</Label>
                    <Input value={q.question} onChange={(e)=>{handleInput(index, "question", e.target.value)}} className="p-2 w-3/4 rounded-md " type="text"/>
                    <Label className="m-3">Option 1</Label>
                    <div className="flex w-full">
                    <Input value={q.option1} onChange={(e)=>{handleInput(index, "option1", e.target.value)}} className="p-2 w-3/4 rounded-md " type="text"/>
                    <Input className="1/4" type="radio" checked={q.correct === q.option1 ? true : false} name={`question${index}`} onChange={()=>{handleInput(index, "correct", q.option1)}}/>
                    </div>
                    <Label className="m-3">Option 2</Label>
                    <div className="flex w-full">
                    <Input value={q.option2} onChange={(e)=>{handleInput(index, "option2", e.target.value)}} className="p-2 w-3/4 rounded-md " type="text"/>
                    <Input className="1/4" type="radio" checked={q.correct === q.option2 ? true : false} name={`question${index}`} onChange={()=>{handleInput(index, "correct", q.option2)}}/>
                    </div>
                    <Label className="m-3">Option 3</Label>
                    <div className="flex w-full">
                    <Input value={q.option3} onChange={(e)=>{handleInput(index, "option3", e.target.value)}} className="p-2 w-3/4 rounded-md " type="text"/>
                    <Input className="1/4" type="radio" checked={q.correct === q.option3 ? true : false} name={`question${index}`} onChange={()=>{handleInput(index, "correct", q.option3)}}/>
                    </div>
                    <Label className="m-3">Option 4</Label>
                    <div className="flex w-full">
                    <Input value={q.option4} onChange={(e)=>{handleInput(index, "option4", e.target.value)}} className="p-2 w-3/4 rounded-md " type="text"/>
                    <Input className="1/4" type="radio" checked={q.correct === q.option4 ? true : false} name={`question${index}`} onChange={()=>{handleInput(index, "correct", q.option4)}}/>
                    </div>
                    <Label className="m-3">Explanation</Label>
                    <Input value={q.explanation} onChange={(e)=>{handleInput(index, "explanation", e.target.value)}} className="p-3 w-2/4 rounded-md " type="text"/>
                </div>
            ))}
            </>
        )}
        <Button className="mt-3" onClick={()=>{addQue()}}>Add Question</Button>
        {que.length > 0 && (
            <Button disabled={dis} className="mt-3" onClick={async()=>{
            setDis(true);
            const req = await fetch('/api/subAdmin/mcq', {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: tId}),
            });
            const data = await req.json();
            toast(data.message);
            if(data.message == "Deleted"){
                loadQuestion();
                setQue([]);
            }
            setDis(false);
        }}>Delete</Button>
        )}
        <Button disabled={dis} className="mt-3" onClick={()=>{save()}}>Save</Button>
        </div>
    )
}