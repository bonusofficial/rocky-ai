<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { isIconImage } from '$lib/icon';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const categories = $derived(data.categories);
  const products = $derived(data.products);

  let activeCategory = $state<string>('ALL');

  const categoryTabs = $derived([
    { slug: 'ALL', label: 'ALL', icon: '◆' },
    ...categories.map((c) => ({ slug: c.slug, label: c.name.toUpperCase(), icon: c.icon }))
  ]);

  const visibleProducts = $derived(
    activeCategory === 'ALL'
      ? products
      : products.filter((p) => p.category.slug === activeCategory)
  );

  function statusBadge(p: typeof products[number]) {
    if (p.availableStock === 0) return { label: 'SOLD_OUT', cls: 'bg-destructive text-background' };
    if (p.availableStock <= 3) return { label: `${p.availableStock} LEFT`, cls: 'bg-muted text-foreground border-primary' };
    return { label: 'IN_STOCK', cls: 'bg-primary text-primary-foreground' };
  }
</script>

<svelte:head>
  <title>Store — Rocky AI</title>
  <meta name="description" content="ร้านค้า Rocky AI โทนพิกเซล สำหรับ Cursor Unlimit และบัญชีโซเชียล" />
</svelte:head>

<div class="min-h-screen bg-background relative overflow-hidden">
  <Navbar />

  <section class="container relative py-16 md:py-24">
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center font-pixel text-[9px] bg-muted text-foreground border border-border rounded-none px-3 py-1">
        <span class="blink mr-2">▶</span> CATEGORY STORE
      </div>
      <h1 class="font-pixel text-2xl md:text-4xl leading-relaxed text-glow">
        CHOOSE<br />
        <span class="text-muted-foreground text-xl md:text-3xl">YOUR CATEGORY</span>
        <br />BROWSE THE <span class="text-primary">CATALOG</span><span class="blink">_</span>
      </h1>
    </div>
  </section>

  <!-- categories -->
  <section class="container py-10 border-t border-border">
    <div class="text-center mb-8 space-y-2">
      <div class="font-mono text-[11px] text-muted-foreground">// CATEGORIES</div>
    </div>

    {#if categories.length === 0}
      <div class="border-2 border-border bg-card p-6 text-center font-mono text-[12px] text-muted-foreground max-w-2xl mx-auto">
        &gt; ยังไม่มีหมวดหมู่ในระบบ — แอดมินยังไม่ได้เพิ่มสินค้า
      </div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
        {#each categories as c (c.id)}
          <button
            type="button"
            onclick={() => (activeCategory = c.slug)}
            class="border-2 p-5 bg-card transition-colors text-left {activeCategory === c.slug ? 'border-primary shadow-pixel' : 'border-border hover:border-primary'}"
          >
            <div class="w-10 h-10 grid place-items-center font-pixel text-xl text-glow border-2 border-border bg-muted mb-3 overflow-hidden">
              {#if isIconImage(c.icon)}
                <img src={c.icon} alt={c.name} class="w-full h-full object-cover" />
              {:else}
                {c.icon}
              {/if}
            </div>
            <div class="font-pixel text-[10px] mb-2">{c.name.toUpperCase()}</div>
            <div class="font-mono text-[10px] text-muted-foreground line-clamp-2 mb-2">{c.description || '—'}</div>
            <div class="font-pixel text-[9px] text-primary">{c.productCount} ITEM{c.productCount === 1 ? '' : 'S'} ▶</div>
          </button>
        {/each}
      </div>
    {/if}
  </section>

  <!-- product list -->
  <section class="container py-10 border-t border-border" id="products">
    <div class="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <div class="font-mono text-[11px] text-muted-foreground">// PRODUCTS</div>
        <h2 class="font-pixel text-lg md:text-xl text-glow mt-1">
          {activeCategory === 'ALL' ? 'ALL_ITEMS' : activeCategory.toUpperCase()}<span class="blink">_</span>
        </h2>
      </div>
      <div class="flex flex-wrap gap-2">
        {#each categoryTabs as t (t.slug)}
          <button
            type="button"
            onclick={() => (activeCategory = t.slug)}
            class="h-9 px-3 font-pixel text-[9px] border-2 border-border transition-colors {activeCategory === t.slug ? 'bg-primary text-primary-foreground shadow-pixel' : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'}"
          >
            <span class="mr-1 inline-flex items-center align-middle">
              {#if isIconImage(t.icon)}
                <img src={t.icon} alt="" class="w-3.5 h-3.5 object-cover" />
              {:else}
                {t.icon}
              {/if}
            </span>{t.label}
          </button>
        {/each}
      </div>
    </div>

    {#if visibleProducts.length === 0}
      <div class="border-2 border-border bg-card p-8 text-center font-mono text-[12px] text-muted-foreground">
        &gt; NO_PRODUCTS_IN_THIS_CATEGORY
      </div>
    {:else}
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each visibleProducts as p (p.id)}
          {@const badge = statusBadge(p)}
          <article class="border-2 border-border bg-card shadow-pixel flex flex-col">
            <div class="p-5 border-b-2 border-border flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="font-mono text-[10px] text-muted-foreground">// {p.category.slug.toUpperCase()}</div>
                <div class="font-pixel text-[11px] mt-1 truncate">{p.sku}</div>
                <div class="font-mono text-[11px] text-muted-foreground mt-1 line-clamp-2">{p.name}</div>
              </div>
              <span class="font-pixel text-[8px] px-2 py-1 border border-border whitespace-nowrap {badge.cls}">{badge.label}</span>
            </div>

            <div class="p-5 flex-1 flex flex-col">
              <p class="font-mono text-[11px] text-muted-foreground line-clamp-3 mb-4 min-h-[3em]">
                {p.description || '—'}
              </p>
              <div class="font-mono text-[10px] text-muted-foreground mb-3">
                DURATION: <span class="text-foreground">{p.duration}</span>
              </div>
              <div class="mt-auto flex items-center justify-between gap-3">
                <div>
                  <div class="font-pixel text-lg text-glow">฿{p.price.toLocaleString()}</div>
                  <div class="font-mono text-[10px] text-muted-foreground">PER_KEY</div>
                </div>
                <a
                  href="/store/{p.id}"
                  aria-disabled={p.availableStock === 0}
                  class="h-10 px-4 inline-flex items-center font-pixel text-[10px] {p.availableStock === 0 ? 'border-2 border-border bg-muted text-muted-foreground pointer-events-none' : 'bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel'}"
                >
                  {p.availableStock === 0 ? 'SOLD_OUT' : 'BUY ▶'}
                </a>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </section>

  <Footer />
</div>
