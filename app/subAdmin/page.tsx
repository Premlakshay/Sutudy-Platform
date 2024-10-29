"use client";
import { useDashboard } from "../_components/AdminContext";
import { Loader2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { SignedIn, SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export default function(){
    const {setSub, setSubAdmin} = useDashboard();
    const [msg, setMsg]: any = React.useState(null);
    const {setIt} = useDashboard();
    const {user} = useUser();
    const router = useRouter();
    const verify = async () => {
            if(user?.emailAddresses?.[0].emailAddress != undefined){
                const res: any = await fetch('/api/subAdmin', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: user?.emailAddresses?.[0].emailAddress}),
                  })
                  const data: any = await res.json();
                  setMsg(data.message);
                  if(data.message){
                    if(data.message == "Logged-IN:"){
                      setSub(data.cId);
                      setIt(data.it);
                      setSubAdmin(true);
                      setMsg(`${data.message} Wait While Redirecting `);
                      setTimeout(() => {
                        router.push('/subAdmin/console');
                      }, 2000);
                    }
                  }else{
                    verify();
                  }
                }else{
                  setMsg('Try again to Log-IN:');
                }
    }
    React.useEffect(()=>{
      if(user){
        verify();
      }
    },[user]);
    return(
        <>
        <div className="flex flex- mb-4 justify-center items-center h-screen m-auto">
        {!user &&(
            <SignIn routing="hash"></SignIn>
        )}
        <div className="grid grid-cols-6 gap-4">
        <div className="col-start-1 col-end-7">
        <SignedIn>
        <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying Sub-Admin Access
        </Button>
        </SignedIn>
        </div>
        <div className="col-start-1 col-end-7 mt-4 ">
        {msg && (
            <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Message</AlertTitle>
            <AlertDescription>
              {msg}
            </AlertDescription>
          </Alert>
        )}
        </div>
        </div>
        </div>
        </>
    )
}