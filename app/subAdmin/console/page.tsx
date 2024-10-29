"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/app/_components/AdminContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";
export default function Home(){
    const {sub, setTit, tit, it} = useDashboard();
    const [title, setTitle] = React.useState('');
    const [paid, setPaid] = React.useState(false);
    const router = useRouter();
    const [dis, setDis] = React.useState(false);
    const [titles, setTitles]: any = React.useState([]);
    const handleDelete = async(id: any) => {
        setDis(true);
        const req = await fetch('/api/subAdmin/titles', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({_id: id})
        })
        const res = await req.json();
        if(res.message){
            loadTitles()
            toast(res.message);
            setDis(false);
        }
    }
    const handleCreate = async() => {
        if(title == ""){
            toast("Enter a Title");
        }else{
            setDis(true);
            const req = await fetch('/api/subAdmin/titles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({cId: sub, name: title, paid})
            })
            const res = await req.json();
            if(res.message == "Created"){
                loadTitles()
                toast("Title Created");
                setDis(false);
            }
        }
    }
    const loadTitles = async() => {
        const response = await fetch('/api/subAdmin/titles', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const res = await response.json();
        console.log(res)
        if(res.titles){
            const filterTitles = res.titles.filter(title => title.cId == sub);
            setTitles(filterTitles);
        }else{
            toast("No Titles Found");
        }
    }
    React.useEffect(()=>{
        loadTitles();
    },[]);
    return(
        <>
        <div className="flex w-full max-w-sm items-center space-x-2 m-3">
            <Input type="text" className="w-56" placeholder="Title for course" onChange={(e) => setTitle(e.target.value)}/>
            <Label>Paid?</Label>
            <Switch defaultChecked={paid} onCheckedChange={(checked) => setPaid(checked)}/>
            <Button type="submit" onClick={()=>{handleCreate()}} disabled={dis}>Add</Button>
        </div>
        {titles[0] && (
                <div className="flex justify-center items-center m-auto w-auto">
                <Table className="inline-grid justify-center items-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pe-24">Title Name</TableHead>
                    <TableHead className="pe-20">Is-Paid?</TableHead>
                    <TableHead className="pl-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <ScrollArea>
                  {titles.map((course: any) => (
                    <TableRow key={course._id} className="m-3">
                      <TableCell className="pe-20">{course.name}</TableCell>
                      <TableCell className="pl-28">{course.paid ? "Yes": "No"}</TableCell>
                      <TableCell className="pl-28">
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="m-2" onClick={()=>{
                          setTitle('');
                          setPaid(course.paid)
                        }}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Editing {course.name}</DialogTitle>
                          <DialogDescription>
                            Make changes to your Course Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              defaultValue={course.name}
                              onChange={(e) => setTitle(e.target.value)}
                              className="col-span-3"
                            />
                            <Label>Paid?</Label>
                            <Switch defaultChecked={paid} onCheckedChange={(checked) => setPaid(checked)}/>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button disabled={dis} onClick={async()=>{
                            if(title == ""){
                              toast("Title Name is Required");
                            }else{
                            setDis(true)
                            const createCourse = await fetch('/api/subAdmin/titles', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({_id: course._id, name: title, paid}),
                            })
                            const out: any = await createCourse.json();
                            toast.success(out.message);
                            setTitle('');
                            loadTitles();
                            setPaid(false);
                            setDis(false);
                            }
                          }}>Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                      </Dialog>
                        <Button disabled={dis} variant="destructive" size="sm" onClick={()=>{handleDelete(course._id)}}>
                          Delete
                        </Button>
                        <Button onClick={()=>{
                          setTit(course._id);
                          if(tit != ""){
                          router.push('/subAdmin/console/alter');
                          toast("Rediceting .....");
                          }
                          }
                          } variant="default" size="sm" className="m-2">
                          Manage
                        </Button>
                        {it && (
                          <>
                          <Button onClick={()=>{
                           setTit(course._id);
                           if(tit != ""){
                           router.push('/subAdmin/console/alter');
                           toast("Rediceting .....");
                           }
                          }} variant={"ghost"}>MCQ</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                 <ScrollBar orientation="vertical"/>
                 </ScrollArea>
                </TableBody>
              </Table>
              </div>
        )}
        {!titles[0] &&(
                <div className="grid place-items-center mx-auto mt-10">
                <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
                </div>          
                </div>
            )}
        </>
    )
}