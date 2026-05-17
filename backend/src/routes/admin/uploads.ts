import { Elysia, t } from "elysia";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";

const UPLOADS_ROOT = resolve(import.meta.dir, "..", "..", "..", "uploads");
const CATEGORY_ICON_DIR = resolve(UPLOADS_ROOT, "categories");
const PRODUCT_IMAGE_DIR = resolve(UPLOADS_ROOT, "products");
const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};
const MAX_ICON_BYTES = 2 * 1024 * 1024;
const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;

export const uploadAdminRoutes = new Elysia()
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
