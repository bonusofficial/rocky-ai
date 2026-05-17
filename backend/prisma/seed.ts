import { prisma } from "../src/lib/prisma";

const CATEGORIES = [
  {
    slug: "cursor",
    name: "Cursor Unlimit",
    icon: "▶",
    description: "แพ็กเกจคีย์ Cursor หลายช่วงเวลา ใช้งานได้ทันทีหลังชำระเงิน",
  },
  {
    slug: "social",
    name: "Social Accounts",
    icon: "▣",
    description: "บัญชีโซเชียลพร้อมใช้งาน ผ่านการตรวจสอบเรียบร้อย",
  },
  {
    slug: "topup",
    name: "Top Up",
    icon: "▲",
    description: "เติมเงินเข้า platform ต่างๆ ได้รวดเร็ว",
  },
  {
    slug: "support",
    name: "Support",
    icon: "◆",
    description: "แพ็กเกจซัพพอร์ตและช่วยเหลือทีมงาน",
  },
];

type ProductSeed = {
  sku: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status?: "ACTIVE" | "DRAFT" | "SOLD_OUT";
  stockCount: number;
};

const PRODUCTS: Record<string, ProductSeed[]> = {
  cursor: [
    {
      sku: "CURSOR_1D",
      name: "Cursor Unlimit — 1 Day",
      description:
        "ใช้งาน Cursor AI แบบไม่จำกัด 1 วันเต็ม\nเหมาะสำหรับงานเร่งด่วนหรือลองใช้ก่อน",
      price: 30,
      duration: "1 day",
      stockCount: 12,
    },
    {
      sku: "CURSOR_7D",
      name: "Cursor Unlimit — 7 Days",
      description:
        "Cursor AI 7 วัน · คุ้มที่สุดสำหรับโปรเจคระยะสั้น\nรองรับ Claude Sonnet 4.6 และ GPT-5",
      price: 69,
      duration: "7 days",
      stockCount: 8,
    },
    {
      sku: "CURSOR_30D",
      name: "Cursor Unlimit — 30 Days",
      description:
        "Cursor AI เต็มเดือน · เหมาะสำหรับนักพัฒนามืออาชีพ\nรวม Claude Sonnet 4.6, Claude Opus 4.7, GPT-5",
      price: 199,
      duration: "30 days",
      stockCount: 15,
    },
    {
      sku: "CURSOR_60D",
      name: "Cursor Unlimit — 60 Days",
      description:
        "Cursor AI 2 เดือนเต็ม · ราคาคุ้มที่สุดต่อวัน\nรวมโมเดล premium ทุกตัว",
      price: 349,
      duration: "60 days",
      stockCount: 6,
    },
  ],
  social: [
    {
      sku: "SOCIAL_FB",
      name: "Facebook Account — Verified",
      description:
        "บัญชี Facebook ที่ผ่านการยืนยันตัวตน\nอายุบัญชี 6+ เดือน · พร้อมเพื่อนเริ่มต้น",
      price: 150,
      duration: "—",
      stockCount: 22,
    },
    {
      sku: "SOCIAL_IG",
      name: "Instagram Aged Account",
      description:
        "บัญชี Instagram อายุ 1+ ปี · มีโพสต์เริ่มต้น\nเหมาะสำหรับใช้งานทั่วไปและการตลาด",
      price: 220,
      duration: "—",
      stockCount: 10,
    },
    {
      sku: "SOCIAL_X",
      name: "X (Twitter) Verified",
      description:
        "บัญชี X ที่มี blue check\nพร้อมใช้งานสำหรับ branding หรือโปรเจคสำคัญ",
      price: 450,
      duration: "—",
      status: "DRAFT",
      stockCount: 0,
    },
  ],
  topup: [
    {
      sku: "TOPUP_STEAM_500",
      name: "Steam Wallet ฿500",
      description: "เติมเงิน Steam ฿500 บาท · ส่งโค้ดทันทีหลังชำระเงิน",
      price: 480,
      duration: "INSTANT",
      stockCount: 30,
    },
    {
      sku: "TOPUP_STEAM_1000",
      name: "Steam Wallet ฿1,000",
      description: "เติมเงิน Steam ฿1,000 บาท · ส่งโค้ดทันทีหลังชำระเงิน",
      price: 960,
      duration: "INSTANT",
      stockCount: 18,
    },
  ],
  support: [
    {
      sku: "SUPPORT_PRIORITY",
      name: "Priority Support 30 Days",
      description: "ติดต่อทีมงานได้ตลอด 24 ชม. · ตอบกลับภายใน 15 นาที",
      price: 99,
      duration: "30 days",
      stockCount: 50,
    },
  ],
};

function genStockKey(sku: string, n: number): string {
  const segs = [
    sku,
    Math.random().toString(36).slice(2, 6).toUpperCase(),
    Math.random().toString(36).slice(2, 6).toUpperCase(),
    Math.random().toString(36).slice(2, 6).toUpperCase(),
    String(n).padStart(4, "0"),
  ];
  return segs.join("-");
}

async function main() {
  console.log("→ seeding categories...");
  const categoryMap = new Map<string, string>();
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        icon: c.icon,
        description: c.description,
        position: i,
      },
      create: {
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        description: c.description,
        position: i,
      },
    });
    categoryMap.set(c.slug, cat.id);
    console.log(`  ✓ ${c.slug} (${cat.id})`);
  }

  console.log("→ seeding products + stock...");
  let productCount = 0;
  let stockCount = 0;

  for (const [slug, list] of Object.entries(PRODUCTS)) {
    const categoryId = categoryMap.get(slug);
    if (!categoryId) continue;

    for (const p of list) {
      const product = await prisma.product.upsert({
        where: { sku: p.sku },
        update: {
          name: p.name,
          description: p.description,
          price: p.price,
          duration: p.duration,
          status: p.status ?? "ACTIVE",
          categoryId,
        },
        create: {
          sku: p.sku,
          name: p.name,
          description: p.description,
          price: p.price,
          duration: p.duration,
          status: p.status ?? "ACTIVE",
          categoryId,
        },
      });
      productCount++;

      if (p.stockCount > 0) {
        const items = Array.from({ length: p.stockCount }, (_, n) => ({
          productId: product.id,
          content: genStockKey(p.sku, n + 1),
        }));
        const result = await prisma.stockItem.createMany({
          data: items,
          skipDuplicates: true,
        });
        stockCount += result.count;
        console.log(
          `  ✓ ${p.sku} (฿${p.price}) · stock +${result.count}/${p.stockCount}`
        );
      } else {
        console.log(`  ✓ ${p.sku} (฿${p.price}) · stock —`);
      }
    }
  }

  console.log(
    `\n✓ done · ${CATEGORIES.length} categories · ${productCount} products · ${stockCount} stock items`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("seed failed:", err);
    process.exit(1);
  });
