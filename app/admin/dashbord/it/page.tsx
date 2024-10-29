"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SingleImageDropzone } from "@/app/_components/image-upload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {toast} from 'sonner';
import { useRouter } from "next/navigation";
import { ScrollBar } from "@/components/ui/scroll-area";
export default function Home(){
    const [cName, setCName] = React.useState("");
    const [img, setImg] = React.useState<File>();
    const router = useRouter();
    const { edgestore } = useEdgeStore();
    const [courses, setCourses]: any = React.useState([]);
    const [dis, setDis] = React.useState(false);
    const handleDelete = async(img: any, id: any) => {
        setDis(true);
        await edgestore.publicFiles.delete({url: img,});
        toast("Logo Deleted");
        const delCourse = await fetch('/api/admin/it', {
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
        if(img && cName){
            setDis(true);
            const res: any = await edgestore.publicFiles.upload({
                file: img
            });
            toast.success("Logo Uploaded");
            const createCourse = await fetch('/api/admin/it', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({imgUrl: res.url, cName}),
            })
            const out: any = await createCourse.json();
            toast.success(out.message);
            loadCourses();
            setDis(false);
        } else {
            toast("Course Name And Logo is Required");
        }
    }
    async function loadCourses(){
        const res: any = await fetch('/api/admin/it', {
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
                <Input type="text" className="w-56" placeholder="New Course Name" onChange={(e) => setCName(e.target.value)}/>
                {cName && (
                    <SingleImageDropzone value={img} onChange={setImg}/>
                )}
                <Button type="submit" onClick={imageUpload} disabled={dis}>Add</Button>
            </div>
            {courses[0] && (
                <div className="flex justify-center items-center m-auto w-auto">
                <Table className="inline-grid justify-center items-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pe-20">Thumbnail</TableHead>
                    <TableHead className="pe-20">Course Name</TableHead>
                    <TableHead>Is I & T ?</TableHead>
                    <TableHead className="pl-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <ScrollArea>
                  {courses.map((course: any) => (
                    <TableRow key={course._id} className="m-3">
                      <TableCell className="pe-20">
                        <img
                          src={course.img}
                          alt={`${course.name} thumbnail`}
                          width={100}
                          height={100}
                          className="rounded-3xl"
                        />
                      </TableCell>
                      <TableCell className="font-medium pe-20">{course.name}</TableCell>
                      <TableCell>{course.it == true ? 'Yes': 'No'}</TableCell>
                      <TableCell className="">
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="m-2" onClick={()=>{
                          setCName('');
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
                              onChange={(e) => setCName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Logo
                            </Label>
                            <SingleImageDropzone value={img} onChange={setImg}/>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button disabled={dis} onClick={async()=>{
                            if(!img && cName == ""){
                              toast("Both Course Name And Logo Is Required")
                            }else{
                              setDis(true)
                              await edgestore.publicFiles.delete({url: course.img});
                              const res: any = await edgestore.publicFiles.upload({
                                file: img
                            });
                            const createCourse = await fetch('/api/admin/it', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({_id: course._id, name: cName, img: res.url}),
                            })
                            const out: any = await createCourse.json();
                            toast.success(out.message);
                            setCName('');
                            loadCourses();
                            setDis(false);
                            }
                          }}>Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                      </Dialog>
                        <Button disabled={dis} variant="destructive" size="sm" onClick={()=>{handleDelete(course.img, course._id)}}>
                          Delete
                        </Button>
                        <Button onClick={()=>{
                          toast('Redirecting ......'); 
                          router.push(`/admin/dashbord/it/${course._id}`)}
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
