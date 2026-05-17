<script lang="ts">
  type Status = 'OK' | 'PENDING' | 'FAIL' | 'REFUNDED';

  interface Order {
    id: string;
    date: string;
    time: string;
    user: string;
    sku: string;
    productLabel: string;
    amount: number;
    method: string;
    status: Status;
    key: string;
  }

  const orders: Order[] = [
    { id: 'TXN-20260510-0061', date: '2026-05-10', time: '13:42:01', user: 'rockyuser', sku: 'CURSOR_30D', productLabel: 'Cursor Unlimit — 30 Days', amount: 199, method: 'TRUEMONEY', status: 'OK', key: 'CURSOR-30D-9F4A-7B2K-PX8M-LQR3' },
    { id: 'TXN-20260510-0060', date: '2026-05-10', time: '12:18:33', user: 'pixel_kid', sku: 'CURSOR_7D', productLabel: 'Cursor Unlimit — 7 Days', amount: 69, method: 'PROMPTPAY', status: 'OK', key: 'CURSOR-7D-R34A-1K8X-VCN2-BTY9' },
    { id: 'TXN-20260510-0059', date: '2026-05-10', time: '11:05:21', user: 'neo_dev', sku: 'SOCIAL_FB', productLabel: 'Facebook Account — Verified', amount: 150, method: 'BANK_TRANSFER', status: 'PENDING', key: '—' },
    { id: 'TXN-20260510-0058', date: '2026-05-10', time: '09:55:08', user: 'mira88', sku: 'CURSOR_60D', productLabel: 'Cursor Unlimit — 60 Days', amount: 349, method: 'TRUEMONEY', status: 'OK', key: 'CURSOR-60D-MT4N-66XZ-JK2F-QWE8' },
    { id: 'TXN-20260509-0057', date: '2026-05-09', time: '23:11:42', user: 'pixel_kid', sku: 'CURSOR_1D', productLabel: 'Cursor Unlimit — 1 Day', amount: 30, method: 'PROMPTPAY', status: 'FAIL', key: '—' },
    { id: 'TXN-20260509-0056', date: '2026-05-09', time: '20:32:12', user: 'mira88', sku: 'SOCIAL_FB', productLabel: 'Facebook Account — Verified', amount: 150, method: 'TRUEMONEY', status: 'REFUNDED', key: '—' }
  ];

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'OK', label: 'OK' },
    { id: 'PENDING', label: 'PENDING' },
    { id: 'FAIL', label: 'FAILED' },
    { id: 'REFUNDED', label: 'REFUNDED' }
  ] as const;

  let activeFilter = $state<'all' | Status>('all');
  let search = $state('');
  let dateFrom = $state('');
  let dateTo = $state('');
  let expanded = $state<Record<string, boolean>>({});

  const visible = $derived(
    orders.filter((o) => {
      if (activeFilter !== 'all' && o.status !== activeFilter) return false;
      if (search && !`${o.id} ${o.user} ${o.sku} ${o.productLabel}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFrom && o.date < dateFrom) return false;
      if (dateTo && o.date > dateTo) return false;
      return true;
    })
  );

  const stats = $derived({
    revenue: orders.filter((o) => o.status === 'OK').reduce((s, o) => s + o.amount, 0),
    count: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    refunded: orders.filter((o) => o.status === 'REFUNDED').reduce((s, o) => s + o.amount, 0)
  });

  function statusClass(s: Status) {
    switch (s) {
      case 'OK': return 'bg-primary text-primary-foreground';
      case 'PENDING': return 'bg-muted text-foreground';
      case 'FAIL': return 'bg-destructive text-background';
      case 'REFUNDED': return 'bg-card text-muted-foreground border-muted-foreground';
    }
  }
</script>

<svelte:head><title>Orders — Admin</title></svelte:head>

<div class="p-4 md:p-8 space-y-6 max-w-6xl">
  <header class="flex items-end justify-between gap-4 flex-wrap">
    <div class="space-y-2">
      <div class="font-mono text-[11px] text-muted-foreground">// TRANSACTION_LOG</div>
      <h1 class="font-pixel text-xl md:text-2xl text-glow">ORDERS<span class="blink">_</span></h1>
      <p class="font-mono text-[12px] text-muted-foreground">
        &gt; ตรวจสอบคำสั่งซื้อทั้งหมด · refund · ออกคีย์ใหม่
      </p>
    </div>
    <button type="button" class="h-10 px-4 font-pixel text-[10px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">EXPORT_CSV ▶</button>
  </header>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// REVENUE</div>
      <div class="font-pixel text-lg text-glow mt-2">฿{stats.revenue.toLocaleString()}</div>
    </div>
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// ORDERS</div>
      <div class="font-pixel text-lg text-glow mt-2">{stats.count}</div>
    </div>
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// PENDING</div>
      <div class="font-pixel text-lg mt-2 {stats.pending > 0 ? 'text-destructive' : 'text-muted-foreground'}">{stats.pending}</div>
    </div>
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// REFUNDED</div>
      <div class="font-pixel text-lg text-muted-foreground mt-2">฿{stats.refunded.toLocaleString()}</div>
    </div>
  </div>

  <div class="space-y-3">
    <div class="flex flex-wrap gap-2">
      {#each filters as f (f.id)}
        <button type="button" onclick={() => (activeFilter = f.id as 'all' | Status)} class="h-9 px-3 md:px-4 font-pixel text-[9px] md:text-[10px] border-2 border-border transition-colors {activeFilter === f.id ? 'bg-primary text-primary-foreground shadow-pixel' : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'}">
          {f.label}
        </button>
      {/each}
    </div>
    <div class="grid sm:grid-cols-[1fr,auto,auto] gap-2">
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted-foreground pointer-events-none">&gt;</span>
        <input type="text" bind:value={search} placeholder="SEARCH_ID_USER_OR_SKU..." class="w-full h-10 pl-7 pr-3 border-2 border-border bg-background font-mono text-[12px] rounded-none focus:border-primary focus:outline-none" />
      </div>
      <input type="date" bind:value={dateFrom} class="h-10 px-3 border-2 border-border bg-background font-mono text-[11px] rounded-none focus:border-primary focus:outline-none" />
      <input type="date" bind:value={dateTo} class="h-10 px-3 border-2 border-border bg-background font-mono text-[11px] rounded-none focus:border-primary focus:outline-none" />
    </div>
  </div>

  <div class="border-2 border-border bg-card shadow-pixel">
    <div class="hidden md:grid grid-cols-[120px,140px,1fr,120px,90px,100px,32px] gap-3 px-4 py-3 border-b-2 border-border font-pixel text-[9px] text-muted-foreground">
      <span>TIMESTAMP</span><span>USER</span><span>ORDER · SKU</span><span>METHOD</span><span>AMOUNT</span><span>STATUS</span><span></span>
    </div>

    {#if visible.length === 0}
      <div class="px-6 py-12 text-center font-mono text-[11px] text-muted-foreground">&gt; NO_ORDERS_FOUND</div>
    {:else}
      <ul class="divide-y divide-border">
        {#each visible as o (o.id)}
          <li>
            <button type="button" onclick={() => (expanded[o.id] = !expanded[o.id])} class="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors" aria-expanded={!!expanded[o.id]}>
              <div class="md:hidden space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-mono text-[10px] text-muted-foreground">[{o.date} {o.time}]</span>
                  <span class="font-pixel text-[9px] px-2 py-0.5 border border-border {statusClass(o.status)}">{o.status}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="min-w-0 flex-1 truncate">
                    <span class="font-pixel text-[9px]">{o.user} → {o.sku}</span>
                    <span class="block font-mono text-[10px] text-muted-foreground mt-0.5 truncate">#{o.id}</span>
                  </span>
                  <span class="font-pixel text-[10px]">฿{o.amount}</span>
                </div>
              </div>
              <div class="hidden md:grid grid-cols-[120px,140px,1fr,120px,90px,100px,32px] gap-3 items-center">
                <span class="text-muted-foreground text-[10px] leading-tight font-mono">{o.date}<br /><span class="text-[9px]">{o.time}</span></span>
                <span class="font-pixel text-[10px] truncate">{o.user}</span>
                <span class="truncate">
                  <span class="font-mono text-muted-foreground text-[10px]">#{o.id}</span>
                  <span class="block font-pixel text-[9px] mt-0.5">{o.sku}</span>
                </span>
                <span class="font-mono text-muted-foreground text-[10px]">{o.method}</span>
                <span class="font-pixel text-[10px]">฿{o.amount}</span>
                <span class="font-pixel text-[9px] px-2 py-1 border border-border w-fit {statusClass(o.status)}">{o.status}</span>
                <span class="grid place-items-center text-muted-foreground transition-transform {expanded[o.id] ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
              </div>
            </button>

            {#if expanded[o.id]}
              <div class="border-t border-border bg-background/60 px-4 py-4 grid md:grid-cols-2 gap-4 font-mono text-[11px]">
                <div class="space-y-3">
                  <div><div class="font-pixel text-[9px] text-muted-foreground">// PRODUCT</div><div class="mt-1">{o.productLabel}</div></div>
                  <div><div class="font-pixel text-[9px] text-muted-foreground">// USER</div><div class="mt-1">{o.user}</div></div>
                  <div><div class="font-pixel text-[9px] text-muted-foreground">// METHOD</div><div class="mt-1">{o.method}</div></div>
                </div>
                <div class="space-y-3">
                  <div>
                    <div class="font-pixel text-[9px] text-muted-foreground">// LICENSE_KEY</div>
                    <code class="mt-1 h-10 px-3 inline-flex items-center w-full border-2 border-border bg-background text-[11px] tracking-wider truncate">{o.key}</code>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">RESEND_KEY</button>
                    <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">VIEW_USER ▶</button>
                    {#if o.status === 'OK'}
                      <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">REFUND</button>
                    {/if}
                    {#if o.status === 'PENDING'}
                      <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">MARK_PAID</button>
                      <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">CANCEL</button>
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
</div>
