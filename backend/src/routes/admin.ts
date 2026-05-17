import { Elysia, t } from "elysia";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../lib/auth";

const UPLOADS_ROOT = resolve(import.meta.dir, "..", "..", "uploads");
const CATEGORY_ICON_DIR = resolve(UPLOADS_ROOT, "categories");
const PRODUCT_IMAGE_DIR = resolve(UPLOADS_ROOT, "products");
const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};
const MAX_ICON_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Admin-only management endpoints.
 * Mounted under /admin and gated by `requireAdmin` middleware.
 */
export const adminRoutes = new Elysia({ prefix: "/admin" })
  .use(requireAdmin)

  // ---------- categories ----------
  .get("/categories", async () => {
    const categories = await prisma.category.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { products: true } } },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      description: c.description,
      position: c.position,
      visible: c.visible,
      productCount: c._count.products,
    }));
  })

  .post(
    "/categories",
    async ({ body, set }) => {
      const slug = body.slug?.trim() || slugify(body.name);
      if (!slug) {
        set.status = 400;
        return { error: "INVALID_SLUG" };
      }
      const max = await prisma.category.aggregate({
        _max: { position: true },
      });
      try {
        const created = await prisma.category.create({
          data: {
            name: body.name.trim(),
            slug,
            icon: body.icon?.trim() || "▶",
            description: body.description?.trim() ?? "",
            position: (max._max.position ?? 0) + 1,
            visible: body.visible ?? true,
          },
        });
        return created;
      } catch (err: unknown) {
        if ((err as { code?: string }).code === "P2002") {
          set.status = 409;
          return { error: "SLUG_TAKEN" };
        }
        throw err;
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 80 }),
        slug: t.Optional(t.String({ maxLength: 80 })),
        icon: t.Optional(t.String({ maxLength: 256 })),
        description: t.Optional(t.String({ maxLength: 500 })),
        visible: t.Optional(t.Boolean()),
      }),
    }
  )

  .patch(
    "/categories/:id",
    async ({ params, body, set }) => {
      const data: Record<string, unknown> = {};
      if (body.name !== undefined) data.name = body.name.trim();
      if (body.slug !== undefined) {
        const s = body.slug.trim() || (body.name ? slugify(body.name) : "");
        if (!s) {
          set.status = 400;
          return { error: "INVALID_SLUG" };
        }
        data.slug = s;
      }
      if (body.icon !== undefined) data.icon = body.icon.trim() || "▶";
      if (body.description !== undefined) data.description = body.description;
      if (body.visible !== undefined) data.visible = body.visible;
      if (body.position !== undefined) data.position = body.position;

      try {
        const updated = await prisma.category.update({
          where: { id: params.id },
          data,
        });
        return updated;
      } catch (err: unknown) {
        const code = (err as { code?: string }).code;
        if (code === "P2025") {
          set.status = 404;
          return { error: "CATEGORY_NOT_FOUND" };
        }
        if (code === "P2002") {
          set.status = 409;
          return { error: "SLUG_TAKEN" };
        }
        throw err;
      }
    },
    {
      body: t.Partial(
        t.Object({
          name: t.String({ minLength: 1, maxLength: 80 }),
          slug: t.String({ maxLength: 80 }),
          icon: t.String({ maxLength: 256 }),
          description: t.String({ maxLength: 500 }),
          visible: t.Boolean(),
          position: t.Integer(),
        })
      ),
    }
  )

  .delete("/categories/:id", async ({ params, set }) => {
    const productCount = await prisma.product.count({
      where: { categoryId: params.id },
    });
    if (productCount > 0) {
      set.status = 409;
      return { error: "CATEGORY_HAS_PRODUCTS", productCount };
    }
    try {
      await prisma.category.delete({ where: { id: params.id } });
      return { ok: true };
    } catch (err: unknown) {
      if ((err as { code?: string }).code === "P2025") {
        set.status = 404;
        return { error: "CATEGORY_NOT_FOUND" };
      }
      throw err;
    }
  })

  .post(
    "/categories/reorder",
    async ({ body }) => {
      await prisma.$transaction(
        body.ids.map((id, idx) =>
          prisma.category.update({
            where: { id },
            data: { position: idx },
          })
        )
      );
      return { ok: true };
    },
    {
      body: t.Object({ ids: t.Array(t.String()) }),
    }
  )

  // ---------- products ----------
  .get("/products", async () => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, slug: true, name: true } },
        _count: {
          select: {
            stock: { where: { soldAt: null } },
          },
        },
      },
    });
    return products.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      description: p.description,
      price: p.price,
      duration: p.duration,
      image: p.image,
      status: p.status,
      category: p.category,
      availableStock: p._count.stock,
      createdAt: p.createdAt,
    }));
  })

  .post(
    "/products",
    async ({ body, set }) => {
      const cat = await prisma.category.findUnique({
        where: { id: body.categoryId },
      });
      if (!cat) {
        set.status = 400;
        return { error: "CATEGORY_NOT_FOUND" };
      }
      try {
        const created = await prisma.product.create({
          data: {
            sku: body.sku.toUpperCase().trim(),
            name: body.name.trim(),
            description: body.description ?? "",
            price: body.price,
            duration: body.duration?.trim() || "—",
            image: body.image?.trim() || null,
            status: body.status ?? "ACTIVE",
            categoryId: body.categoryId,
          },
        });
        return created;
      } catch (err: unknown) {
        if ((err as { code?: string }).code === "P2002") {
          set.status = 409;
          return { error: "SKU_TAKEN" };
        }
        throw err;
      }
    },
    {
      body: t.Object({
        sku: t.String({ minLength: 1, maxLength: 64 }),
        name: t.String({ minLength: 1, maxLength: 120 }),
        description: t.Optional(t.String({ maxLength: 2000 })),
        price: t.Integer({ minimum: 0 }),
        duration: t.Optional(t.String({ maxLength: 32 })),
        image: t.Optional(t.Union([t.String({ maxLength: 256 }), t.Null()])),
        status: t.Optional(
          t.Union([
            t.Literal("ACTIVE"),
            t.Literal("DRAFT"),
            t.Literal("SOLD_OUT"),
          ])
        ),
        categoryId: t.String(),
      }),
    }
  )

  .patch(
    "/products/:id",
    async ({ params, body, set }) => {
      const data: Record<string, unknown> = {};
      if (body.sku !== undefined) data.sku = body.sku.toUpperCase().trim();
      if (body.name !== undefined) data.name = body.name.trim();
      if (body.description !== undefined) data.description = body.description;
      if (body.price !== undefined) data.price = body.price;
      if (body.duration !== undefined) data.duration = body.duration.trim() || "—";
      if (body.status !== undefined) data.status = body.status;
      if (body.categoryId !== undefined) data.categoryId = body.categoryId;
      if (body.image !== undefined) {
        const v = body.image;
        data.image = v && v.trim() ? v.trim() : null;
      }

      try {
        const updated = await prisma.product.update({
          where: { id: params.id },
          data,
        });
        return updated;
      } catch (err: unknown) {
        const code = (err as { code?: string }).code;
        if (code === "P2025") {
          set.status = 404;
          return { error: "PRODUCT_NOT_FOUND" };
        }
        if (code === "P2002") {
          set.status = 409;
          return { error: "SKU_TAKEN" };
        }
        throw err;
      }
    },
    {
      body: t.Partial(
        t.Object({
          sku: t.String({ minLength: 1, maxLength: 64 }),
          name: t.String({ minLength: 1, maxLength: 120 }),
          description: t.String({ maxLength: 2000 }),
          price: t.Integer({ minimum: 0 }),
          duration: t.String({ maxLength: 32 }),
          image: t.Union([t.String({ maxLength: 256 }), t.Null()]),
          status: t.Union([
            t.Literal("ACTIVE"),
            t.Literal("DRAFT"),
            t.Literal("SOLD_OUT"),
          ]),
          categoryId: t.String(),
        })
      ),
    }
  )

  .delete("/products/:id", async ({ params, set }) => {
    try {
      await prisma.product.delete({ where: { id: params.id } });
      return { ok: true };
    } catch (err: unknown) {
      if ((err as { code?: string }).code === "P2025") {
        set.status = 404;
        return { error: "PRODUCT_NOT_FOUND" };
      }
      throw err;
    }
  })

  // ---------- stock ----------
  .get("/stock/pools", async () => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        sku: true,
        name: true,
        _count: {
          select: {
            stock: {
              where: { soldAt: null },
            },
          },
        },
      },
    });
    const sold = await prisma.stockItem.groupBy({
      by: ["productId"],
      where: { soldAt: { not: null } },
      _count: { _all: true },
    });
    const soldMap = new Map(sold.map((s) => [s.productId, s._count._all]));
    return products.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      available: p._count.stock,
      sold: soldMap.get(p.id) ?? 0,
    }));
  })

  .post(
    "/stock",
    async ({ body, set }) => {
      const product = await prisma.product.findUnique({
        where: { id: body.productId },
      });
      if (!product) {
        set.status = 404;
        return { error: "PRODUCT_NOT_FOUND" };
      }

      const cleaned = Array.from(
        new Set(
          body.items
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        )
      );
      if (cleaned.length === 0) {
        set.status = 400;
        return { error: "NO_VALID_ITEMS" };
      }

      const result = await prisma.stockItem.createMany({
        data: cleaned.map((content) => ({
          productId: body.productId,
          content,
        })),
        skipDuplicates: true,
      });

      return {
        requested: body.items.length,
        unique: cleaned.length,
        inserted: result.count,
        skipped: cleaned.length - result.count,
      };
    },
    {
      body: t.Object({
        productId: t.String(),
        items: t.Array(t.String({ maxLength: 4096 })),
      }),
    }
  )

  // ---------- uploads ----------
  .post(
    "/uploads/category-icon",
    async ({ body, set }) => {
      const file = body.file;
      if (!file || typeof file === "string") {
        set.status = 400;
        return { error: "NO_FILE" };
      }
      const ext = ALLOWED_IMAGE_MIME[file.type];
      if (!ext) {
        set.status = 415;
        return { error: "UNSUPPORTED_TYPE", type: file.type };
      }
      if (file.size > MAX_ICON_BYTES) {
        set.status = 413;
        return { error: "FILE_TOO_LARGE", limit: MAX_ICON_BYTES };
      }

      await mkdir(CATEGORY_ICON_DIR, { recursive: true });
      const name = `${crypto.randomUUID()}.${ext}`;
      const fullPath = resolve(CATEGORY_ICON_DIR, name);
      await Bun.write(fullPath, file);

      const url = `/uploads/categories/${name}`;
      return { url };
    },
    {
      body: t.Object({ file: t.File() }),
    }
  )

  .post(
    "/uploads/product-image",
    async ({ body, set }) => {
      const file = body.file;
      if (!file || typeof file === "string") {
        set.status = 400;
        return { error: "NO_FILE" };
      }
      const ext = ALLOWED_IMAGE_MIME[file.type];
      if (!ext) {
        set.status = 415;
        return { error: "UNSUPPORTED_TYPE", type: file.type };
      }
      if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
        set.status = 413;
        return { error: "FILE_TOO_LARGE", limit: MAX_PRODUCT_IMAGE_BYTES };
      }

      await mkdir(PRODUCT_IMAGE_DIR, { recursive: true });
      const name = `${crypto.randomUUID()}.${ext}`;
      const fullPath = resolve(PRODUCT_IMAGE_DIR, name);
      await Bun.write(fullPath, file);

      const url = `/uploads/products/${name}`;
      return { url };
    },
    {
      body: t.Object({ file: t.File() }),
    }
  );