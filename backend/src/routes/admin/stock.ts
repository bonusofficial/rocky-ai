import { Elysia, t } from "elysia";
import { prisma } from "../../lib/prisma";

export const stockAdminRoutes = new Elysia()
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
  );
