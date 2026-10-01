import { z } from "zod";

// รายชื่อหมวดหมู่ คัดลอกจาก
// https://dummyjson.com/products/category-list
// ใช้กำหนดหมวดหมู่ที่สามารถเลือกได้
export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;


// สร้าง Schema สำหรับตรวจสอบข้อมูลสินค้า
export const ProductSchema = z.object({
  // รหัสสินค้าต้องเป็นตัวเลข
  id: z.number(),

  // ชื่อสินค้าต้องเป็นข้อความ และห้ามว่าง
  title: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อสินค้า"),

  // ราคาต้องเป็นตัวเลข และห้ามติดลบ
  price: z
    .number({ error: "กรุณากรอกราคา" })
    .min(0, "ราคาต้องไม่ติดลบ"),

  // จำนวนสินค้าในคลังต้องเป็นจำนวนเต็ม และห้ามติดลบ
  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),

  // หมวดหมู่ต้องเป็นค่าที่อยู่ใน CATEGORIES
  category: z.enum(CATEGORIES, {
    error: "กรุณาเลือกหมวดหมู่",
  }),

  // รายละเอียดสินค้าเป็นข้อมูลที่ไม่จำเป็นต้องมี
  description: z.string().trim().optional(),

  // รูปสินค้าจาก API
  thumbnail: z.string().optional(),
});


// Schema สำหรับตรวจสอบข้อมูลรายการสินค้าจาก API
export const ProductListSchema = z.object({
  // products ต้องเป็น Array และแต่ละตัวต้องตรงกับ ProductSchema
  products: z.array(ProductSchema),

  // จำนวนสินค้าทั้งหมด
  total: z.number(),

  // ตำแหน่งเริ่มต้นของข้อมูล
  skip: z.number(),

  // จำนวนข้อมูลที่ API ส่งกลับมา
  limit: z.number(),
});


// Type ที่สร้างจาก Schema
// z.infer ช่วยสร้าง TypeScript Type จาก Zod Schema
export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;


// Schema ของข้อมูลที่กรอกจากฟอร์ม
// ไม่ต้องกรอก id และรูป เพราะ id สร้างตอนเพิ่มสินค้า
// ส่วนรูปมาจาก API
export const ProductDraftSchema = ProductSchema.omit({
  id: true,
  thumbnail: true,
});

// สร้าง Type ของข้อมูลที่ใช้ในฟอร์มจาก Schema
export type ProductDraft = z.infer<typeof ProductDraftSchema>;


// URL หลักของ External API
const API_BASE = "https://dummyjson.com";

// ฟิลด์ที่ใช้สำหรับเรียงข้อมูลสินค้า
export const SORT_FIELDS = ["title", "price", "stock"] as const;


// Schema สำหรับตรวจสอบข้อมูลที่ใช้ค้นหาสินค้า
export const SearchQuerySchema = z.object({
  // คำค้นหา
  q: z.string().trim(),

  // จำนวนรายการที่ต้องการแสดง
  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),

  // ฟิลด์ที่ใช้เรียงข้อมูล
  sortBy: z.enum(SORT_FIELDS),
});

// สร้าง Type จาก SearchQuerySchema
export type SearchQuery = z.infer<typeof SearchQuerySchema>;


// ค่าเริ่มต้นของการค้นหา
export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};


// ฟังก์ชันสำหรับสร้าง URL ที่ใช้เรียก API
export function buildProductUrl(query: SearchQuery): string {
  // ใช้ URLSearchParams ช่วยสร้าง Query String
  const params = new URLSearchParams();

  // ใส่คำค้นหา
  params.set("q", query.q);

  // ใส่จำนวนรายการ โดยแปลงตัวเลขเป็น String
  params.set("limit", String(query.limit));

  // ใส่ฟิลด์ที่ใช้เรียงข้อมูล
  params.set("sortBy", query.sortBy);

  // กำหนดให้เรียงจากน้อยไปมาก
  params.set("order", "asc");

  // ขอข้อมูลเฉพาะที่ใช้ในหน้าเว็บ
  params.set("select", "title,price,stock,category,thumbnail");

  // นำ API และ Query String มาต่อกันเป็น URL
  const url = `${API_BASE}/products/search?${params.toString()}`;

  // แสดง URL ใน Console เพื่อใช้ตรวจสอบตอนพัฒนา
  console.log("เรียก URL:", url);

  return url;
}


// ฟังก์ชันสำหรับเรียกข้อมูลสินค้าจาก External API
export async function fetchProducts(
  query: SearchQuery
): Promise<ProductList> {

  // เรียก API โดยใช้ URL ที่สร้างจาก buildProductUrl
  const response = await fetch(buildProductUrl(query));

  // ตรวจสอบว่า API ตอบกลับสำเร็จหรือไม่
  // response.ok จะเป็น true เมื่อสถานะอยู่ในช่วง 200-299
  if (!response.ok) {
    throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
  }

  // แปลงข้อมูลที่ API ส่งกลับมาเป็น JSON
  const data = await response.json();

  // แสดงข้อมูลที่ได้รับใน Console เพื่อใช้ตรวจสอบ
  console.log("ข้อมูลที่ได้รับ:", data);

  // ใช้ Zod ตรวจสอบว่าข้อมูลตรงกับ ProductListSchema หรือไม่
  const result = ProductListSchema.safeParse(data);

  // ถ้าข้อมูลไม่ตรงกับ Schema ให้แจ้ง Error
  if (!result.success) {
    throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
  }

  // คืนค่าข้อมูลที่ผ่านการตรวจสอบแล้ว
  return result.data;
}