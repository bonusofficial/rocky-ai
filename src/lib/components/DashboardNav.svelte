<script lang="ts">
  interface Props {
    current: 'profile' | 'history' | 'topup';
  }

  let { current }: Props = $props();

  const tabs = [
    { id: 'profile', href: '/profile', label: 'PROFILE' },
    { id: 'history', href: '/history', label: 'ORDER_HISTORY' },
    { id: 'topup', href: '/topup', label: 'TOPUP' }
  ] as const;
</script>

<nav
  aria-label="Account navigation"
  class="border-2 border-border bg-card shadow-pixel"
>
  <ul class="grid grid-cols-3 divide-x-2 divide-border">
    {#each tabs as tab (tab.id)}
      <li>
        <a
          href={tab.href}
          aria-current={current === tab.id ? 'page' : undefined}
          class="flex items-center justify-center gap-2 px-2 py-3 font-pixel text-[9px] md:text-[10px] transition-colors {current ===
          tab.id
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-primary hover:bg-muted'}"
        >
          {#if current === tab.id}
            <span class="blink">▶</span>
          {/if}
          {tab.label}
        </a>
      </li>
    {/each}
  </ul>
</nav>
