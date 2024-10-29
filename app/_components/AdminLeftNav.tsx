"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useTheme } from "next-themes";
import {Sun, Moon} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
export default function Nav(){
  const router = useRouter();
  const {setTheme} = useTheme();
    return(
      <>
      <div className="flex justify-center align-middle items-center mt-3">
      <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Main Actions</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={()=>{toast("Redirecting ......")
            router.push('/admin/dashbord')}}>
            Courses
          </MenubarItem>
          <MenubarSeparator />
          {/* <MenubarItem onClick={()=>{
            toast("Redirecting ......")
            router.push('/admin/dashbord/books')}}>
            Books
          </MenubarItem> */}
          <MenubarSeparator />
          <MenubarItem onClick={()=>{toast("Redirecting ......")
            router.push('/admin/dashbord/it')}}>
            Internship & Traning
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>User Actions</MenubarTrigger>
        <MenubarContent>
        <MenubarItem onClick={()=>{toast("Redirecting ......")
            router.push('/admin/dashbord/buyforce')}}>
              Force Buy Course
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={()=>{toast("Redirecting ......")
            router.push('/admin/dashbord/cerHis')}}>
              Certificate History
          </MenubarItem>
          <MenubarSeparator />
          {/* <MenubarItem onClick={()=>{toast("Redirecting ......")
            router.push('/admin/dashbord/bookOrders')}}>
              Book Orders
          </MenubarItem> */}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    <div className="ml-2">
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
    </div>
    </>
    )
}