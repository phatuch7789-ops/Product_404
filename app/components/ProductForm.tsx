"use client";

// useForm ใช้จัดการข้อมูลในฟอร์ม
import { useForm } from "react-hook-form";

// เชื่อม React Hook Form กับ Zod
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CATEGORIES,
  ProductDraftSchema,
} from "../lib/products";

import type {
  Product,
  ProductDraft,
} from "../lib/products";


// กำหนด Props ที่ ProductForm รับเข้ามา
type ProductFormProps = {

  // สินค้าที่กำลังแก้ไข
  // ถ้าไม่มีสินค้าให้แก้ไข จะเป็น null
  editing: Product | null;

  // ฟังก์ชันสำหรับบันทึกข้อมูล
  onSave: (draft: ProductDraft) => void;

  // ฟังก์ชันสำหรับยกเลิกการแก้ไข
  onCancel: () => void;
};


export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {

  const {
    // register ใช้เชื่อม input แต่ละช่องกับ React Hook Form
    register,

    // handleSubmit ใช้ตรวจข้อมูลก่อนเรียก saveProduct
    handleSubmit,

    // reset ใช้ล้างข้อมูลในฟอร์ม
    reset,

    formState: {

      // errors เก็บข้อความ Error จาก Zod
      errors,

      // isDirty = ผู้ใช้มีการแก้ไขข้อมูลหรือยัง
      isDirty,

      // isValid = ข้อมูลในฟอร์มถูกต้องหรือไม่
      isValid,

    },

  } = useForm<ProductDraft>({

    // ใช้ Zod ตรวจสอบข้อมูลในฟอร์ม
    resolver: zodResolver(ProductDraftSchema),

    // ตรวจสอบข้อมูลเมื่อผู้ใช้แตะหรือกรอกช่อง
    mode: "onTouched",


    // ถ้ามี editing = อยู่ในโหมดแก้ไข
    // ถ้าไม่มี editing = อยู่ในโหมดเพิ่มสินค้า
    defaultValues: editing

      ? {
          // นำข้อมูลเดิมมาใส่ในฟอร์ม
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }

      : {
          // ค่าเริ่มต้นสำหรับการเพิ่มสินค้าใหม่
          title: "",
          price: undefined,
          stock: undefined,
          category: undefined,
        },
  });


  // ฟังก์ชันทำงานเมื่อกดปุ่มบันทึก
  function saveProduct(values: ProductDraft) {

    // ส่งข้อมูลกลับไปให้ ProductExplorer
    onSave(values);

    // ล้างข้อมูลในฟอร์ม
    reset();
  }


  return (
    <form

      // เมื่อ Submit จะเรียก saveProduct
      // หลังจากข้อมูลผ่านการตรวจสอบแล้ว
      onSubmit={handleSubmit(saveProduct)}

      // ปิดการตรวจสอบ Form ของ Browser
      // เพื่อให้ Zod เป็นตัวตรวจสอบหลัก
      noValidate
    >

      {/* ---------------- ชื่อสินค้า ---------------- */}

      <label htmlFor="title">
        ชื่อสินค้า
      </label>

      <input
        id="title"

        // กำหนดว่าช่องนี้จำเป็น
        required

        // เชื่อมช่องนี้กับ React Hook Form
        {...register("title")}

        // บอกว่าช่องนี้มี Error หรือไม่
        aria-invalid={!!errors.title}

        // เชื่อม input กับข้อความ Error
        aria-describedby="title-error"
      />

      {/* แสดงข้อความ Error ของชื่อสินค้า */}
      <span id="title-error" role="alert">
        {errors.title?.message}
      </span>


      {/* ---------------- ราคา ---------------- */}

      <label htmlFor="price">
        ราคา
      </label>

      <input
        id="price"
        type="number"
        step="0.01"
        required

        {...register("price", {

          // แปลงค่าจาก input จาก String เป็น Number
          valueAsNumber: true,

        })}

        aria-invalid={!!errors.price}
        aria-describedby="price-error"
      />

      {/* แสดงข้อความ Error ของราคา */}
      <span id="price-error" role="alert">
        {errors.price?.message}
      </span>


      {/* ---------------- จำนวนสินค้า ---------------- */}

      <label htmlFor="stock">
        จำนวนคงเหลือ
      </label>

      <input
        id="stock"
        type="number"
        required

        {...register("stock", {

          // แปลงค่าจาก input เป็น Number
          valueAsNumber: true,

        })}

        aria-invalid={!!errors.stock}
        aria-describedby="stock-error"
      />

      {/* แสดงข้อความ Error ของจำนวนสินค้า */}
      <span id="stock-error" role="alert">
        {errors.stock?.message}
      </span>


      {/* ---------------- หมวดหมู่ ---------------- */}

      <label htmlFor="category">
        หมวดหมู่
      </label>

      <select
        id="category"
        required

        // เชื่อม Select กับ React Hook Form
        {...register("category")}

        aria-invalid={!!errors.category}
        aria-describedby="category-error"
      >

        {/* ค่าเริ่มต้น ให้ผู้ใช้เลือกหมวดหมู่ */}
        <option value="">
          กรุณาเลือกหมวดหมู่
        </option>


        {/* วนแสดงหมวดหมู่ทั้งหมดจาก CATEGORIES */}
        {CATEGORIES.map((name) => (
          <option
            key={name}
            value={name}
          >
            {name}
          </option>
        ))}

      </select>

      {/* แสดงข้อความ Error ของหมวดหมู่ */}
      <span id="category-error" role="alert">
        {errors.category?.message}
      </span>


      {/* ---------------- ปุ่มบันทึก ---------------- */}

      <button
        type="submit"

        // ปุ่มจะกดไม่ได้ถ้ายังไม่ได้แก้ข้อมูล
        // หรือข้อมูลยังไม่ถูกต้อง
        disabled={!isDirty || !isValid}
      >

        {/* ถ้ามี editing = แก้ไข
            ถ้าไม่มี = เพิ่มสินค้า */}
        {editing
          ? "บันทึกการแก้ไข"
          : "เพิ่มสินค้า"}

      </button>


      {/* ---------------- ปุ่มยกเลิก ---------------- */}

      {editing && (

        // ปุ่มนี้จะแสดงเฉพาะตอนกำลังแก้ไขสินค้า
        <button
          type="button"

          // เรียกฟังก์ชันยกเลิกจาก ProductExplorer
          onClick={onCancel}
        >
          ยกเลิก
        </button>

      )}

    </form>
  );
}