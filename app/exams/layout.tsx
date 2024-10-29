"use client";
import * as React from "react";
export default function Layout({children}: {children: React.ReactNode}){
    React.useEffect(()=>{
        document.addEventListener('selectstart', (e) => e.preventDefault());
        document.addEventListener('mousedown', (e) => e.preventDefault());
    },[]);
    return (
        <>
        {children}
        </>
    )
}