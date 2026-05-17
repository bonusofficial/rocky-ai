<script lang="ts">
  import { page } from '$app/state';

  let { children } = $props();

  const sections = [
    { href: '/admin', label: 'DASHBOARD', match: (p: string) => p === '/admin' },
    {
      href: '/admin/users',
      label: 'USERS',
      match: (p: string) => p.startsWith('/admin/users')
    },
    {
      href: '/admin/categories',
      label: 'CATEGORIES',
      match: (p: string) => p.startsWith('/admin/categories')
    },
    {
      href: '/admin/products',
      label: 'PRODUCTS',
      match: (p: string) => p.startsWith('/admin/products')
    },
    {
      href: '/admin/stock',
      label: 'STOCK',
      match: (p: string) => p.startsWith('/admin/stock')
    },
    {
      href: '/admin/orders',
      label: 'ORDERS',
      match: (p: string) => p.startsWith('/admin/orders')
    },
    {
      href: '/admin/topups',
      label: 'TOPUPS',
      match: (p: string) => p.startsWith('/admin/topups')
    }
  ];

  const currentPath = $derived(page.url.pathname);
</script>

<div class="min-h-screen bg-background flex flex-col">
  <!-- top bar -->
  <header class="border-b-2 border-border bg-card relative z-10">
    <div class="px-4 md:px-6 h-14 flex items-center justify-between gap-4">
      <a href="/admin" class="flex items-center gap-3 min-w-0">
        <img
          src="/icon.png"
          alt=""
          width="28"
          height="28"
          class="w-7 h-7 flex-shrink-0"
          style="image-rendering: pixelated"
        />
        <div class="flex flex-col leading-none min-w-0">
          <span class="font-pixel text-[11px] text-glow truncate">ADMIN_PANEL</span>
          <span class="font-pixel text-[7px] text-muted-foreground mt-1 truncate">
            ROCKY AI · CONTROL_DECK
          </span>
        </div>
      </a>

      <div class="flex items-center gap-3">
        <span
          class="hidden md:inline-flex items-center font-pixel text-[9px] bg-muted text-foreground px-2 py-1 border border-border"
        >
          <span class="blink mr-1">▶</span> ADMIN: rocky_root
        </span>
        <a href="/" class="font-pixel text-[9px] text-muted-foreground hover:text-primary">
          EXIT ▶
        </a>
      </div>
    </div>
  </header>

  <!-- mobile horizontal nav -->
  <nav
    aria-label="Admin sections"
    class="md:hidden border-b-2 border-border bg-card overflow-x-auto"
  >
    <ul class="flex">
      {#each sections as s (s.href)}
        <li class="flex-shrink-0">
          <a
            href={s.href}
            aria-current={s.match(currentPath) ? 'page' : undefined}
            class="block px-4 py-3 font-pixel text-[9px] border-r border-border whitespace-nowrap {s.match(
              currentPath
            )
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-primary hover:bg-muted'}"
          >
            {s.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <div class="flex-1 flex min-h-0">
    <!-- desktop sidebar -->
    <aside
      class="hidden md:flex w-56 lg:w-64 flex-shrink-0 border-r-2 border-border bg-card flex-col"
    >
      <div class="p-3 border-b border-border">
        <span class="font-mono text-[10px] text-muted-foreground">// NAVIGATION</span>
      </div>
      <ul class="flex-1 p-3 space-y-1">
        {#each sections as s (s.href)}
          <li>
            <a
              href={s.href}
              aria-current={s.match(currentPath) ? 'page' : undefined}
              class="flex items-center gap-2 px-3 py-2.5 font-pixel text-[10px] border-2 transition-colors {s.match(
                currentPath
              )
                ? 'bg-primary text-primary-foreground border-border shadow-pixel'
                : 'border-transparent text-muted-foreground hover:text-primary hover:border-border hover:bg-muted'}"
            >
              <span class="w-2 inline-block">
                {#if s.match(currentPath)}<span class="blink">▶</span>{:else}·{/if}
              </span>
              {s.label}
            </a>
          </li>
        {/each}
      </ul>
      <div class="p-3 border-t border-border space-y-1">
        <div class="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
          <span class="w-2 h-2 bg-primary blink"></span> SYSTEM_OK
        </div>
        <div class="font-mono text-[10px] text-muted-foreground">v1.0.50 · ROCKY_AI</div>
      </div>
    </aside>

    <main class="flex-1 min-w-0 bg-background">
      {@render children()}
    </main>
  </div>
</div>
