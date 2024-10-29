"use client";
import { DashboardProvider } from "../_components/AdminContext";
export default function Layout({children}: any){
    return (
        <DashboardProvider>
                {children}
        </DashboardProvider>
    )
}