<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const product = $derived(data.product);

  let quantity = $state(1);
  const total = $derived(product.price * quantity);

  const badge = $derived.by(() => {
    if (product.availableStock === 0) return { label: 'SOLD_OUT', cls: 'bg-destructive text-background' };
    if (product.availableStock <= 3) return { label: `${product.availableStock} LEFT`, cls: 'bg-muted text-foreground border-primary' };
    return { label: 'IN_STOCK', cls: 'bg-primary text-primary-foreground' };
  });
</script>

<svelte:head>
  <title>{product.name} — Rocky AI</title>
  <meta name="description" content={product.description || product.name} />
</svelte:head>

<div class="min-h-screen bg-background relative overflow-hidden">
  <Navbar />

  <section class="container py-10 md:py-14 space-y-6">
    <nav class="font-mono text-[11px] text-muted-foreground">
      <a href="/store" class="hover:text-primary">/store</a> /
      <a href="/store?cat={product.category.slug}" class="hover:text-primary">{product.category.slug}</a> /
      <span class="text-foreground">{product.sku}</span>
    </nav>

    <div class="grid lg:grid-cols-[1fr,360px] gap-6">
      <article class="border-2 border-border bg-card shadow-pixel">
        <div class="p-5 md:p-6 border-b-2 border-border flex items-start justify-between gap-3 flex-wrap">
          <div class="min-w-0">
            <div class="font-mono text-[10px] text-muted-foreground">// {product.category.slug.toUpperCase()}</div>
            <h1 class="font-pixel text-base md:text-lg mt-2 text-glow break-all">{product.sku}<span class="blink">_</span></h1>
            <p class="font-mono text-[12px] text-muted-foreground mt-2">{product.name}</p>
          </div>
          {#if product.availableStock === 0}
            <span class="font-pixel text-[9px] px-2 py-1 border border-border whitespace-nowrap bg-destructive text-background">SOLD_OUT</span>
          {:else}
            <span class="font-pixel text-[9px] px-2 py-1 border border-border whitespace-nowrap {badge.cls}">{badge.label}</span>
          {/if}
        </div>

        <div class="p-5 md:p-6 space-y-4">
          <div>
            <div class="font-pixel text-[10px] text-muted-foreground mb-2">// DESCRIPTION</div>
            <p class="font-mono text-[12px] leading-relaxed whitespace-pre-line">
              {product.description || '— ไม่มีคำอธิบาย —'}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="border-2 border-border bg-background p-3">
              <div class="font-mono text-[10px] text-muted-foreground">// DURATION</div>
              <div class="font-pixel text-[11px] mt-1">{product.duration}</div>
            </div>
            <div class="border-2 border-border bg-background p-3">
              <div class="font-mono text-[10px] text-muted-foreground">// AVAILABLE</div>
              <div class="font-pixel text-[11px] mt-1 {product.availableStock === 0 ? 'text-destructive' : 'text-glow'}">
                {product.availableStock} KEYS
              </div>
            </div>
          </div>
        </div>
      </article>

      <aside class="border-2 border-primary bg-card shadow-pixel p-5 md:p-6 space-y-5 self-start lg:sticky lg:top-4">
        <div>
          <div class="font-pixel text-[10px] text-muted-foreground mb-2">// PRICE_PER_KEY</div>
          <div class="font-pixel text-3xl text-glow">฿{product.price.toLocaleString()}</div>
        </div>

        <div class="space-y-2">
          <div class="font-pixel text-[10px] text-muted-foreground">// QUANTITY</div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              onclick={() => (quantity = Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || product.availableStock === 0}
              class="h-10 w-10 grid place-items-center font-pixel text-[12px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
            >−</button>
            <input
              type="number"
              min="1"
              max={Math.max(1, product.availableStock)}
              bind:value={quantity}
              disabled={product.availableStock === 0}
              class="flex-1 h-10 px-3 border-2 border-border bg-background font-mono text-center text-sm rounded-none focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onclick={() => (quantity = Math.min(Math.max(1, product.availableStock), quantity + 1))}
              disabled={quantity >= product.availableStock || product.availableStock === 0}
              class="h-10 w-10 grid place-items-center font-pixel text-[12px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
            >+</button>
          </div>
        </div>

        <div class="border-t border-border pt-4 space-y-2">
          <div class="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
            <span>SUBTOTAL</span>
            <span class="text-foreground">฿{total.toLocaleString()}</span>
          </div>
          <div class="flex items-center justify-between font-pixel text-[11px]">
            <span>TOTAL</span>
            <span class="text-glow">฿{total.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={product.availableStock === 0}
          class="w-full h-11 font-pixel text-[10px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {product.availableStock === 0 ? 'SOLD_OUT' : 'BUY_NOW ▶'}
        </button>

        <p class="font-mono text-[10px] text-muted-foreground text-center">
          &gt; ระบบจะหักเครดิตจาก wallet ของคุณ<br />
          &gt; คีย์จะถูกส่งทันทีหลังชำระเงิน
        </p>
      </aside>
    </div>
  </section>

  <Footer />
</div>
