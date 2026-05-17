<script lang="ts">
  type Role = 'USER' | 'VIP' | 'ADMIN';
  type Status = 'ACTIVE' | 'SUSPENDED';

  interface User {
    id: string;
    username: string;
    email: string;
    balance: number;
    role: Role;
    status: Status;
    joined: string;
    orders: number;
  }

  const users: User[] = [
    { id: '00042', username: 'rockyuser', email: 'rocky@example.com', balance: 1280, role: 'VIP', status: 'ACTIVE', joined: '2025-12-04', orders: 24 },
    { id: '00041', username: 'pixel_kid', email: 'kid@example.com', balance: 320, role: 'USER', status: 'ACTIVE', joined: '2026-01-12', orders: 7 },
    { id: '00040', username: 'neo_dev', email: 'neo@example.com', balance: 0, role: 'USER', status: 'SUSPENDED', joined: '2026-02-20', orders: 3 },
    { id: '00039', username: 'mira88', email: 'mira@example.com', balance: 4500, role: 'VIP', status: 'ACTIVE', joined: '2025-10-30', orders: 41 },
    { id: '00001', username: 'rocky_root', email: 'admin@rocky.ai', balance: 0, role: 'ADMIN', status: 'ACTIVE', joined: '2025-08-01', orders: 0 }
  ];

  const roles = ['ALL', 'USER', 'VIP', 'ADMIN'] as const;
  const statuses = ['ALL', 'ACTIVE', 'SUSPENDED'] as const;

  let search = $state('');
  let activeRole = $state<(typeof roles)[number]>('ALL');
  let activeStatus = $state<(typeof statuses)[number]>('ALL');
  let expanded = $state<Record<string, boolean>>({});

  const visible = $derived(
    users.filter((u) => {
      if (activeRole !== 'ALL' && u.role !== activeRole) return false;
      if (activeStatus !== 'ALL' && u.status !== activeStatus) return false;
      if (search && !`${u.username} ${u.email} ${u.id}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    })
  );

  const stats = $derived({
    total: users.length,
    active: users.filter((u) => u.status === 'ACTIVE').length,
    suspended: users.filter((u) => u.status === 'SUSPENDED').length
  });

  function roleClass(r: Role) {
    return r === 'ADMIN'
      ? 'bg-destructive text-background'
      : r === 'VIP'
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted text-foreground';
  }

  function statusClass(s: Status) {
    return s === 'ACTIVE' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-background';
  }
</script>

<svelte:head><title>Users — Admin</title></svelte:head>

<div class="p-4 md:p-8 space-y-6 max-w-6xl">
  <header class="space-y-2">
    <div class="font-mono text-[11px] text-muted-foreground">// USER_REGISTRY</div>
    <h1 class="font-pixel text-xl md:text-2xl text-glow">USERS<span class="blink">_</span></h1>
    <p class="font-mono text-[12px] text-muted-foreground">
      &gt; ค้นหา ตรวจสอบ และจัดการบัญชีผู้ใช้ทั้งหมด
    </p>
  </header>

  <div class="grid grid-cols-3 gap-3">
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// TOTAL</div>
      <div class="font-pixel text-lg md:text-xl text-glow mt-2">{stats.total}</div>
    </div>
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// ACTIVE</div>
      <div class="font-pixel text-lg md:text-xl text-glow mt-2">{stats.active}</div>
    </div>
    <div class="border-2 border-border bg-card p-4 shadow-pixel">
      <div class="font-mono text-[10px] text-muted-foreground">// SUSPENDED</div>
      <div class="font-pixel text-lg md:text-xl text-destructive mt-2">{stats.suspended}</div>
    </div>
  </div>

  <div class="space-y-3">
    <div class="flex flex-wrap gap-2">
      <span class="font-pixel text-[9px] text-muted-foreground self-center mr-1">ROLE:</span>
      {#each roles as r (r)}
        <button
          type="button"
          onclick={() => (activeRole = r)}
          class="h-8 px-3 font-pixel text-[9px] border-2 border-border transition-colors {activeRole === r ? 'bg-primary text-primary-foreground shadow-pixel' : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'}"
        >{r}</button>
      {/each}
    </div>
    <div class="flex flex-wrap gap-2">
      <span class="font-pixel text-[9px] text-muted-foreground self-center mr-1">STATUS:</span>
      {#each statuses as s (s)}
        <button
          type="button"
          onclick={() => (activeStatus = s)}
          class="h-8 px-3 font-pixel text-[9px] border-2 border-border transition-colors {activeStatus === s ? 'bg-primary text-primary-foreground shadow-pixel' : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'}"
        >{s}</button>
      {/each}
    </div>
    <div class="relative max-w-md">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted-foreground pointer-events-none">&gt;</span>
      <input
        type="text"
        bind:value={search}
        placeholder="SEARCH_USERNAME_EMAIL_OR_UID..."
        class="w-full h-10 pl-7 pr-3 border-2 border-border bg-background font-mono text-[12px] rounded-none focus:border-primary focus:outline-none"
      />
    </div>
  </div>

  <div class="border-2 border-border bg-card shadow-pixel">
    <div class="hidden md:grid grid-cols-[80px,1fr,110px,90px,110px,32px] gap-3 px-4 py-3 border-b-2 border-border font-pixel text-[9px] text-muted-foreground">
      <span>UID</span><span>USER</span><span>BALANCE</span><span>ROLE</span><span>STATUS</span><span></span>
    </div>

    {#if visible.length === 0}
      <div class="px-6 py-12 text-center font-mono text-[11px] text-muted-foreground">
        &gt; NO_USERS_FOUND
      </div>
    {:else}
      <ul class="divide-y divide-border">
        {#each visible as u (u.id)}
          <li>
            <button
              type="button"
              onclick={() => (expanded[u.id] = !expanded[u.id])}
              class="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors"
              aria-expanded={!!expanded[u.id]}
            >
              <div class="md:hidden space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-pixel text-[10px]">{u.username}</span>
                  <span class="font-pixel text-[9px] px-2 py-0.5 border border-border {statusClass(u.status)}">{u.status}</span>
                </div>
                <div class="flex items-center justify-between gap-2 font-mono text-[10px] text-muted-foreground">
                  <span class="truncate">#{u.id} · {u.email}</span>
                  <span class="font-pixel text-[10px] text-foreground">฿{u.balance.toLocaleString()}</span>
                </div>
              </div>
              <div class="hidden md:grid grid-cols-[80px,1fr,110px,90px,110px,32px] gap-3 items-center">
                <span class="font-mono text-[10px] text-muted-foreground">#{u.id}</span>
                <span class="truncate">
                  <span class="font-pixel text-[10px]">{u.username}</span>
                  <span class="block font-mono text-[10px] text-muted-foreground mt-0.5 truncate">{u.email}</span>
                </span>
                <span class="font-pixel text-[10px]">฿{u.balance.toLocaleString()}</span>
                <span class="font-pixel text-[9px] px-2 py-0.5 border border-border w-fit {roleClass(u.role)}">{u.role}</span>
                <span class="font-pixel text-[9px] px-2 py-0.5 border border-border w-fit {statusClass(u.status)}">{u.status}</span>
                <span class="grid place-items-center text-muted-foreground transition-transform {expanded[u.id] ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
              </div>
            </button>

            {#if expanded[u.id]}
              <div class="border-t border-border bg-background/60 px-4 py-4 grid md:grid-cols-2 gap-4 font-mono text-[11px]">
                <div class="space-y-3">
                  <div>
                    <div class="font-pixel text-[9px] text-muted-foreground">// JOINED</div>
                    <div class="mt-1">{u.joined}</div>
                  </div>
                  <div>
                    <div class="font-pixel text-[9px] text-muted-foreground">// LIFETIME_ORDERS</div>
                    <div class="mt-1">{u.orders}</div>
                  </div>
                  <div>
                    <div class="font-pixel text-[9px] text-muted-foreground">// ADJUST_BALANCE</div>
                    <div class="mt-1 flex gap-2">
                      <input type="number" placeholder="AMOUNT" class="flex-1 h-9 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none" />
                      <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">APPLY</button>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div>
                    <div class="font-pixel text-[9px] text-muted-foreground">// CHANGE_ROLE</div>
                    <div class="mt-1 flex gap-2 flex-wrap">
                      {#each ['USER', 'VIP', 'ADMIN'] as r}
                        <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-border {u.role === r ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-primary hover:text-primary-foreground'}">{r}</button>
                      {/each}
                    </div>
                  </div>
                  <div>
                    <div class="font-pixel text-[9px] text-muted-foreground">// MODERATION</div>
                    <div class="mt-1 flex gap-2 flex-wrap">
                      <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">RESET_PW</button>
                      {#if u.status === 'ACTIVE'}
                        <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">SUSPEND</button>
                      {:else}
                        <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">UNBAN</button>
                      {/if}
                      <button type="button" class="h-9 px-3 font-pixel text-[9px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">DELETE</button>
                    </div>
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
