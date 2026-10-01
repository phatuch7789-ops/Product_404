"use client";

// useState ใช้สร้างและเก็บ QueryClient
import { useState } from "react";

// QueryClient ใช้จัดการข้อมูลที่เรียกจาก API
// QueryClientProvider ใช้ส่ง QueryClient ให้ Component อื่นใช้งาน
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";


export default function Providers({
  children,
}: Readonly<{
  // children คือ Component ต่าง ๆ ที่อยู่ภายใน Providers
  children: React.ReactNode;
}>) {

  // สร้าง QueryClient สำหรับจัดการข้อมูลของ React Query
  // ใช้ useState เพื่อให้สร้าง client เพียงครั้งเดียว
  const [client] =
    useState(() => new QueryClient());


  return (

    // ส่ง QueryClient ให้ Component ลูกทั้งหมดใช้งาน
    <QueryClientProvider client={client}>

      {/* แสดง Component ที่อยู่ภายใน Providers */}
      {children}

    </QueryClientProvider>
  );
}