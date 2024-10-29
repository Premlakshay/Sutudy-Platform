"use client";
import { useDashboard } from "@/app/_components/AdminContext";
import { useRouter } from "next/navigation";
export default function Layout({children}: any){
    const {tit} = useDashboard();
    const router = useRouter();
    if(tit == ""){
        router.push('/subAdmin/console');
    }
    return (
        <>
        {children}
        </>
    )
}