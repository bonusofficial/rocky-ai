import { Elysia, t } from "elysia";
import { prisma } from "../../lib/prisma";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const categoryAdminRoutes = new Elysia()
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
  );
