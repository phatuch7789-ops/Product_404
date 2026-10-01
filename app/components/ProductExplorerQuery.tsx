"use client";

// useState ใช้เก็บค่าการค้นหา
import { useState } from "react";

// useQuery ใช้จัดการการเรียก API และสถานะของข้อมูล
import { useQuery } from "@tanstack/react-query";

import ProductSearchForm from "./ProductSearchForm";

import {
  defaultQuery,
  fetchProducts,
} from "../lib/products";

import type {
  SearchQuery,
} from "../lib/products";


export default function ProductExplorerQuery() {

  // เก็บค่าการค้นหาปัจจุบัน
  // เริ่มต้นด้วย defaultQuery
  const [query, setQuery] =
    useState<SearchQuery>(defaultQuery);


  // useQuery จัดการการเรียก API
  const {
    data,

    // กำลังโหลดข้อมูล
    isPending,

    // เกิด Error หรือไม่
    isError,

    // ข้อมูล Error
    error,

  } = useQuery({

    // ใช้ระบุข้อมูลชุดนี้
    // ถ้า query เปลี่ยน React Query จะเรียกข้อมูลใหม่
    queryKey: ["products", query],

    // ฟังก์ชันที่ใช้เรียก API
    queryFn: () => fetchProducts(query),

  });


  // ฟังก์ชันทำงานเมื่อผู้ใช้ค้นหาสินค้า
  async function search(
    next: SearchQuery
  ): Promise<void> {

    // เปลี่ยนค่าการค้นหา
    setQuery(next);
  }


  return (
    <main>

      {/* ฟอร์มค้นหาสินค้า */}
      <ProductSearchForm
        onSearch={search}
      />


      {/* แสดงข้อความขณะกำลังโหลด */}
      {isPending && (
        <p>
          กำลังโหลดข้อมูล
        </p>
      )}


      {/* แสดงข้อความเมื่อเกิด Error */}
      {isError && (
        <p role="alert">
          {error.message}
        </p>
      )}


      {/* ถ้าโหลดสำเร็จแต่ไม่พบสินค้า */}
      {data?.products.length === 0 && (
        <p>
          ไม่พบสินค้าที่ตรงกับเงื่อนไข
        </p>
      )}


      {/* ถ้ามีข้อมูลสินค้า ให้แสดงรายการ */}
      {data && data.products.length > 0 && (
        <ul>

          {/* วนแสดงสินค้าทุกตัว */}
          {data.products.map((item) => (
            <li key={item.id}>

              {/* แสดงชื่อและราคาสินค้า */}
              {item.title} {item.price}

            </li>
          ))}

        </ul>
      )}

    </main>
  );
}