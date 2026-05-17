import { Elysia } from "elysia";
import { requireAdmin } from "../lib/auth";
import { categoryAdminRoutes } from "./admin/categories";
import { productAdminRoutes } from "./admin/products";
import { stockAdminRoutes } from "./admin/stock";
import { uploadAdminRoutes } from "./admin/uploads";

export const adminRoutes = new Elysia({ prefix: "/admin" })
  .use(requireAdmin)
  .use(categoryAdminRoutes)
  .use(productAdminRoutes)
  .use(stockAdminRoutes)
  .use(uploadAdminRoutes);