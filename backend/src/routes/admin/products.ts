import { Elysia, t } from "elysia";
import { prisma } from "../../lib/prisma";

export const productAdminRoutes = new Elysia()
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
  });
