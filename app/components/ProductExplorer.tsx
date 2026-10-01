"use client";

// useState = เก็บข้อมูลและสถานะ
// useEffect = เรียก API ตอนเปิดหน้า
import { useEffect, useState } from "react";

import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

import {
  defaultQuery,
  fetchProducts,
} from "../lib/products";

import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "../lib/products";

// สถานะของการโหลดข้อมูล
type LoadState =
  | "loading" // กำลังโหลด
  | "error"   // โหลดไม่สำเร็จ
  | "ready";  // โหลดสำเร็จ

export default function ProductExplorer() {

  // เก็บรายการสินค้า
  const [products, setProducts] =
    useState<Product[]>([]);

  // เก็บสถานะการโหลด
  const [status, setStatus] =
    useState<LoadState>("loading");

  // เก็บข้อความ Error
  const [errorMessage, setErrorMessage] =
    useState("");

  // เก็บสินค้าที่กำลังแก้ไข
  const [editing, setEditing] =
    useState<Product | null>(null);


  // ทำงานเมื่อโหลดข้อมูลสำเร็จ
  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }


  // ทำงานเมื่อเกิด Error
  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "เรียกข้อมูลไม่สำเร็จ"
    );

    setStatus("error");
  }


  // ฟังก์ชันสำหรับค้นหาและโหลดสินค้า
  async function loadProducts(
    query: SearchQuery
  ) {
    // เปลี่ยนสถานะเป็นกำลังโหลด
    setStatus("loading");

    setErrorMessage("");

    try {
      // เรียก API แล้วแสดงผล
      showResult(
        await fetchProducts(query)
      );
    } catch (error) {
      // ถ้าเกิด Error ให้แสดง Error
      showError(error);
    }
  }


  // เรียก API อัตโนมัติเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    fetchProducts(defaultQuery)
      .then(showResult)
      .catch(showError);
  }, []);


  // เพิ่มสินค้า / แก้ไขสินค้า
  function saveProduct(
    draft: ProductDraft
  ) {

    // ถ้ามีสินค้าอยู่ในโหมดแก้ไข
    if (editing) {

      // map ใช้แก้เฉพาะสินค้าที่เลือก
      setProducts(
        products.map((product) =>
          product.id === editing.id
            ? {
                ...draft,
                id: editing.id,
                thumbnail: editing.thumbnail,
              }
            : product
        )
      );

      // ออกจากโหมดแก้ไข
      setEditing(null);

    } else {

      // ถ้าไม่ได้แก้ไข = เพิ่มสินค้าใหม่
      setProducts([
        ...products,
        {
          ...draft,

          // สร้าง ID ใหม่
          id: Date.now(),

          thumbnail: "",
        },
      ]);
    }
  }


  // ลบสินค้า
  function removeProduct(id: number) {

    // filter เอาสินค้าที่ต้องการลบออก
    setProducts(
      products.filter(
        (product) => product.id !== id
      )
    );

    // ถ้าลบตัวที่กำลังแก้ไข
    // ให้ออกจากโหมดแก้ไขด้วย
    if (editing?.id === id) {
      setEditing(null);
    }
  }


  // ยกเลิกการแก้ไข
  function cancelEdit() {
    setEditing(null);
  }


  return (
    <main>
      <h1>รายการสินค้า</h1>

      <button
        type="button"

        // กดเพื่อโหลดข้อมูลใหม่
        onClick={() =>
          loadProducts(defaultQuery)
        }

        // ปิดปุ่มระหว่างกำลังโหลด
        disabled={status === "loading"}
      >
        {status === "loading"
          ? "กำลังโหลด"
          : "โหลดข้อมูล"}
      </button>


      {/* ฟอร์มค้นหา ส่งฟังก์ชัน loadProducts ไปให้ */}
      <ProductSearchForm
        onSearch={loadProducts}
      />


      {/* ฟอร์มเพิ่มและแก้ไขสินค้า */}
      <ProductForm
        key={editing?.id ?? "new"}
        editing={editing}
        onSave={saveProduct}
        onCancel={cancelEdit}
      />


      {/* aria-live ช่วยให้โปรแกรมอ่านหน้าจอรู้ว่าข้อมูลเปลี่ยน */}
      <section aria-live="polite">

        {/* แสดงตอนกำลังโหลด */}
        {status === "loading" && (
          <p>กำลังโหลดข้อมูล</p>
        )}


        {/* แสดงเมื่อเกิด Error */}
        {status === "error" && (
          <p role="alert">
            {errorMessage}
          </p>
        )}


        {/* โหลดสำเร็จแต่ไม่พบสินค้า */}
        {status === "ready" &&
          products.length === 0 && (
            <p>
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </p>
          )}


        {/* ถ้ามีสินค้า ให้แสดงตาราง */}
        {status === "ready" &&
          products.length > 0 && (

            <table>
              <thead>
                <tr>
                  <th>รูป</th>
                  <th>ชื่อสินค้า</th>
                  <th>ราคา</th>
                  <th>คงเหลือ</th>
                  <th>หมวดหมู่</th>
                  <th>จัดการ</th>
                </tr>
              </thead>

              <tbody>

                {/* map วนแสดงสินค้าทุกตัว */}
                {products.map((item) => (
                  <tr key={item.id}>

                    <td>
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          width={80}
                        />
                      )}
                    </td>

                    <td>
                      {item.title}
                    </td>

                    <td>
                      {item.price}
                    </td>

                    <td>
                      {item.stock}
                    </td>

                    <td>
                      {item.category}
                    </td>

                    <td>

                      {/* กดแก้ไขแล้วเก็บสินค้าตัวนั้นไว้ใน editing */}
                      <button
                        type="button"
                        onClick={() =>
                          setEditing(item)
                        }
                      >
                        แก้ไข
                      </button>

                      {/* ลบสินค้าตาม ID */}
                      <button
                        type="button"
                        onClick={() =>
                          removeProduct(item.id)
                        }
                      >
                        ลบ
                      </button>

                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          )}

      </section>
    </main>
  );
}