<script lang="ts">
  type Status = 'OK' | 'PENDING' | 'REJECTED';
  type Method = 'PROMPTPAY' | 'TRUEMONEY' | 'BANK_TRANSFER';

  interface Topup {
    id: string;
    date: string;
    time: string;
    user: string;
    amount: number;
    method: Method;
    ref: string;
    status: Status;
    note?: string;
  }

  let topups = $state<Topup[]>([
    { id: 'TOP-20260510-0021', date: '2026-05-10', time: '14:08:55', user: 'neo_dev', amount: 500, method: 'BANK_TRANSFER', ref: 'KBANK-2026051014085501', status: 'PENDING' },
    { id: 'TOP-20260510-0020', date: '2026-05-10', time: '13:55:12', user: 'mira88', amount: 1000, method: 'BANK_TRANSFER', ref: 'SCB-2026051013551200', status: 'PENDING' },
    { id: 'TOP-20260510-0019', date: '2026-05-10', time: '12:42:01', user: 'pixel_kid', amount: 200, method: 'PROMPTPAY', ref: 'PP-2026051012420109', status: 'OK' },
    { id: 'TOP-20260510-0018', date: '2026-05-10', time: '11:30:44', user: 'rockyuser', amount: 300, method: 'TRUEMONEY', ref: 'TM-WALLET-99814', status: 'OK' },
    { id: 'TOP-20260509-0017', date: '2026-05-09', time: '22:15:33', user: 'mira88', amount: 100, method: 'TRUEMONEY', ref: 'TM-WALLET-99799', status: 'OK' },
    { id: 'TOP-20260509-0016', date: '2026-05-09', time: '18:02:11', user: 'neo_dev', amount: 250, method: 'BANK_TRANSFER', ref: 'KBANK-2026050918021100', status: 'REJECTED', note: 'สลิปไม่ตรงกับยอด' }
  ]);

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'PENDING', label: 'PENDING' },
    { id: 'OK', label: 'APPROVED' },
    { id: 'REJECTED', label: 'REJECTED' }
  ] as const;

  const methods = ['ALL', 'PROMPTPAY', 'TRUEMONEY', 'BANK_TRANSFER'] as const;

  let activeFilter = $state<'all' | Status>('all');
  let activeMethod = $state<(typeof methods)[number]>('ALL');
  let search = $state('');
  let expanded = $state<Record<string, boolean>>({});
  let rejectNotes = $state<Record<string, string>>({});

  const visible = $derived(
    topups.filter((t) => {
      if (activeFilter !== 'all' && t.status !== activeFilter) return false;
      if (activeMethod !== 'ALL' && t.method !== activeMethod) return false;
      if (search && !`${t.id} ${t.user} ${t.ref}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
  );

  const stats = $derived({
    todayApproved: topups.filter((t) => t.status === 'OK' && t.date === '2026-05-10').reduce((s, t) => s + t.amount, 0),
    pendingCount: topups.filter((t) => t.status === 'PENDING').length,
    pendingValue: topups.filter((t) => t.status === 'PENDING').reduce((s, t) => s + t.amount, 0),
    rejectedCount: topups.filter((t) => t.status === 'REJECTED').length
  });

  function statusClass(s: Status) {
    return s === 'OK'
      ? 'bg-primary text-primary-foreground'
      : s === 'PENDING'
      ? 'bg-muted text-foreground'
      : 'bg-destructive text-background';
  }

  function approve(id: string) {
    const t = topups.find((t) => t.id === id);
    if (t) t.status = 'OK';
  }

  function reject(id: string) {
    const t = topups.find((t) => t.id === id);
    if (t) {
      t.status = 'REJECTED';
      t.note = rejectNotes[id] || 'rejected';
    }
  }
</script>

<svelte:head><title>Topups — Admin</title></svelte:head>

<div class="p-4 md:p-8 space-y-6 max-w-6xl">
  <header class="flex items-end justify-between gap-4 flex-wrap">
    <div class="space-y-2">
      <div class="font-mono text-[11px] text-muted-foreground">// WALLET_DEPOSITS</div>
      <h1 class="font-pixel text-xl md:text-2xl text-glow">TOPUPS<span class="blink">_</span></h1>
      <p class="font-mono text-[12px] text-muted-foreground">
        &gt; ตรวจสอบสลิป อนุมัติ หรือปฏิเสธรายการเติมเงิน
      </p>
    </div>
    <button type="button" class="h-10 px-4 font-pixel text-[10px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">EXPORT_CSV ▶</button>
  </header>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// APPROVED_TODAY</div>
      <div class="font-pixel text-lg text-glow mt-2">฿{stats.todayApproved.toLocaleString()}</div>
    </div>
    <div class="border-2 border-primary bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// PENDING_QUEUE</div>
      <div class="font-pixel text-lg mt-2 {stats.pendingCount > 0 ? 'text-destructive blink' : 'text-muted-foreground'}">{stats.pendingCount}</div>
    </div>
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// PENDING_VALUE</div>
      <div class="font-pixel text-lg text-glow mt-2">฿{stats.pendingValue.toLocaleString()}</div>
    </div>
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// REJECTED</div>
      <div class="font-pixel text-lg text-muted-foreground mt-2">{stats.rejectedCount}</div>
    </div>
  </div>

  <div class="space-y-3">
    <div class="flex flex-wrap gap-2">
      <span class="font-pixel text-[9px] text-muted-foreground self-center mr-1">STATUS:</span>
      {#each filters as f (f.id)}
        <button type="button" onclick={() => (activeFilter = f.id as 'all' | Status)} class="h-8 px-3 font-pixel text-[9px] border-2 border-border transition-colors {activeFilter === f.id ? 'bg-primary text-primary-foreground shadow-pixel' : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'}">
          {f.label}
        </button>
      {/each}
    </div>
    <div class="flex flex-wrap gap-2">
      <span class="font-pixel text-[9px] text-muted-foreground self-center mr-1">METHOD:</span>
      {#each methods as m (m)}
        <button type="button" onclick={() => (activeMethod = m)} class="h-8 px-3 font-pixel text-[9px] border-2 border-border transition-colors {activeMethod === m ? 'bg-primary text-primary-foreground shadow-pixel' : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'}">
          {m}
        </button>
      {/each}
    </div>
    <div class="relative max-w-md">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted-foreground pointer-events-none">&gt;</span>
      <input type="text" bind:value={search} placeholder="SEARCH_ID_USER_OR_REF..." class="w-full h-10 pl-7 pr-3 border-2 border-border bg-background font-mono text-[12px] rounded-none focus:border-primary focus:outline-none" />
    </div>
  </div>

  <div class="border-2 border-border bg-card shadow-pixel">
    <div class="hidden md:grid grid-cols-[120px,130px,1fr,140px,90px,100px,32px] gap-3 px-4 py-3 border-b-2 border-border font-pixel text-[9px] text-muted-foreground">
      <span>TIMESTAMP</span><span>USER</span><span>ID · REF</span><span>METHOD</span><span>AMOUNT</span><span>STATUS</span><span></span>
    </div>

    {#if visible.length === 0}
      <div class="px-6 py-12 text-center font-mono text-[11px] text-muted-foreground">&gt; NO_TOPUPS_FOUND</div>
    {:else}
      <ul class="divide-y divide-border">
        {#each visible as t (t.id)}
          <li>
            <button type="button" onclick={() => (expanded[t.id] = !expanded[t.id])} class="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors {t.status === 'PENDING' ? 'bg-primary/5' : ''}" aria-expanded={!!expanded[t.id]}>
              <div class="md:hidden space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-mono text-[10px] text-muted-foreground">[{t.date} {t.time}]</span>
                  <span class="font-pixel text-[9px] px-2 py-0.5 border border-border {statusClass(t.status)}">{t.status}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="min-w-0 flex-1 truncate">
                    <span class="font-pixel text-[9px]">{t.user} · {t.method}</span>
                    <span class="block font-mono text-[10px] text-muted-foreground mt-0.5 truncate">#{t.id}</span>
                  </span>
                  <span class="font-pixel text-[10px]">฿{t.amount}</span>
                </div>
              </div>
              <div class="hidden md:grid grid-cols-[120px,130px,1fr,140px,90px,100px,32px] gap-3 items-center">
                <span class="text-muted-foreground text-[10px] leading-tight font-mono">{t.date}<br /><span class="text-[9px]">{t.time}</span></span>
                <span class="font-pixel text-[10px] truncate">{t.user}</span>
                <span class="truncate">
                  <span class="font-mono text-muted-foreground text-[10px]">#{t.id}</span>
                  <span class="block font-mono text-[10px] mt-0.5 truncate">{t.ref}</span>
                </span>
                <span class="font-mono text-muted-foreground text-[10px]">{t.method}</span>
                <span class="font-pixel text-[10px]">฿{t.amount}</span>
                <span class="font-pixel text-[9px] px-2 py-1 border border-border w-fit {statusClass(t.status)}">{t.status}</span>
                <span class="grid place-items-center text-muted-foreground transition-transform {expanded[t.id] ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
              </div>
            </button>

            {#if expanded[t.id]}
              <div class="border-t border-border bg-background/60 px-4 py-4 grid md:grid-cols-2 gap-4 font-mono text-[11px]">
                <div class="space-y-3">
                  <div><div class="font-pixel text-[9px] text-muted-foreground">// USER</div><div class="mt-1">{t.user}</div></div>
                  <div><div class="font-pixel text-[9px] text-muted-foreground">// METHOD</div><div class="mt-1">{t.method}</div></div>
                  <div><div class="font-pixel text-[9px] text-muted-foreground">// REFERENCE</div><div class="mt-1 break-all">{t.ref}</div></div>
                  {#if t.note}
                    <div><div class="font-pixel text-[9px] text-destructive">// NOTE</div><div class="mt-1">{t.note}</div></div>
                  {/if}
                </div>
                <div class="space-y-3">
                  <div>
                    <div class="font-pixel text-[9px] text-muted-foreground">// SLIP_PREVIEW</div>
                    <div class="mt-1 h-32 border-2 border-dashed border-border bg-background grid place-items-center font-mono text-[10px] text-muted-foreground">
                      [SLIP_IMAGE_PLACEHOLDER]
                    </div>
                  </div>
                  {#if t.status === 'PENDING'}
                    <div class="space-y-2">
                      <input
                        type="text"
                        bind:value={rejectNotes[t.id]}
                        placeholder="REJECT_REASON (optional)..."
                        class="w-full h-9 px-3 border-2 border-border bg-background font-mono text-[11px] rounded-none focus:border-primary focus:outline-none"
                      />
                      <div class="flex gap-2 flex-wrap">
                        <button type="button" onclick={() => approve(t.id)} class="h-9 px-3 font-pixel text-[9px] border-2 border-primary bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel">APPROVE ▶</button>
                        <button type="button" onclick={() => reject(t.id)} class="h-9 px-3 font-pixel text-[9px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">REJECT ×</button>
                        <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">VIEW_USER ▶</button>
                      </div>
                    </div>
                  {:else}
                    <div class="flex flex-wrap gap-2">
                      <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">VIEW_USER ▶</button>
                      <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">DOWNLOAD_SLIP</button>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
