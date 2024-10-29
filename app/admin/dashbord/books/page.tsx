"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {toast} from 'sonner';
import { useRouter } from "next/navigation";
import { ScrollBar } from "@/components/ui/scroll-area";
export default function Home(){
    const [bName, setBName] = React.useState("");
    const router = useRouter();
    const { edgestore } = useEdgeStore();
    const [courses, setCourses]: any = React.useState([]);
    const [dis, setDis] = React.useState(false);
    const handleDelete = async(id: any) => {
        setDis(true);
        const delCourse = await fetch('/api/admin/books', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({id})
        })
        const out: any = await delCourse.json()
        toast(out.message);
        loadCourses();
        setDis(false);
    }
    async function imageUpload(){
        if(bName != "") {
            setDis(true);
            const createCourse = await fetch('/api/admin/books', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({bName}),
            })
            const out: any = await createCourse.json();
            toast.success(out.message);
            loadCourses();
            setDis(false);
        } else {
            toast("Book Category is Required");
        }
    }
    async function loadCourses(){
        const res: any = await fetch('/api/admin/books', {
            method: 'GET',
        });
        const data = await res.json();
        setCourses(data.coureses);
    }
    React.useEffect(()=>{
        loadCourses();
    },[]);
    return(
        <>
            <div className="flex w-full max-w-sm items-center space-x-2 m-3">
                <Input type="text" className="w-56" placeholder="Book Category Name" onChange={(e) => setBName(e.target.value)}/>
                <Button type="submit" onClick={imageUpload} disabled={dis}>Add</Button>
            </div>
            {courses[0] && (
                <div className="flex justify-center items-center m-auto w-auto">
                <Table className="inline-grid justify-center items-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pe-20">Book Category</TableHead>
                    <TableHead className="pl-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <ScrollArea>
                  {courses.map((course: any) => (
                    <TableRow key={course._id} className="m-3">
                      <TableCell className="font-medium pe-20">{course.name}</TableCell>
                      <TableCell className="">
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="m-2" onClick={()=>{
                          setBName('');
                        }}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Editing {course.name}</DialogTitle>
                          <DialogDescription>
                            Make changes to your Book Category Click save when you're done.
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
                              onChange={(e) => setBName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button disabled={dis} onClick={async()=>{
                            if(bName == ""){
                              toast("Book Name is Required");
                            }else{
                              setDis(true)
                            const createCourse = await fetch('/api/admin/books', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({_id: course._id, name: bName}),
                            })
                            const out: any = await createCourse.json();
                            toast.success(out.message);
                            setBName('');
                            loadCourses();
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
                          toast('Redirecting ......'); 
                          router.push(`/admin/dashbord/books/new/${course._id}`)}
                          } variant="default" size="sm" className="m-2">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                 <ScrollBar orientation="vertical"/>
                 </ScrollArea>
                </TableBody>
              </Table>
              </div>
            )}
            {!courses[0] &&(
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
    );
}
