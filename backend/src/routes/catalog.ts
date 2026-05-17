import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";

/**
 * Public catalog routes — used by the storefront.
 * No auth required.
 */
export const catalogRoutes = new Elysia()

  .get("/categories", async () => {
    const categories = await prisma.category.findMany({
      where: { visible: true },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      include: {
        _count: {
          select: { products: { where: { status: "ACTIVE" } } },
        },
      },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      description: c.description,
      productCount: c._count.products,
    }));
  })

  .get(
    "/products",
    async ({ query }) => {
      const where: {
        status: "ACTIVE";
        category?: { slug: string };
      } = { status: "ACTIVE" };

      if (query.category) {
        where.category = { slug: query.category };
      }

      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, slug: true, name: true } },
          _count: {
            select: { stock: { where: { soldAt: null } } },
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
      }));
    },
    {
      query: t.Object({
        category: t.Optional(t.String()),
      }),
    }
  )

  .get("/products/:idOrSku", async ({ params, set }) => {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.idOrSku }, { sku: params.idOrSku }],
        status: "ACTIVE",
      },
      include: {
        category: { select: { id: true, slug: true, name: true } },
        _count: { select: { stock: { where: { soldAt: null } } } },
      },
    });
    if (!product) {
      set.status = 404;
      return { error: "PRODUCT_NOT_FOUND" };
    }
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      duration: product.duration,
      image: product.image,
      status: product.status,
      category: product.category,
      availableStock: product._count.stock,
    };
  });