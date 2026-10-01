// Metadata ใช้กำหนดข้อมูลของหน้าเว็บ เช่น ชื่อเว็บไซต์
import type { Metadata } from "next";

// นำเข้า Providers สำหรับใช้งาน TanStack Query
import Providers from "./providers";

// นำเข้า CSS หลักของเว็บไซต์
import "./globals.css";

// กำหนด Metadata ของเว็บไซต์
export const metadata: Metadata = {
  // ชื่อที่แสดงบน Browser
  title: "รายการสินค้า",
};

// RootLayout เป็น Layout หลักของทุกหน้า
export default function RootLayout({
  children,
}: Readonly<{
  // children คือเนื้อหาของแต่ละหน้า
  children: React.ReactNode;
}>) {
  return (
    // กำหนดภาษาเว็บไซต์เป็นภาษาไทย
    <html lang="th">
      <body>
        {/* 
          ครอบเนื้อหาทั้งหมดด้วย Providers
          เพื่อให้ Component ภายในสามารถใช้ TanStack Query ได้
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
