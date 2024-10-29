"use client";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/app/_components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LucideShare2, LockIcon, Grid2x2 } from "lucide-react";
import McqView from "@/app/_components/McqView";
export default function Home({ params }: { params: { id: String } }) {
  const cId = params.id;
  const [titles, setTitles] = React.useState([]);
  const router = useRouter();
  const [cer, setCer] = React.useState(false);
  const [cs, setCs] = React.useState(false);
  const [mcq, setMcq] = React.useState([]);
  const [exp, setExp] = React.useState(false);
  const [topic, setTopic] = React.useState("");
  const [con, setCont] = React.useState("Loading");
  const loadCon = async () => {
    setCont("Loading");
    const getCouser = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: cId }),
    });
    const dataTem = await getCouser.json();
    if (dataTem.course) {
      setExp(dataTem.exp);
      if (dataTem.course.cer == true) {
        setCer(true);
      }
    } else {
      toast("In-Valid Course ID");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
    const res = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tId: topic }),
    });
    const data = await res.json();
    setCont(
      `<style>body{background-color: transparent !important;}::-webkit-scrollbar{width: 0;} </style>${data.content[0]?.con} <script>document.addEventListener('selectstart', (e) => e.preventDefault());document.addEventListener('mousedown', (e) => e.preventDefault()); document.body.style.backgroundColor = 'transparent';</script>`
    );
  };
  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cId }),
      });
      const data = await res.json();
      if (data.result[0]) {
        if (exp) {
          let unpaidTopic = null;
          for (let i = 0; i < data.result.length; i++) {
            if (!data.result[i].paid) {
              unpaidTopic = data.result[i]._id;
              break;
            }
          }
          if (unpaidTopic) {
            setTopic(unpaidTopic); 
          } else {
            console.error("No unpaid topics found");
          }
        } else {
          setTopic(data.result[0]._id);
        }
      }
      setTitles(data.result); 
    })();
  }, [exp]); 
  React.useEffect(() => {
    loadCon();
  }, [topic]);
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="max-md:hidden flex flex-grow scrollbar-hide w-screen overflow-hidden outline-none border-none">
        <div className="w-1/5 h-full scrollbar-hide outline-none border-none ml-3">
          <ScrollArea className="h-full w-full rounded-md border-none overflow-y-hidden">
            <div className="flex flex-col scrollbar-hide dark:bg-gray-950 dark:shadow-gray-900 bg-teal-50 shadow-md shadow-teal-300">
              <Button className="-ml-4" variant={"default"}>
                Choose Topic
                {cer ? (
                  <>
                    <Badge
                      variant={"destructive"}
                      className="ml-3"
                      onClick={() => {
                        if (exp == false) {
                          toast("Redirecting.....");
                          router.push(`/exams/${cId}`);
                        } else {
                          toast("Buy or Log-IN to Get Certificate");
                          router.push(`/buycourse/${cId}`);
                        }
                      }}
                    >
                      Get Certificate
                    </Badge>
                  </>
                ) : (
                  <></>
                )}
                <Badge
                  className="ml-8"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast("URL Coppied");
                  }}
                >
                  <LucideShare2></LucideShare2>
                </Badge>
              </Button>
            </div>
            <div className="mt-4 border-none scrollbar-hide">
              {titles.length > 0 &&
                titles.map((title: any, index: number) => (
                  <div key={title._id} className="flex flex-col scrollbar-hide">
                    {exp == true && title.paid == true ? (
                      <>
                        <Button
                          onClick={() => {
                            toast(
                              "You need to Buy to view this content or Log-IN to your Account"
                            );
                            router.push(`/buycourse/${cId}`);
                          }}
                          variant={"outline"}
                          className="w-full"
                        >
                          {title.name} {title.mcq.length > 0 ? (
                            <>
                            &nbsp;&nbsp;<span><Grid2x2 className="m-1" onClick={()=>{toast("You need to Buy to view this content or Log-IN to your Account");router.push(`/buycourse/${cId}`);}}/></span>
                            </>
                          ): ( <></>)}
                           &nbsp;<LockIcon className="h-4 w-4"></LockIcon>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setCs(false);
                            setTopic(title._id);
                          }}
                          variant={"outline"}
                          className="w-full"
                        >
                          {title.name}
                          {title.mcq.length > 0 ? (
                            <>
                            &nbsp;&nbsp;<span><Grid2x2 className="m-1" onClick={(e)=>{e.stopPropagation(); setCs(true); setMcq(title.mcq[0].questions);}}/></span>
                            </>
                          ): ( <></>)}
                        </Button>
                      </>
                    )}
                    <Separator className="my-2 min-w-full border-teal-50 dark:border-teal-900" />
                  </div>
                ))}
              {titles.length <= 0 && (
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
            </div>
          </ScrollArea>
        </div>
        <div className="w-4/5 m-2 h-full scrollbar-hide outline-none border-none overflow-hidden flex justify-center items-center content-center mx-auto">
          {con == "Loading" ? (
            <>
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
            </>
          ) : (
            <div className="ml-2 mt-8 overflow-hidden overflow-y-auto scrollbar-hide w-full">
              {cs == false ? (
                <iframe
                style={{
                  width: "100vh",
                  height: "100vh",
                  margin: 0,
                  padding: 0,
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  backgroundColor: "transparent",
                }}
                className="m-0 bg-transparent p-0 min-h-screen min-w-full mt-3 overflow-hidden overflow-y-hidden"
                srcDoc={con}
              />
              ): (<>
              <McqView mcq={mcq}/>
              </>)}
            </div>
          )}
        </div>
      </div>
      <div className="hidden max-md:flex w-screen mt-2 mb-2 overflow-hidden scrollbar-hide dark:bg-transparent">
        <div className="grid pb-2 grid-flow-col border dark:border-transparent border-teal-100 auto-cols-max gap-4 p-2 items-center overflow-x-auto scrollbar-hide">
          {cer && (
            <Badge
              variant={"destructive"}
              className="ml-3"
              onClick={() => {
                if (exp == false) {
                  toast("Redirecting.....");
                  router.push(`/exams/${cId}`);
                } else {
                  toast("Buy or Log-IN to Get Certificate");
                  router.push(`/buycourse/${cId}`);
                }
              }}
            >
              Get Certificate
            </Badge>
          )}
          <Badge
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast("URL Coppied");
            }}
          >
            <LucideShare2></LucideShare2>
          </Badge>
          {titles.length > 0 ? (
            titles.map((title: any) => (
              <div key={title.id} className="flex flex-col dark:bg-black">
                {exp == true && title.paid == true ? (
                  <>
                                            <Button
                          onClick={() => {
                            toast(
                              "You need to Buy to view this content or Log-IN to your Account"
                            );
                            router.push(`/buycourse/${cId}`);
                          }}
                          variant={"outline"}
                          className="w-full"
                        >
                          {title.name} {title.mcq.length > 0 ? (
                            <>
                            &nbsp;&nbsp;<span><Grid2x2 className="m-1" onClick={()=>{toast("You need to Buy to view this content or Log-IN to your Account");router.push(`/buycourse/${cId}`);}}/></span>
                            </>
                          ): ( <></>)}
                           &nbsp;<LockIcon className="h-4 w-4"></LockIcon>
                        </Button>
                  </>
                ) : (
                  <>
                    <Button
                          onClick={() => {
                            setCs(false);
                            setTopic(title._id);
                          }}
                          variant={"outline"}
                          className="w-full"
                        >
                          {title.name}
                          {title.mcq.length > 0 ? (
                            <>
                            &nbsp;&nbsp;<span><Grid2x2 className="m-1" onClick={(e)=>{e.stopPropagation(); setCs(true); setMcq(title.mcq[0].questions);}}/></span>
                            </>
                          ): ( <></>)}
                        </Button>
                  </>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-col dark:bg-transparent">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px] bg-gray-400" />
                  <Skeleton className="h-4 w-[100px] bg-gray-300" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="hidden max-md:flex w-screen h-screen overflow-hidden scrollbar-hide bg-transparent">
        {con == "Loading" ? (
          <>
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
          </>
        ) : (
          <>
            {cs == false ? (
                <iframe
                style={{
                  width: "100vh",
                  height: "100vh",
                  margin: 0,
                  padding: 0,
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  backgroundColor: "transparent",
                }}
                className="m-0 bg-transparent p-0 min-h-screen min-w-full mt-3 overflow-hidden overflow-y-hidden"
                srcDoc={con}
              />
              ): (<div className="min-w-full">
              <McqView mcq={mcq}/>
              </div>)}
          </>
        )}
      </div>
    </div>
  );
}
