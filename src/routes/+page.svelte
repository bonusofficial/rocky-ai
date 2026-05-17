<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<div class="min-h-screen bg-background relative overflow-hidden">
  <Navbar />
  <section
    class="container relative py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center"
  >
    <div class="space-y-6 relative z-10">
      <div
        class="inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 font-pixel text-[9px] bg-muted text-foreground border border-border rounded-none px-3 py-1"
      >
        <span class="blink mr-2">▶</span> CURSOR UNLIMIT ACCESS
      </div>
      <h1 class="font-pixel text-2xl md:text-4xl leading-relaxed text-glow">
        CURSOR<br /><span class="text-muted-foreground text-xl md:text-3xl"
          >AI CODE</span
        ><br />EDITOR<span class="blink">_</span>
      </h1>
      <p
        class="font-mono text-sm text-muted-foreground max-w-md leading-relaxed"
      >
        &gt; เปิดใช้ Cursor Unlimit ในราคาเริ่มต้นเพียง ฿30<br />&gt;
        ส่งคีย์เปิดใช้งานทันที 24/7<br />&gt; รับประกันการใช้งานเต็มระยะเวลา
      </p>
      <div class="flex flex-wrap gap-4 pt-2">
        <button
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-primary/90 h-11 px-8 font-pixel text-[11px] rounded-none shadow-pixel hover:shadow-glow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-primary text-primary-foreground"
        >
          VIEW PRICING ▶</button
        ><button
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-background hover:bg-accent h-11 px-8 font-pixel text-[11px] rounded-none border-2 border-foreground/30 hover:border-primary hover:text-primary"
        >
          HOW IT WORKS
        </button>
      </div>
      <div class="flex gap-8 pt-6 border-t border-border">
        <div>
          <div class="font-pixel text-lg text-primary text-glow">10K+</div>
          <div class="font-mono text-[10px] text-muted-foreground mt-1">
            KEYS SOLD
          </div>
        </div>
        <div>
          <div class="font-pixel text-lg text-primary text-glow">24/7</div>
          <div class="font-mono text-[10px] text-muted-foreground mt-1">
            DELIVERY
          </div>
        </div>
        <div>
          <div class="font-pixel text-lg text-primary text-glow">99%</div>
          <div class="font-mono text-[10px] text-muted-foreground mt-1">
            UPTIME
          </div>
        </div>
      </div>
    </div>
    <div class="relative float-pixel">
      <div class="absolute inset-0 bg-gradient-arcade blur-3xl"></div>
      <img
        src="/icon.png"
        alt="Rocky AI pixel robot mascot"
        width="512"
        height="512"
        class="relative w-full max-w-sm mx-auto"
        style="image-rendering: pixelated"
      />
    </div>
  </section>
  <section id="pricing" class="container py-16 space-y-10">
    <div class="text-center space-y-3">
      <div class="font-mono text-[11px] text-muted-foreground">
        // SELECT_PLAN
      </div>
      <h2 class="font-pixel text-xl md:text-2xl text-glow">CHOOSE_DURATION</h2>
      <p class="font-mono text-xs text-muted-foreground">
        เลือกระยะเวลาใช้งาน Cursor Unlimit ที่เหมาะกับคุณ
      </p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      <div
        class="text-card-foreground shadow-sm relative bg-card border-2 rounded-none p-6 cursor-pointer transition-all overflow-hidden group border-border hover:border-primary/60 hover:-translate-y-1"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-arcade opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"
        ></div>
        <div class="relative space-y-5">
          <div class="flex items-center gap-2">
            <div
              class="w-4 h-4 border-2 border-border flex items-center justify-center"
            ></div>
            <img
              src="/assets/cursor-icon-BUQ3TQKm.webp"
              alt="Cursor"
              width="20"
              height="20"
              class="w-5 h-5"
              loading="lazy"
            /><span class="font-mono text-[10px] text-muted-foreground"
              >[ CURSOR UNLIMIT ]</span
            >
          </div>
          <div>
            <h3 class="font-pixel text-sm leading-relaxed">1 DAY</h3>
            <div class="font-mono text-[10px] text-muted-foreground mt-2">
              ฿30 / day
            </div>
          </div>
          <div class="pt-4 border-t border-border">
            <div class="font-mono text-[9px] text-muted-foreground">PRICE</div>
            <div class="font-pixel text-2xl text-glow mt-1">฿30</div>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-muted text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground"
          >
            BUY NOW ▶
          </button>
        </div>
      </div>
      <div
        class="text-card-foreground shadow-sm relative bg-card border-2 rounded-none p-6 cursor-pointer transition-all overflow-hidden group border-border hover:border-primary/60 hover:-translate-y-1"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-arcade opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"
        ></div>
        <div class="relative space-y-5">
          <div class="flex items-center gap-2">
            <div
              class="w-4 h-4 border-2 border-border flex items-center justify-center"
            ></div>
            <img
              src="/assets/cursor-icon-BUQ3TQKm.webp"
              alt="Cursor"
              width="20"
              height="20"
              class="w-5 h-5"
              loading="lazy"
            /><span class="font-mono text-[10px] text-muted-foreground"
              >[ CURSOR UNLIMIT ]</span
            >
          </div>
          <div>
            <h3 class="font-pixel text-sm leading-relaxed">7 DAYS</h3>
            <div class="font-mono text-[10px] text-muted-foreground mt-2">
              ฿28.5/day
            </div>
          </div>
          <div class="pt-4 border-t border-border">
            <div class="font-mono text-[9px] text-muted-foreground">PRICE</div>
            <div class="font-pixel text-2xl text-glow mt-1">฿200</div>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-muted text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground"
          >
            BUY NOW ▶
          </button>
        </div>
      </div>
      <div
        class="text-card-foreground shadow-sm relative bg-card border-2 rounded-none p-6 cursor-pointer transition-all overflow-hidden group border-primary shadow-pixel -translate-y-1"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-arcade opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"
        ></div>
        <div
          class="inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 absolute top-3 right-3 font-pixel text-[8px] rounded-none px-2 py-1 z-10 bg-primary text-primary-foreground"
        >
          BEST VALUE
        </div>
        <div class="relative space-y-5">
          <div class="flex items-center gap-2">
            <div
              class="w-4 h-4 border-2 bg-primary border-primary flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-check w-3 h-3 text-primary-foreground"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>
            <img
              src="/assets/cursor-icon-BUQ3TQKm.webp"
              alt="Cursor"
              width="20"
              height="20"
              class="w-5 h-5"
              loading="lazy"
            /><span class="font-mono text-[10px] text-muted-foreground"
              >[ CURSOR UNLIMIT ]</span
            >
          </div>
          <div>
            <h3 class="font-pixel text-sm leading-relaxed">30 DAYS</h3>
            <div class="font-mono text-[10px] text-muted-foreground mt-2">
              ฿10/day
            </div>
          </div>
          <div class="pt-4 border-t border-border">
            <div class="font-mono text-[9px] text-muted-foreground">PRICE</div>
            <div class="font-pixel text-2xl text-glow mt-1">฿300</div>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-muted text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground"
          >
            BUY NOW ▶
          </button>
        </div>
      </div>
      <div
        class="text-card-foreground shadow-sm relative bg-card border-2 rounded-none p-6 cursor-pointer transition-all overflow-hidden group border-border hover:border-primary/60 hover:-translate-y-1"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-arcade opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"
        ></div>
        <div
          class="inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 absolute top-3 right-3 font-pixel text-[8px] rounded-none px-2 py-1 z-10 bg-primary text-primary-foreground"
        >
          POPULAR
        </div>
        <div class="relative space-y-5">
          <div class="flex items-center gap-2">
            <div
              class="w-4 h-4 border-2 border-border flex items-center justify-center"
            ></div>
            <img
              src="/assets/cursor-icon-BUQ3TQKm.webp"
              alt="Cursor"
              width="20"
              height="20"
              class="w-5 h-5"
              loading="lazy"
            /><span class="font-mono text-[10px] text-muted-foreground"
              >[ CURSOR UNLIMIT ]</span
            >
          </div>
          <div>
            <h3 class="font-pixel text-sm leading-relaxed">60 DAYS</h3>
            <div class="font-mono text-[10px] text-muted-foreground mt-2">
              ฿8.3/day
            </div>
          </div>
          <div class="pt-4 border-t border-border">
            <div class="font-mono text-[9px] text-muted-foreground">PRICE</div>
            <div class="font-pixel text-2xl text-glow mt-1">฿500</div>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-muted text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground"
          >
            BUY NOW ▶
          </button>
        </div>
      </div>
    </div>
  </section>
  <section
    id="accounts"
    class="container py-16 space-y-10 border-t border-border"
  >
    <div class="text-center space-y-3">
      <div class="font-mono text-[11px] text-muted-foreground">
        // SOCIAL_INVENTORY
      </div>
      <h2 class="font-pixel text-xl md:text-2xl text-glow">ACCOUNTS_SHOP</h2>
      <p class="font-mono text-xs text-muted-foreground">
        เลือกประเภทบัญชี กำหนดจำนวน 1–9999 ส่งทันทีหลังชำระเงิน
      </p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      <div
        class="text-card-foreground shadow-sm relative bg-card border-2 border-border rounded-none p-6 hover:border-primary transition-all overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-arcade opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"
        ></div>
        <div class="relative space-y-5">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-muted border-2 border-primary flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-facebook w-5 h-5 text-primary"
              >
                <path
                  d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                ></path>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="font-pixel text-[11px] text-glow truncate">
                FACEBOOK ACCOUNT
              </div>
              <div
                class="font-mono text-[9px] text-muted-foreground mt-1 truncate"
              >
                Verified • Cookies + Token
              </div>
            </div>
          </div>
          <div class="border-t border-border pt-3">
            <div class="font-mono text-[9px] text-muted-foreground">
              PRICE / ACCOUNT
            </div>
            <div class="font-pixel text-xl text-glow mt-1">฿25</div>
          </div>
          <div class="space-y-2">
            <label class="font-pixel text-[9px] text-muted-foreground"
              >// QUANTITY (1–9999)</label
            >
            <div
              class="flex items-stretch border-2 border-border bg-background"
            >
              <button
                type="button"
                class="px-2 hover:bg-primary hover:text-primary-foreground transition-colors border-r-2 border-border"
                aria-label="decrease"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-minus w-3 h-3"
                >
                  <path d="M5 12h14"></path>
                </svg></button
              ><input
                type="number"
                class="flex w-full border-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-none border-0 bg-background font-mono text-sm text-center focus-visible:ring-0 h-10 [appearance:textfield] [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:appearance-none"
                min="1"
                max="9999"
                value="1"
              /><button
                type="button"
                class="px-2 hover:bg-primary hover:text-primary-foreground transition-colors border-l-2 border-border"
                aria-label="increase"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-plus w-3 h-3"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
            <div class="grid grid-cols-4 gap-1">
              <button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                10</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                50</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                100</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                500
              </button>
            </div>
          </div>
          <div
            class="flex items-center justify-between border-t border-border pt-3"
          >
            <span class="font-mono text-[10px] text-muted-foreground"
              >TOTAL</span
            ><span class="font-pixel text-base text-glow">฿25</span>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-primary text-primary-foreground hover:bg-primary-glow"
          >
            BUY NOW ▶
          </button>
        </div>
      </div>
      <div
        class="text-card-foreground shadow-sm relative bg-card border-2 border-border rounded-none p-6 hover:border-primary transition-all overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-arcade opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"
        ></div>
        <div class="relative space-y-5">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-muted border-2 border-primary flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-instagram w-5 h-5 text-primary"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                ></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="font-pixel text-[11px] text-glow truncate">
                INSTAGRAM ACCOUNT
              </div>
              <div
                class="font-mono text-[9px] text-muted-foreground mt-1 truncate"
              >
                Aged • Email + 2FA
              </div>
            </div>
          </div>
          <div class="border-t border-border pt-3">
            <div class="font-mono text-[9px] text-muted-foreground">
              PRICE / ACCOUNT
            </div>
            <div class="font-pixel text-xl text-glow mt-1">฿20</div>
          </div>
          <div class="space-y-2">
            <label class="font-pixel text-[9px] text-muted-foreground"
              >// QUANTITY (1–9999)</label
            >
            <div
              class="flex items-stretch border-2 border-border bg-background"
            >
              <button
                type="button"
                class="px-2 hover:bg-primary hover:text-primary-foreground transition-colors border-r-2 border-border"
                aria-label="decrease"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-minus w-3 h-3"
                >
                  <path d="M5 12h14"></path>
                </svg></button
              ><input
                type="number"
                class="flex w-full border-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-none border-0 bg-background font-mono text-sm text-center focus-visible:ring-0 h-10 [appearance:textfield] [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:appearance-none"
                min="1"
                max="9999"
                value="1"
              /><button
                type="button"
                class="px-2 hover:bg-primary hover:text-primary-foreground transition-colors border-l-2 border-border"
                aria-label="increase"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-plus w-3 h-3"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
            <div class="grid grid-cols-4 gap-1">
              <button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                10</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                50</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                100</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                500
              </button>
            </div>
          </div>
          <div
            class="flex items-center justify-between border-t border-border pt-3"
          >
            <span class="font-mono text-[10px] text-muted-foreground"
              >TOTAL</span
            ><span class="font-pixel text-base text-glow">฿20</span>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-primary text-primary-foreground hover:bg-primary-glow"
          >
            BUY NOW ▶
          </button>
        </div>
      </div>
      <div
        class="text-card-foreground shadow-sm relative bg-card border-2 border-border rounded-none p-6 hover:border-primary transition-all overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-arcade opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"
        ></div>
        <div class="relative space-y-5">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-muted border-2 border-primary flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-music2 w-5 h-5 text-primary"
              >
                <circle cx="8" cy="18" r="4"></circle>
                <path d="M12 18V2l7 4"></path>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="font-pixel text-[11px] text-glow truncate">
                TIKTOK ACCOUNT
              </div>
              <div
                class="font-mono text-[9px] text-muted-foreground mt-1 truncate"
              >
                Fresh • Region MIX
              </div>
            </div>
          </div>
          <div class="border-t border-border pt-3">
            <div class="font-mono text-[9px] text-muted-foreground">
              PRICE / ACCOUNT
            </div>
            <div class="font-pixel text-xl text-glow mt-1">฿18</div>
          </div>
          <div class="space-y-2">
            <label class="font-pixel text-[9px] text-muted-foreground"
              >// QUANTITY (1–9999)</label
            >
            <div
              class="flex items-stretch border-2 border-border bg-background"
            >
              <button
                type="button"
                class="px-2 hover:bg-primary hover:text-primary-foreground transition-colors border-r-2 border-border"
                aria-label="decrease"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-minus w-3 h-3"
                >
                  <path d="M5 12h14"></path>
                </svg></button
              ><input
                type="number"
                class="flex w-full border-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-none border-0 bg-background font-mono text-sm text-center focus-visible:ring-0 h-10 [appearance:textfield] [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:appearance-none"
                min="1"
                max="9999"
                value="1"
              /><button
                type="button"
                class="px-2 hover:bg-primary hover:text-primary-foreground transition-colors border-l-2 border-border"
                aria-label="increase"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-plus w-3 h-3"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
            <div class="grid grid-cols-4 gap-1">
              <button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                10</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                50</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                100</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                500
              </button>
            </div>
          </div>
          <div
            class="flex items-center justify-between border-t border-border pt-3"
          >
            <span class="font-mono text-[10px] text-muted-foreground"
              >TOTAL</span
            ><span class="font-pixel text-base text-glow">฿18</span>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-primary text-primary-foreground hover:bg-primary-glow"
          >
            BUY NOW ▶
          </button>
        </div>
      </div>
      <div
        class="text-card-foreground shadow-sm relative bg-card border-2 border-border rounded-none p-6 hover:border-primary transition-all overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-arcade opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"
        ></div>
        <div class="relative space-y-5">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-muted border-2 border-primary flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-at-sign w-5 h-5 text-primary"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"></path>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="font-pixel text-[11px] text-glow truncate">
                HOTMAIL / OUTLOOK
              </div>
              <div
                class="font-mono text-[9px] text-muted-foreground mt-1 truncate"
              >
                POP3 / IMAP Enabled
              </div>
            </div>
          </div>
          <div class="border-t border-border pt-3">
            <div class="font-mono text-[9px] text-muted-foreground">
              PRICE / ACCOUNT
            </div>
            <div class="font-pixel text-xl text-glow mt-1">฿8</div>
          </div>
          <div class="space-y-2">
            <label class="font-pixel text-[9px] text-muted-foreground"
              >// QUANTITY (1–9999)</label
            >
            <div
              class="flex items-stretch border-2 border-border bg-background"
            >
              <button
                type="button"
                class="px-2 hover:bg-primary hover:text-primary-foreground transition-colors border-r-2 border-border"
                aria-label="decrease"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-minus w-3 h-3"
                >
                  <path d="M5 12h14"></path>
                </svg></button
              ><input
                type="number"
                class="flex w-full border-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-none border-0 bg-background font-mono text-sm text-center focus-visible:ring-0 h-10 [appearance:textfield] [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:appearance-none"
                min="1"
                max="9999"
                value="1"
              /><button
                type="button"
                class="px-2 hover:bg-primary hover:text-primary-foreground transition-colors border-l-2 border-border"
                aria-label="increase"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-plus w-3 h-3"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
            <div class="grid grid-cols-4 gap-1">
              <button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                10</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                50</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                100</button
              ><button
                type="button"
                class="font-pixel text-[8px] py-1 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                500
              </button>
            </div>
          </div>
          <div
            class="flex items-center justify-between border-t border-border pt-3"
          >
            <span class="font-mono text-[10px] text-muted-foreground"
              >TOTAL</span
            ><span class="font-pixel text-base text-glow">฿8</span>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-primary text-primary-foreground hover:bg-primary-glow"
          >
            BUY NOW ▶
          </button>
        </div>
      </div>
    </div>
  </section>
  <section id="features" class="container py-20 border-t border-border">
    <div class="text-center mb-12">
      <div class="font-mono text-[11px] text-muted-foreground mb-2">
        // WHY_ROCKY
      </div>
      <h2 class="font-pixel text-xl md:text-2xl text-glow">WHAT_YOU_GET</h2>
    </div>
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div
        class="bg-card border-2 border-border p-8 hover:border-primary transition-colors"
      >
        <div
          class="w-12 h-12 bg-muted border-2 border-primary flex items-center justify-center mb-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-zap w-5 h-5 text-primary"
          >
            <path
              d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
            ></path>
          </svg>
        </div>
        <h3 class="font-pixel text-sm text-glow mb-3">INSTANT</h3>
        <p class="font-mono text-xs text-muted-foreground leading-relaxed">
          ส่งคีย์อัตโนมัติทันทีหลังชำระเงินภายใน 60 วินาที
        </p>
      </div>
      <div
        class="bg-card border-2 border-border p-8 hover:border-primary transition-colors"
      >
        <div
          class="w-12 h-12 bg-muted border-2 border-primary flex items-center justify-center mb-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-shield w-5 h-5 text-primary"
          >
            <path
              d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
            ></path>
          </svg>
        </div>
        <h3 class="font-pixel text-sm text-glow mb-3">GUARANTEE</h3>
        <p class="font-mono text-xs text-muted-foreground leading-relaxed">
          รับประกันใช้งานได้เต็มระยะเวลา ถ้ามีปัญหาเปลี่ยนคีย์ฟรี
        </p>
      </div>
      <div
        class="bg-card border-2 border-border p-8 hover:border-primary transition-colors"
      >
        <div
          class="w-12 h-12 bg-muted border-2 border-primary flex items-center justify-center mb-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-clock w-5 h-5 text-primary"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3 class="font-pixel text-sm text-glow mb-3">24/7 SUPPORT</h3>
        <p class="font-mono text-xs text-muted-foreground leading-relaxed">
          ทีมงานพร้อมช่วยเหลือตลอด 24 ชั่วโมงทุกวัน
        </p>
      </div>
    </div>
  </section>
  <section class="container py-20 border-t border-border">
    <div class="text-center mb-12">
      <div class="font-mono text-[11px] text-muted-foreground mb-2">
        // 03_STEPS
      </div>
      <h2 class="font-pixel text-xl md:text-2xl text-glow">HOW_IT_WORKS</h2>
    </div>
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div
        class="bg-card border-2 border-border p-8 relative hover:border-primary transition-colors"
      >
        <div class="font-pixel text-4xl text-primary/20 absolute top-4 right-4">
          01
        </div>
        <h3 class="font-pixel text-sm text-glow mb-4">SELECT</h3>
        <p class="font-mono text-xs text-muted-foreground leading-relaxed">
          เลือกแพ็กเกจระยะเวลาที่ต้องการ
        </p>
      </div>
      <div
        class="bg-card border-2 border-border p-8 relative hover:border-primary transition-colors"
      >
        <div class="font-pixel text-4xl text-primary/20 absolute top-4 right-4">
          02
        </div>
        <h3 class="font-pixel text-sm text-glow mb-4">PAY</h3>
        <p class="font-mono text-xs text-muted-foreground leading-relaxed">
          ชำระเงินผ่าน PromptPay / TrueMoney
        </p>
      </div>
      <div
        class="bg-card border-2 border-border p-8 relative hover:border-primary transition-colors"
      >
        <div class="font-pixel text-4xl text-primary/20 absolute top-4 right-4">
          03
        </div>
        <h3 class="font-pixel text-sm text-glow mb-4">RECEIVE</h3>
        <p class="font-mono text-xs text-muted-foreground leading-relaxed">
          รับคีย์ Cursor ทันทีทางอีเมล
        </p>
      </div>
    </div>
  </section>
  <Footer />
</div>
