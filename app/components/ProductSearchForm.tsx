"use client";

// React Hook Form ใช้จัดการข้อมูลในฟอร์ม
import { useForm } from "react-hook-form";

// ใช้เชื่อม React Hook Form กับ Zod
import { zodResolver } from "@hookform/resolvers/zod";

import {
  SORT_FIELDS,
  SearchQuerySchema,
  defaultQuery,
} from "../lib/products";

import type { SearchQuery } from "../lib/products";


// Props ที่รับมาจาก ProductExplorer
type ProductSearchFormProps = {

  // onSearch คือฟังก์ชันที่ใช้ค้นหาสินค้า
  onSearch: (query: SearchQuery) => Promise<void>;
};


export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {

  const {

    // register ใช้ผูก input เข้ากับ Form
    register,

    // handleSubmit ตรวจข้อมูลก่อนส่ง Form
    handleSubmit,

    formState: {

      // errors เก็บข้อความ Error
      errors,

      // เช็กว่ากำลังส่งข้อมูลอยู่หรือไม่
      isSubmitting,

    },

  } = useForm<SearchQuery>({

    // ใช้ Zod ตรวจสอบข้อมูล
    resolver: zodResolver(SearchQuerySchema),

    // ตรวจเมื่อผู้ใช้แตะหรือกรอกช่อง
    mode: "onTouched",

    // ค่าเริ่มต้น
    defaultValues: defaultQuery,
  });


  return (
    <form
      className="search-form"

      // ส่งข้อมูลไปที่ onSearch หลังผ่านการตรวจสอบ
      onSubmit={handleSubmit(onSearch)}

      // ใช้ Zod ตรวจสอบแทน Browser
      noValidate
    >

      {/* ช่องค้นหาสินค้า */}
      <div className="form-field">
        <label htmlFor="q">
          คำค้น
        </label>

        <input
          id="q"

          // เชื่อมช่องค้นหากับ React Hook Form
          {...register("q")}

          placeholder="phone"
        />
      </div>


      {/* จำนวนรายการที่ต้องการแสดง */}
      <div className="form-field">
        <label htmlFor="limit">
          จำนวนรายการ
        </label>

        <input
          id="limit"
          type="number"
          required

          // valueAsNumber แปลงค่าจาก String เป็น Number
          {...register("limit", {
            valueAsNumber: true,
          })}

          // บอกว่าช่องนี้มี Error หรือไม่
          aria-invalid={!!errors.limit}

          // เชื่อม input กับข้อความ Error
          aria-describedby="limit-error"
        />

        {/* แสดง Error ของจำนวนรายการ */}
        <span
          id="limit-error"
          role="alert"
        >
          {errors.limit?.message}
        </span>
      </div>


      {/* เลือกวิธีเรียงข้อมูล */}
      <div className="form-field">
        <label htmlFor="sortBy">
          เรียงตาม
        </label>

        <select
          id="sortBy"

          // เชื่อม Select กับ React Hook Form
          {...register("sortBy")}
        >

          {/* สร้างตัวเลือกจาก SORT_FIELDS */}
          {SORT_FIELDS.map((field) => (
            <option
              key={field}
              value={field}
            >
              {field}
            </option>
          ))}

        </select>
      </div>


      {/* ปุ่มค้นหา */}
      <button
        className="search-button"
        type="submit"

        // ป้องกันการกดซ้ำตอนกำลังค้นหา
        disabled={isSubmitting}
      >

        {/* เปลี่ยนข้อความตามสถานะการส่ง Form */}
        {isSubmitting
          ? "กำลังค้นหา..."
          : "ค้นหา"}

      </button>

    </form>
  );
}