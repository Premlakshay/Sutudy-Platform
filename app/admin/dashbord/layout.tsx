"use client";
import Nav from "@/app/_components/AdminLeftNav";
import { useDashboard } from "@/app/_components/AdminContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Layout({children}: any){
    const {admin} = useDashboard();
    const router = useRouter();
    useEffect(()=>{
    if(!admin){
        router.push('/admin');
    }
    },[]);
    return (
        <>
        <Nav />
        {children}
        </>
    )
}