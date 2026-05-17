<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import DashboardNav from '$lib/components/DashboardNav.svelte';

  type Status = 'OK' | 'PENDING' | 'FAIL';

  interface Order {
    id: string;
    date: string;
    time: string;
    product: string;
    productLabel: string;
    amount: number;
    status: Status;
    key: string;
    method: string;
    duration?: string;
  }

  const orders: Order[] = [
    {
      id: 'TXN-20260509-0042',
      date: '2026-05-09',
      time: '14:32:18',
      product: 'CURSOR_30D',
      productLabel: 'Cursor Unlimit — 30 Days',
      amount: 199,
      status: 'OK',
      key: 'CURSOR-30D-9F4A-7B2K-PX8M-LQR3',
      method: 'TRUEMONEY',
      duration: '21 days remaining'
    },
    {
      id: 'TXN-20260507-0041',
      date: '2026-05-07',
      time: '09:05:44',
      product: 'CURSOR_7D',
      productLabel: 'Cursor Unlimit — 7 Days',
      amount: 69,
      status: 'OK',
      key: 'CURSOR-7D-R34A-1K8X-VCN2-BTY9',
      method: 'PROMPTPAY',
      duration: 'EXPIRED'
    },
    {
      id: 'TXN-20260506-0040',
      date: '2026-05-06',
      time: '22:11:07',
      product: 'CURSOR_60D',
      productLabel: 'Cursor Unlimit — 60 Days',
      amount: 349,
      status: 'PENDING',
      key: '—',
      method: 'BANK_TRANSFER'
    },
    {
      id: 'TXN-20260428-0038',
      date: '2026-04-28',
      time: '18:44:02',
      product: 'CURSOR_7D',
      productLabel: 'Cursor Unlimit — 7 Days',
      amount: 69,
      status: 'OK',
      key: 'CURSOR-7D-MT4N-66XZ-JK2F-QWE8',
      method: 'PROMPTPAY',
      duration: 'EXPIRED'
    },
    {
      id: 'TXN-20260420-0031',
      date: '2026-04-20',
      time: '11:20:55',
      product: 'SOCIAL_FB',
      productLabel: 'Facebook Account — Verified',
      amount: 150,
      status: 'OK',
      key: 'FB-ACC-IG83-9X7V-RTY0',
      method: 'TRUEMONEY'
    },
    {
      id: 'TXN-20260412-0025',
      date: '2026-04-12',
      time: '08:58:31',
      product: 'CURSOR_1D',
      productLabel: 'Cursor Unlimit — 1 Day',
      amount: 30,
      status: 'FAIL',
      key: '—',
      method: 'PROMPTPAY'
    }
  ];

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'OK', label: 'COMPLETED' },
    { id: 'PENDING', label: 'PENDING' },
    { id: 'FAIL', label: 'FAILED' }
  ] as const;

  let activeFilter = $state<'all' | Status>('all');
  let search = $state('');
  let expanded = $state<Record<string, boolean>>({});
  let copied = $state<string | null>(null);

  const visibleOrders = $derived(
    orders.filter((o) => {
      if (activeFilter !== 'all' && o.status !== activeFilter) return false;
      if (
        search &&
        !`${o.id} ${o.productLabel}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
  );

  const totals = $derived({
    spent: orders
      .filter((o) => o.status === 'OK')
      .reduce((s, o) => s + o.amount, 0),
    count: orders.length,
    active: orders.filter((o) => o.duration && o.duration.includes('remaining'))
      .length
  });

  function toggle(id: string) {
    expanded[id] = !expanded[id];
  }

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied = id;
      setTimeout(() => {
        if (copied === id) copied = null;
      }, 1500);
    } catch {
      copied = null;
    }
  }

  function statusClass(s: Status) {
    switch (s) {
      case 'OK':
        return 'bg-primary text-primary-foreground';
      case 'PENDING':
        return 'bg-muted text-foreground';
      case 'FAIL':
        return 'bg-destructive text-background';
    }
  }

  function resetFilters() {
    activeFilter = 'all';
    search = '';
  }
</script>

<svelte:head>
  <title>Order History — Rocky AI</title>
  <meta
    name="description"
    content="ประวัติคำสั่งซื้อ คีย์ และใบเสร็จทั้งหมดของคุณที่ Rocky AI"
  />
</svelte:head>

<div class="min-h-screen bg-background relative overflow-hidden">
  <Navbar />

  <section class="container relative py-10 md:py-14 space-y-8">
    <!-- page header -->
    <header class="space-y-4">
      <div class="font-mono text-[11px] text-muted-foreground">// TRANSACTION_LOG</div>
      <h1 class="font-pixel text-xl md:text-3xl leading-relaxed text-glow">
        ORDER<br />
        <span class="text-muted-foreground text-lg md:text-2xl">HISTORY</span><span
          class="blink">_</span
        >
      </h1>
      <p class="font-mono text-sm text-muted-foreground max-w-xl leading-relaxed">
        &gt; เช็คสถานะคำสั่งซื้อ ดาวน์โหลดคีย์ และตรวจสอบใบเสร็จทั้งหมดของคุณ
      </p>
    </header>

    <DashboardNav current="history" />

    <!-- totals -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <div class="border-2 border-border bg-card p-4 md:p-5 shadow-pixel">
        <div class="font-mono text-[10px] text-muted-foreground">// TOTAL_SPENT</div>
        <div class="font-pixel text-lg md:text-xl text-glow mt-2">
          ฿{totals.spent.toLocaleString()}
        </div>
      </div>
      <div class="border-2 border-border bg-card p-4 md:p-5 shadow-pixel">
        <div class="font-mono text-[10px] text-muted-foreground">// ORDERS</div>
        <div class="font-pixel text-lg md:text-xl text-glow mt-2">{totals.count}</div>
      </div>
      <div class="border-2 border-border bg-card p-4 md:p-5 shadow-pixel">
        <div class="font-mono text-[10px] text-muted-foreground">// ACTIVE_KEYS</div>
        <div class="font-pixel text-lg md:text-xl text-glow mt-2">{totals.active}</div>
      </div>
    </div>

    <!-- filters + search -->
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2">
        {#each filters as f (f.id)}
          <button
            type="button"
            onclick={() => (activeFilter = f.id as 'all' | Status)}
            class="h-9 px-3 md:px-4 font-pixel text-[9px] md:text-[10px] border-2 border-border transition-colors {activeFilter ===
            f.id
              ? 'bg-primary text-primary-foreground shadow-pixel'
              : 'bg-card text-muted-foreground hover:text-primary hover:border-primary'}"
          >
            {f.label}
          </button>
        {/each}
      </div>

      <div class="relative max-w-md">
        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted-foreground pointer-events-none"
          aria-hidden="true"
        >
          &gt;
        </span>
        <input
          type="text"
          bind:value={search}
          placeholder="SEARCH_ID_OR_PRODUCT..."
          class="w-full h-10 pl-7 pr-3 border-2 border-border bg-background font-mono text-[12px] rounded-none focus:border-primary focus:outline-none"
        />
      </div>
    </div>

    <!-- log table -->
    <div class="border-2 border-border bg-card shadow-pixel">
      <!-- desktop column header -->
      <div
        class="hidden md:grid grid-cols-[120px,1fr,160px,90px,110px,32px] gap-3 px-4 py-3 border-b-2 border-border font-pixel text-[9px] text-muted-foreground"
      >
        <span>TIMESTAMP</span>
        <span>ORDER_ID · PRODUCT</span>
        <span>METHOD</span>
        <span>AMOUNT</span>
        <span>STATUS</span>
        <span></span>
      </div>

      {#if visibleOrders.length === 0}
        <div class="px-6 py-16 text-center space-y-3">
          <div class="font-pixel text-xs text-muted-foreground">&gt; NO_RECORDS_FOUND</div>
          <p class="font-mono text-[11px] text-muted-foreground">
            ยังไม่มีคำสั่งซื้อที่ตรงกับตัวกรองนี้
          </p>
          <button
            type="button"
            onclick={resetFilters}
            class="h-9 px-4 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground"
          >
            RESET_FILTERS ▶
          </button>
        </div>
      {:else}
        <ul class="divide-y divide-border">
          {#each visibleOrders as o (o.id)}
            <li>
              <button
                type="button"
                onclick={() => toggle(o.id)}
                class="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors"
                aria-expanded={!!expanded[o.id]}
                aria-controls={`row-${o.id}`}
              >
                <!-- mobile row -->
                <div class="md:hidden space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-muted-foreground text-[10px] font-mono">
                      [{o.date} {o.time}]
                    </span>
                    <span
                      class="font-pixel text-[9px] px-2 py-1 border border-border {statusClass(
                        o.status
                      )}"
                    >
                      {o.status}
                    </span>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="min-w-0 flex-1 truncate">
                      <span class="font-pixel text-[9px] text-foreground">{o.product}</span>
                      <span class="block font-mono text-[10px] text-muted-foreground mt-0.5 truncate">
                        #{o.id}
                      </span>
                    </span>
                    <span class="font-pixel text-[11px] flex-shrink-0">฿{o.amount}</span>
                  </div>
                </div>

                <!-- desktop row -->
                <div
                  class="hidden md:grid grid-cols-[120px,1fr,160px,90px,110px,32px] gap-3 items-center"
                >
                  <span class="text-muted-foreground text-[10px] leading-tight font-mono">
                    {o.date}<br /><span class="text-[9px]">{o.time}</span>
                  </span>
                  <span class="truncate">
                    <span class="font-mono text-muted-foreground text-[10px]">#{o.id}</span>
                    <span class="block font-pixel text-[9px] text-foreground mt-0.5">
                      {o.product}
                    </span>
                  </span>
                  <span class="font-mono text-muted-foreground text-[10px]">{o.method}</span>
                  <span class="font-pixel text-[10px]">฿{o.amount}</span>
                  <span
                    class="font-pixel text-[9px] px-2 py-1 border border-border w-fit {statusClass(
                      o.status
                    )}"
                  >
                    {o.status}
                  </span>
                  <span
                    class="grid place-items-center text-muted-foreground transition-transform {expanded[
                      o.id
                    ]
                      ? 'rotate-180'
                      : ''}"
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </div>
              </button>

              {#if expanded[o.id]}
                <div
                  id={`row-${o.id}`}
                  class="border-t border-border bg-background/60 px-4 py-4 grid md:grid-cols-2 gap-4 font-mono text-[11px]"
                >
                  <div class="space-y-3">
                    <div>
                      <div class="font-pixel text-[9px] text-muted-foreground">// PRODUCT</div>
                      <div class="mt-1">{o.productLabel}</div>
                    </div>
                    <div>
                      <div class="font-pixel text-[9px] text-muted-foreground">// METHOD</div>
                      <div class="mt-1">{o.method}</div>
                    </div>
                    {#if o.duration}
                      <div>
                        <div class="font-pixel text-[9px] text-muted-foreground">
                          // STATUS_DETAIL
                        </div>
                        <div class="mt-1">{o.duration}</div>
                      </div>
                    {/if}
                  </div>

                  <div class="space-y-3">
                    <div>
                      <div class="font-pixel text-[9px] text-muted-foreground">// LICENSE_KEY</div>
                      <div class="mt-1 flex items-center gap-2">
                        <code
                          class="flex-1 h-10 px-3 inline-flex items-center border-2 border-border bg-background text-[11px] tracking-wider truncate"
                        >
                          {o.key}
                        </code>
                        <button
                          type="button"
                          disabled={o.key === '—'}
                          onclick={() => copy(o.key, o.id)}
                          class="h-10 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {copied === o.id ? 'COPIED ✓' : 'COPY'}
                        </button>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <a
                        href={`/store/${o.product.toLowerCase()}`}
                        class="h-9 px-3 inline-flex items-center font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground"
                      >
                        BUY_AGAIN ▶
                      </a>
                      <button
                        type="button"
                        class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground"
                      >
                        INVOICE_PDF
                      </button>
                      {#if o.status !== 'OK'}
                        <button
                          type="button"
                          class="h-9 px-3 font-pixel text-[9px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background"
                        >
                          CONTACT_SUPPORT
                        </button>
                      {/if}
                    </div>
                  </div>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    {#if visibleOrders.length > 0}
      <div class="flex justify-center">
        <button
          type="button"
          class="h-10 px-6 font-pixel text-[10px] border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground shadow-pixel"
        >
          LOAD_MORE ▶
        </button>
      </div>
    {/if}
  </section>

  <Footer />
</div>
