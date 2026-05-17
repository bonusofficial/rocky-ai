<script lang="ts">
  const kpis = [
    { label: 'TOTAL_USERS', value: '1,284', delta: '+18 / 7D' },
    { label: 'REVENUE_MTD', value: '฿98,450', delta: '+12.4%' },
    { label: 'ORDERS_TODAY', value: '47', delta: '+8' },
    { label: 'PENDING_TOPUPS', value: '6', delta: 'NEEDS_REVIEW' }
  ];

  const recentOrders = [
    { id: 'TXN-20260510-0061', user: 'rockyuser', product: 'CURSOR_30D', amount: 199, status: 'OK' },
    { id: 'TXN-20260510-0060', user: 'pixel_kid', product: 'CURSOR_7D', amount: 69, status: 'OK' },
    { id: 'TXN-20260510-0059', user: 'neo_dev', product: 'SOCIAL_FB', amount: 150, status: 'PENDING' },
    { id: 'TXN-20260510-0058', user: 'mira88', product: 'CURSOR_60D', amount: 349, status: 'OK' }
  ];

  const recentTopups = [
    { id: 'TOP-20260510-0019', user: 'pixel_kid', amount: 200, method: 'PROMPTPAY', status: 'OK' },
    { id: 'TOP-20260510-0018', user: 'neo_dev', amount: 500, method: 'BANK', status: 'PENDING' },
    { id: 'TOP-20260510-0017', user: 'mira88', amount: 100, method: 'TRUEMONEY', status: 'OK' }
  ];

  function statusClass(s: string) {
    return s === 'OK'
      ? 'bg-primary text-primary-foreground'
      : s === 'PENDING'
      ? 'bg-muted text-foreground'
      : 'bg-destructive text-background';
  }
</script>

<svelte:head>
  <title>Admin Dashboard — Rocky AI</title>
</svelte:head>

<div class="p-4 md:p-8 space-y-8 max-w-6xl">
  <header class="space-y-2">
    <div class="font-mono text-[11px] text-muted-foreground">// OVERVIEW · {new Date().toISOString().slice(0, 10)}</div>
    <h1 class="font-pixel text-xl md:text-2xl text-glow">DASHBOARD<span class="blink">_</span></h1>
    <p class="font-mono text-[12px] text-muted-foreground">
      &gt; ภาพรวมระบบและกิจกรรมล่าสุดทั้งหมด
    </p>
  </header>

  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
    {#each kpis as k (k.label)}
      <div class="border-2 border-border bg-card p-4 md:p-5 shadow-pixel space-y-2">
        <div class="font-mono text-[10px] text-muted-foreground">// {k.label}</div>
        <div class="font-pixel text-lg md:text-2xl text-glow">{k.value}</div>
        <div class="font-mono text-[10px] text-primary">▲ {k.delta}</div>
      </div>
    {/each}
  </div>

  <div class="grid lg:grid-cols-2 gap-4">
    <div class="border-2 border-border bg-card shadow-pixel">
      <div class="flex items-center justify-between p-4 border-b-2 border-border">
        <h2 class="font-pixel text-[11px]">// RECENT_ORDERS</h2>
        <a href="/admin/orders" class="font-pixel text-[9px] text-primary hover:underline">VIEW_ALL ▶</a>
      </div>
      <ul class="divide-y divide-border font-mono text-[11px]">
        {#each recentOrders as o (o.id)}
          <li class="px-4 py-3 grid grid-cols-[1fr,auto,auto] gap-3 items-center">
            <span class="truncate">
              <span class="text-muted-foreground text-[10px]">#{o.id}</span>
              <span class="block font-pixel text-[9px] mt-0.5">{o.user} → {o.product}</span>
            </span>
            <span class="font-pixel text-[10px]">฿{o.amount}</span>
            <span class="font-pixel text-[9px] px-2 py-0.5 border border-border {statusClass(o.status)}">
              {o.status}
            </span>
          </li>
        {/each}
      </ul>
    </div>

    <div class="border-2 border-border bg-card shadow-pixel">
      <div class="flex items-center justify-between p-4 border-b-2 border-border">
        <h2 class="font-pixel text-[11px]">// RECENT_TOPUPS</h2>
        <a href="/admin/topups" class="font-pixel text-[9px] text-primary hover:underline">VIEW_ALL ▶</a>
      </div>
      <ul class="divide-y divide-border font-mono text-[11px]">
        {#each recentTopups as t (t.id)}
          <li class="px-4 py-3 grid grid-cols-[1fr,auto,auto] gap-3 items-center">
            <span class="truncate">
              <span class="text-muted-foreground text-[10px]">#{t.id}</span>
              <span class="block font-pixel text-[9px] mt-0.5">{t.user} · {t.method}</span>
            </span>
            <span class="font-pixel text-[10px]">฿{t.amount}</span>
            <span class="font-pixel text-[9px] px-2 py-0.5 border border-border {statusClass(t.status)}">
              {t.status}
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="border-2 border-border bg-card p-5 shadow-pixel">
    <h2 class="font-pixel text-[11px] mb-3">// QUICK_ACTIONS</h2>
    <div class="flex flex-wrap gap-2">
      <a href="/admin/stock" class="h-9 px-3 inline-flex items-center font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">+ ADD_STOCK</a>
      <a href="/admin/products" class="h-9 px-3 inline-flex items-center font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">+ ADD_PRODUCT</a>
      <a href="/admin/categories" class="h-9 px-3 inline-flex items-center font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">+ ADD_CATEGORY</a>
      <a href="/admin/topups" class="h-9 px-3 inline-flex items-center font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">REVIEW_PENDING ▶</a>
    </div>
  </div>
</div>
