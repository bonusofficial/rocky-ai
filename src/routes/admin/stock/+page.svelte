<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const pools = $derived(data.pools);

  const initialId = page.url.searchParams.get('product');
  let selectedId = $state<string>('');
  let stockInput = $state('');
  let dedup = $state(true);
  let trimWhitespace = $state(true);

  $effect(() => {
    if (selectedId) return;
    if (initialId && pools.some((p) => p.id === initialId)) {
      selectedId = initialId;
    } else if (pools.length > 0) {
      selectedId = pools[0].id;
    }
  });

  const selected = $derived(pools.find((p) => p.id === selectedId) ?? null);
  const rawLines = $derived(stockInput.split(/\r?\n/));

  const parsed = $derived.by(() => {
    let lines = trimWhitespace ? rawLines.map((l) => l.trim()) : rawLines.slice();
    const empty = lines.filter((l) => l.length === 0).length;
    lines = lines.filter((l) => l.length > 0);
    const total = lines.length;
    const unique = Array.from(new Set(lines));
    const duplicates = total - unique.length;
    return {
      empty,
      total,
      unique: unique.length,
      duplicates,
      finalCount: dedup ? unique.length : total,
      preview: (dedup ? unique : lines).slice(0, 5)
    };
  });
</script>

<svelte:head><title>Stock — Admin</title></svelte:head>

