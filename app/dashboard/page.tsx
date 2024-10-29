"use client";
import * as React from "react";
import NavBar from "../_components/NavBar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, BellRing } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
export default function Home() {
  const router = useRouter();
  const [data, setData]: any = React.useState();
  const [name, setName] = React.useState("");
  const [f, setF] = React.useState("");
  const [dis, setDis] = React.useState(false);
  const [m, setM] = React.useState("");
  const [i, setI] = React.useState("");
  const [a, setA] = React.useState("");
  const loadData = async () => {
    const request = await fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    toast(data.message);
    if (!data.flag) {
      router.push("/");
    } else {
      setData(data);
    }
  };
  const saveUser = async () => {
    if (name == "" || f == "" || m == "" || i == "" || a == "") {
      toast("All Fields Are Required");
    } else {
      setDis(true);
      const req = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, f, m, i, a }),
      });
      const data = await req.json();
      toast(data.message);
      loadData();
      setDis(false);
    }
  };
  React.useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <NavBar />
      {data ? (
        <div className="grid justify-center content-center items-center mx-auto w-full h-full mt-4">
          <div className="flex justify-center items-center mx-auto w-full h-full mt-4">
            {!data.user ? (
              <>
                <div className="m-3 text-center">
                  Please Fill Up The Required Information By Clicking On The Button{" "}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"outline"}>Complete OnBoarding</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] mx-auto">
                    <DialogHeader>
                      <DialogTitle>Let Us Know You</DialogTitle>
                      <DialogDescription className="text-red-400">
                        This Information Is Not Editable In Future & Will Be Used To Generate Your Certificate And For Your Book Purchase Address
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          placeholder="Enter Your Good Name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Father Name</Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setF(e.target.value);
                          }}
                          placeholder="Enter Your Father Name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Mother Name</Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setM(e.target.value);
                          }}
                          placeholder="Enter Your Mother Name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Institute or Collage</Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setI(e.target.value);
                          }}
                          placeholder="Currently Stydying At"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Address</Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setA(e.target.value);
                          }}
                          placeholder="Used If You Order A Book"
                        />
                      </div>
                      {/* Rest of the Input fields */}
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          saveUser();
                        }}
                        disabled={dis}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Card className="w-[350px] sm:max-w-350px">
                  <CardHeader>
                    <CardTitle>{data.user.name}</CardTitle>
                    <CardDescription>Welcome Back!</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                      <BellRing />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Do You Like It
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Push Notification
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <div>
                      <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {data.user.fName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your Father Name
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {data.user.mName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your Mother Name
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {data.user.iName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your Institute
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {data.user.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your Delivery Address
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => {
                        window.location.assign("https://wa.me/918307030976");
                      }}
                      className="w-full"
                    >
                      <Check /> &nbsp;Helo & Support
                    </Button>
                  </CardFooter>
              </Card>
            )}
          </div>
          <div className="w-full flex justify-center items-center mx-auto h-full mt-4">
            <Card className="w-[350px] sm:max-w-350px mx-auto">
              <CardHeader>
              <CardTitle>Exam Results</CardTitle>
              <CardDescription>Only Shown If You Quliffied Any Exam</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  {data.exam.length > 0 &&
                    data.exam.map((course: any) => {
                      return (
                        <div
                          className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                          key={course.cId}
                        >
                          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {course.ExamName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <div className="flex justify-between mt-2">
                                <div>
                                  <p>Marks: {course.ObtainedMarks} Out Of {course.TotalMarks}</p>
                                </div>
                                <div>
                                  <Badge
                                    onClick={() => {
                                      toast("Download Certificate");
                                      //user the exam object to genrate the certificate here the exam is a current object in the map
                                    }}
                                  >
                                    Certificate
                                  </Badge>
                                </div>
                              </div>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full flex justify-center items-center mx-auto h-full mt-4">
            <Card className="w-[350px] sm:max-w-350px mx-auto">
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>Only Shown If You Are A Premium User</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  {data.Courses.length > 0 &&
                    data.Courses.map((course: any) => {
                      const expiryDate = new Date(course.expiryDate);
                      return (
                        <div
                          className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                          key={course.cId}
                        >
                          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {course.courseName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <div className="flex justify-between mt-2">
                                <div>
                                  <Badge
                                    onClick={() => {
                                      toast("Redirecting....");
                                      router.push(
                                        `/courses/${course.courseId}`
                                      );
                                    }}
                                  >
                                    Open Now
                                  </Badge>
                                </div>
                                <div>
                                  Valid Till:&nbsp;{expiryDate.getDate()}-
                                  {expiryDate.getMonth() + 1}-
                                  {expiryDate.getFullYear()}
                                </div>
                              </div>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center mx-auto mt-10">
          {[...Array(10)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-4 mt-3">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-400" />
                <Skeleton className="h-4 w-[200px] bg-gray-300" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
