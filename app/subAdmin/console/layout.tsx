"use client";
import { useDashboard } from "@/app/_components/AdminContext";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { toast } from "sonner";
export default function Layout({children}: any){
    const {sub, subAdmin, admin}: {sub: string, subAdmin: boolean, admin: boolean} = useDashboard();
    const router = useRouter();
    const {setTheme} = useTheme();
     useEffect(()=>{
        if(!admin){
            if(!subAdmin || sub == ""){
                toast("Please Login to the Console");
                router.push('/subAdmin');
            }
        }else{
            if(sub == ""){
                toast("Please Re-lauch the course");
                router.push('/admin/dashbord');
            }
        }
    },[]);
    return (
        <>
        <div className="flex items-center content-center justify-center m-3">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
        {children}
        </>
    )
}