<div class="p-4 md:p-8 space-y-6 max-w-6xl">
  <header class="space-y-2">
    <div class="font-mono text-[11px] text-muted-foreground">// INVENTORY_INJECTOR</div>
    <h1 class="font-pixel text-xl md:text-2xl text-glow">STOCK<span class="blink">_</span></h1>
    <p class="font-mono text-[12px] text-muted-foreground leading-relaxed">
      &gt; วาง keys/accounts ลงในช่องด้านล่าง <span class="text-primary">บรรทัดละ 1 รายการ</span><br />
      &gt; ระบบจะตัดบรรทัดว่าง ตรวจซ้ำ และ skip duplicate ที่มีอยู่แล้ว
    </p>
  </header>

  {#if data.loadError}
    <div class="border-2 border-destructive bg-card p-3 font-mono text-[11px] text-destructive">
      [ERR] {data.loadError}
    </div>
  {/if}
  {#if pools.length === 0 && !data.loadError}
    <div class="border-2 border-destructive bg-card p-3 font-mono text-[11px]">
      [WARN] ยังไม่มีสินค้า — สร้างที่ <a href="/admin/products" class="text-primary hover:underline">/admin/products</a> ก่อน
    </div>
  {/if}
  {#if form?.success}
    <div class="border-2 border-primary bg-primary/10 p-3 font-mono text-[11px] flex flex-wrap items-center gap-3">
      <span class="font-pixel text-[10px] text-primary">[OK]</span>
      เพิ่มสต็อกสำเร็จ
      <span>INSERTED <span class="text-glow font-pixel text-[10px]">{form.inserted}</span></span>
      <span class="text-muted-foreground">UNIQUE {form.unique} · SKIPPED {form.skipped} · REQUESTED {form.requested}</span>
    </div>
  {:else if form?.error}
    <div class="border-2 border-destructive bg-card p-3 font-mono text-[11px] text-destructive">
      [ERR] {form.error}
    </div>
  {/if}

  {#if pools.length > 0}
    <form
      method="POST"
      action="?/add"
      use:enhance={() => async ({ result, update }) => {
        if (result.type === 'success') stockInput = '';
        await update();
      }}
      class="border-2 border-primary bg-card shadow-pixel"
    >
      <div class="p-5 md:p-6 space-y-4 border-b-2 border-border">
        <h2 class="font-pixel text-[11px]">// SELECT_PRODUCT</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {#each pools as p (p.id)}
            <label class="cursor-pointer block border-2 p-3 transition-colors {selectedId === p.id ? 'border-primary bg-muted' : 'border-border bg-background hover:border-primary'}">
              <input type="radio" name="productId" value={p.id} bind:group={selectedId} class="sr-only" />
              <div class="flex items-center justify-between gap-2">
                <span class="font-pixel text-[10px]">{p.sku}</span>
                <span class="font-pixel text-[9px] px-2 py-0.5 border border-border {p.available === 0 ? 'bg-destructive text-background' : 'bg-primary text-primary-foreground'}">
                  {p.available}
                </span>
              </div>
              <div class="font-mono text-[10px] text-muted-foreground mt-1 truncate">{p.name}</div>
            </label>
          {/each}
        </div>
      </div>

      <div class="p-5 md:p-6 space-y-4">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <h2 class="font-pixel text-[11px]">// PASTE_STOCK · TARGET: <span class="text-primary">{selected?.sku ?? '—'}</span></h2>
          <div class="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
            <label class="inline-flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" name="trim" value="true" bind:checked={trimWhitespace} class="accent-primary" />
              TRIM
            </label>
            <label class="inline-flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" bind:checked={dedup} class="accent-primary" />
              DEDUP_PREVIEW
            </label>
          </div>
        </div>

        <div class="relative">
          <textarea
            name="items"
            bind:value={stockInput}
            rows="12"
            spellcheck="false"
            placeholder={`CURSOR-30D-9F4A-7B2K-PX8M-LQR3\nCURSOR-30D-MT4N-66XZ-JK2F-QWE8\nCURSOR-30D-...\n\n// บรรทัดละ 1 คีย์\n// บรรทัดว่างจะถูกข้าม\n// คีย์ซ้ำในระบบจะถูก skip อัตโนมัติ`}
            class="w-full p-4 border-2 border-border bg-background font-mono text-[12px] leading-relaxed rounded-none focus:border-primary focus:outline-none resize-y"
          ></textarea>
          <div class="absolute bottom-2 right-3 font-mono text-[10px] text-muted-foreground pointer-events-none bg-background/80 px-2 py-0.5">
            {rawLines.length} LINES
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div class="border-2 border-border bg-background p-3">
            <div class="font-mono text-[10px] text-muted-foreground">// PARSED</div>
            <div class="font-pixel text-base text-glow mt-1">{parsed.total}</div>
          </div>
          <div class="border-2 border-border bg-background p-3">
            <div class="font-mono text-[10px] text-muted-foreground">// UNIQUE</div>
            <div class="font-pixel text-base text-glow mt-1">{parsed.unique}</div>
          </div>
          <div class="border-2 border-border bg-background p-3">
            <div class="font-mono text-[10px] text-muted-foreground">// DUPLICATES</div>
            <div class="font-pixel text-base mt-1 {parsed.duplicates > 0 ? 'text-destructive' : 'text-muted-foreground'}">{parsed.duplicates}</div>
          </div>
          <div class="border-2 border-border bg-background p-3">
            <div class="font-mono text-[10px] text-muted-foreground">// EMPTY_SKIPPED</div>
            <div class="font-pixel text-base text-muted-foreground mt-1">{parsed.empty}</div>
          </div>
        </div>

        {#if parsed.preview.length > 0}
          <div class="border-2 border-border bg-background p-3 space-y-1">
            <div class="font-mono text-[10px] text-muted-foreground">// PREVIEW (first {parsed.preview.length} of {parsed.finalCount})</div>
            <ol class="font-mono text-[11px] space-y-0.5">
              {#each parsed.preview as line, i}
                <li class="truncate"><span class="text-muted-foreground">[{String(i + 1).padStart(3, '0')}]</span> {line}</li>
              {/each}
              {#if parsed.finalCount > parsed.preview.length}
                <li class="text-muted-foreground">... +{parsed.finalCount - parsed.preview.length} more</li>
              {/if}
            </ol>
          </div>
        {/if}

        <div class="flex flex-wrap gap-2 pt-2 border-t border-border">
          <button
            type="submit"
            disabled={parsed.finalCount === 0 || !selectedId}
            class="h-10 px-5 font-pixel text-[10px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ADD_STOCK ({parsed.finalCount}) ▶
          </button>
          <button type="button" onclick={() => (stockInput = '')} class="h-10 px-5 font-pixel text-[10px] border-2 border-border bg-muted hover:bg-card">CLEAR</button>
        </div>
      </div>
    </form>

    <!-- pool overview -->
    <div class="border-2 border-border bg-card shadow-pixel">
      <div class="p-4 border-b-2 border-border flex items-center justify-between">
        <h2 class="font-pixel text-[11px]">// STOCK_POOLS</h2>
        <span class="font-mono text-[10px] text-muted-foreground">REAL_TIME</span>
      </div>
      <div class="hidden md:grid grid-cols-[1fr,110px,110px,110px,1fr] gap-3 px-4 py-3 border-b border-border font-pixel text-[9px] text-muted-foreground">
        <span>SKU · NAME</span><span>AVAILABLE</span><span>SOLD</span><span>TOTAL</span><span>FILL_RATE</span>
      </div>
      <ul class="divide-y divide-border">
        {#each pools as p (p.id)}
          {@const total = p.available + p.sold}
          {@const pct = total === 0 ? 0 : Math.round((p.available / total) * 100)}
          <li class="px-4 py-3">
            <div class="md:hidden space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-pixel text-[10px]">{p.sku}</span>
                <span class="font-pixel text-[9px] px-2 py-0.5 border border-border {p.available === 0 ? 'bg-destructive text-background' : 'bg-primary text-primary-foreground'}">{p.available} LEFT</span>
              </div>
              <div class="font-mono text-[10px] text-muted-foreground">SOLD {p.sold} · TOTAL {total}</div>
              <div class="h-2 bg-background border border-border">
                <div class="h-full bg-primary" style="width: {pct}%"></div>
              </div>
            </div>
            <div class="hidden md:grid grid-cols-[1fr,110px,110px,110px,1fr] gap-3 items-center">
              <div class="truncate">
                <span class="font-pixel text-[10px]">{p.sku}</span>
                <span class="block font-mono text-[10px] text-muted-foreground mt-0.5 truncate">{p.name}</span>
              </div>
              <span class="font-pixel text-[10px] {p.available === 0 ? 'text-destructive' : 'text-glow'}">{p.available}</span>
              <span class="font-pixel text-[10px] text-muted-foreground">{p.sold}</span>
              <span class="font-pixel text-[10px]">{total}</span>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-background border border-border">
                  <div class="h-full bg-primary" style="width: {pct}%"></div>
                </div>
                <span class="font-mono text-[10px] text-muted-foreground w-10 text-right">{pct}%</span>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
