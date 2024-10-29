"use client";
import * as React from 'react';
import { useDashboard } from '@/app/_components/AdminContext';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {toast} from "sonner";
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
export default function Home({params}: {
    params: {id: String}
}){
    const cId = params.id;
    const router = useRouter();
    const {setSub, sub} = useDashboard();
    const [cName, setCname] = React.useState('');
    const [cer, setCer] = React.useState(false);
    const [price, setPrice] = React.useState('Free');
    const [admin, setAdmin] = React.useState('');
    const [dis, setDis] = React.useState(false);
    const [courses, setCourses]: any = React.useState([]);
    const handleCreate = async() => {
        if(cName == "" || admin == "" || price == ""){
            toast("Enter Course name and Admin email id");
        }else{
            setDis(true);
            const req = await fetch('/api/admin/courses/sub', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id: cId, name: cName, email: admin, price: price, cer: cer})
              })
              const data = await req.json()
              if(data.message == "In-valid"){
                toast("Course Cookies Expired Please come again");
                router.push('/admin/dashbord');
              }else{
                toast(`${data.message}`);
                setDis(false);
                loadCourses();
              }
        }
    }
    const handleDelete = async(id: any) => {
        setDis(true);
        const req = await fetch('/api/admin/courses/sub', {
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
        const res: any = await fetch('/api/admin/courses/sub', {
            method: 'GET',
        });
        const data = await res.json();
        if(data.message != "In-valid"){
            const filterCorses = data.coureses.filter(course => course.cId == cId);
            setCourses(filterCorses);
        }
    }
    React.useEffect(()=>{
        loadCourses();
    },[])
    return(
        <>
        <div className="w-full max-w-sm items-center space-x-2 m-3">
                <Input type="text" className="w-40 m-4" placeholder="Sub Course Name" onChange={(e) => setCname(e.target.value)}/>
                <Input type="email" className="w-40 m-4" placeholder="Admin email id for this course" onChange={(e) => setAdmin(e.target.value)}/>
                <Input type="text" className="w-40 m-4" placeholder="Price" onChange={(e) => setPrice(e.target.value)} defaultValue={price}/>
                <Label className='block m-4'>Certificate ?</Label>
                <Switch className='block m-4' defaultChecked={cer} onCheckedChange={(checked) => setCer(checked)}/>
                <Button type="submit" onClick={()=>{handleCreate()}} disabled={dis}>Add</Button>
        </div>
        {courses[0] && (
                <div className="flex justify-center items-center m-auto w-auto">
                <Table className="inline-grid justify-center items-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pe-20">Course Name</TableHead>
                    <TableHead className="pe-20">Course Price</TableHead>
                    <TableHead className="pe-20">Admin ID:</TableHead>
                    <TableHead className="pe-20">Certificate</TableHead>
                    <TableHead className="pl-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <ScrollArea>
                  {courses.map((course: any) => (
                    <TableRow key={course._id} className="m-3">
                      <TableCell className="pe-20">{course.name}</TableCell>
                      <TableCell className="pe-20">{course.price}</TableCell>
                      <TableCell className="font-medium pe-20">{course.email}</TableCell>
                      <TableCell className="font-medium pe-20">{course.cer ? ('Yes'): ('No')}</TableCell>
                      <TableCell className="">
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="m-2" onClick={()=>{
                          setCname('');
                          setAdmin('');
                          setPrice('');
                          setCer(course.cer);
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
                              onChange={(e) => setCname(e.target.value)}
                              className="col-span-3"
                            />
                            <Label>Certificate ?</Label>
                            <Switch defaultChecked={cer} onCheckedChange={(checked) => setCer(checked)}/>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Admin ID:
                            </Label>
                            <Input
                              id="name"
                              defaultValue={course.email}
                              onChange={(e) => setAdmin(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
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
                        <DialogFooter>
                          <Button disabled={dis} onClick={async()=>{
                            if(admin == "" || cName == ""){
                              toast("Both Course Name And Admin ID Is Required")
                            }else{
                              setDis(true)
                            const createCourse = await fetch('/api/admin/courses/sub', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({_id: course._id, name: cName, email: admin, price: price, cer}),
                            })
                            const out: any = await createCourse.json();
                            toast(out.message);
                            setCname('');
                            setAdmin('');
                            setPrice('');
                            setCer(false);
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
                          setSub(course._id);
                          if(sub != ""){
                          router.push('/subAdmin/console');
                          toast("Rediceting .....");
                          }
                          }
                          } variant="default" size="sm" className="m-2">
                          Manage
                        </Button>
                        {course.cer && (
                          <Button variant="ghost" size="sm" onClick={()=>{toast("Redirecting...."); router.push(`/admin/dashbord/exams/${course._id}`)}}>
                          Test Series
                        </Button>
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