"use client";
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {toast} from "sonner";
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SingleImageDropzone } from "@/app/_components/image-upload";
import { useEdgeStore } from '@/lib/edgestore';
import { ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
export default function Home({params}: {
    params: {id: String}
}){
    const cId = params.id;
    const router = useRouter();
    const {edgestore} = useEdgeStore();
    const [bName, setBName] = React.useState('');
    const [img, setImg] = React.useState<File>();
    const [price, setPrice] = React.useState('');
    const [info, setInfo] = React.useState('');
    const [dis, setDis] = React.useState(false);
    const [courses, setCourses]: any = React.useState([]);
    const handleCreate = async() => {
        if(bName == "" || info == "" || price == "" || !img){
            toast("Enter All fiels");
        }else{
            setDis(true);
            const res: any = await edgestore.publicFiles.upload({
                file: img
            });
            toast.success("Logo Uploaded");
            const req = await fetch('/api/admin/books/sub', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id: cId, name: bName, info: info, price: price, img: res.url})
              })
              const data = await req.json()
              if(data.message == "In-valid"){
                toast("Course Cookies Expired Please come again");
                router.push('/admin/dashbord');
              }else{
                toast(`${data.message}`);
                setDis(false);
                setInfo('');
                setBName('');
                setPrice('');
                loadCourses();
              }
        }
    }
    const handleDelete = async(id: any, url: any) => {
        setDis(true);
        await edgestore.publicFiles.delete({url: url});
        const req = await fetch('/api/admin/books/sub', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id})
          })
        const data = await req.json()
        toast(data.message);
        setDis(false);
        loadCourses();
    }
    async function loadCourses(){
        const res: any = await fetch('/api/admin/books/sub', {
            method: 'GET',
        });
        const data = await res.json();
        if(data.message != "In-valid"){
            const filterCorses = data.coureses.filter(course => course.bId == cId);
            setCourses(filterCorses);
        }
    }
    React.useEffect(()=>{
        loadCourses();
    },[])
    return(
        <>
        <div className="flex w-full max-w-sm items-center space-x-2 m-3">
                <Input type="text" className="w-56" placeholder="Book Name" onChange={(e) => setBName(e.target.value)}/>
                <Input type="text" className="w-56" placeholder="Description about Book" onChange={(e) => setInfo(e.target.value)}/>
                <Input type="text" className="w-56" placeholder="Price" onChange={(e) => setPrice(e.target.value)}/>
                {bName &&(
                    <SingleImageDropzone value={img} onChange={setImg}/>
                )}
                <Button type="submit" onClick={()=>{handleCreate()}} disabled={dis}>Add</Button>
        </div>
        {courses[0] && (
                <div className="flex justify-center items-center m-auto w-auto">
                <Table className="inline-grid justify-center items-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pe-20">Thumbnail</TableHead>
                    <TableHead className="pe-20">Name</TableHead>
                    <TableHead className="pe-20">Price</TableHead>
                    <TableHead className="pe-20">Description</TableHead>
                    <TableHead className="pl-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <ScrollArea>
                  {courses.map((course: any) => (
                    <TableRow key={course._id} className="m-3">
                      <TableCell>
                      <img
                          src={course.img}
                          alt={`${course.name} thumbnail`}
                          width={100}
                          height={100}
                          className="rounded-3xl"
                        />
                      </TableCell>
                      <TableCell className="pe-20">{course.name}</TableCell>
                      <TableCell className="pe-20">{course.price}</TableCell>
                      <TableCell className="font-medium pe-20">{course.info}</TableCell>
                      <TableCell>
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="m-2" onClick={()=>{
                          setBName('');
                          setInfo('');
                          setPrice('');
                        }}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Editing {course.name}</DialogTitle>
                          <DialogDescription>
                            Make changes to your Book Click save when you're done.
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
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Price
                            </Label>
                            <Input
                              id="name"
                              defaultValue={course.price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Description
                            </Label>
                            <Input
                              id="name"
                              defaultValue={course.info}
                              onChange={(e) => setInfo(e.target.value)}
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
                            if(!img || bName == "" || price == "" || info == ""){
                              toast("All fields are Required");
                            }else{
                              setDis(true)
                              await edgestore.publicFiles.delete({url: course.img});
                              const res: any = await edgestore.publicFiles.upload({
                                file: img
                            });
                            const createCourse = await fetch('/api/admin/books/sub', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({_id: course._id, name: bName, img: res.url, info: info, price: price}),
                            })
                            const out: any = await createCourse.json();
                            toast.success(out.message);
                            setBName('');
                            setInfo('');
                            setPrice('');
                            loadCourses();
                            setDis(false);
                            }
                          }}>Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                      </Dialog>
                        <Button disabled={dis} variant="destructive" size="sm" onClick={()=>{handleDelete(course._id, course.img)}}>
                          Delete
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
    )
}