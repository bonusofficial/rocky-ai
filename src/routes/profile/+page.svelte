<script lang="ts">
  import { untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import DashboardNav from '$lib/components/DashboardNav.svelte';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const user = $derived(data.user!);

  const memberSince = $derived(new Date(user.createdAt).toISOString().slice(0, 10));
  const avatarSeed = $derived(user.username.slice(0, 2).toUpperCase());
  const uid = $derived(user.id.slice(-6).toUpperCase());

  const stats = $derived([
    { label: 'BALANCE', value: `฿${user.credit.toLocaleString()}` },
    { label: 'TOTAL_CREDIT', value: `฿${user.totalCredit.toLocaleString()}` },
    { label: 'RANK', value: user.rank.toUpperCase() }
  ]);

  let editingUsername = $state(false);
  let editingEmail = $state(false);
  let usernameInput = $state(untrack(() => data.user!.username));
  let emailInput = $state(untrack(() => data.user!.email));

  let showPasswordForm = $state(false);
  let twoFA = $state(false);
  let notifEmail = $state(true);
  let notifLine = $state(true);
  let notifPromo = $state(false);

  const recent: Array<{ id: string; product: string; amount: number; status: string; date: string }> = [];
</script>

<svelte:head>
  <title>Profile — Rocky AI</title>
  <meta
    name="description"
    content="จัดการข้อมูลบัญชี กระเป๋าเงิน และการแจ้งเตือนของคุณที่ Rocky AI"
  />
</svelte:head>

<div class="min-h-screen bg-background relative overflow-hidden">
  <Navbar />

  <section class="container relative py-10 md:py-14 space-y-8">
    <header class="space-y-4">
      <div class="font-mono text-[11px] text-muted-foreground">// USER_CONSOLE</div>
      <h1 class="font-pixel text-xl md:text-3xl leading-relaxed text-glow">
        PROFILE<span class="blink">_</span>
      </h1>
      <p class="font-mono text-sm text-muted-foreground max-w-xl leading-relaxed">
        &gt; ยินดีต้อนรับ <span class="text-primary">{user.username}</span><br />
        &gt; จัดการข้อมูลบัญชี เครดิต และการตั้งค่าการแจ้งเตือน
      </p>
    </header>

    <DashboardNav current="profile" />

    {#if form?.success}
      <div class="border-2 border-primary bg-primary/10 p-3 font-mono text-[11px] flex items-center gap-2">
        <span class="font-pixel text-[10px] text-primary">[OK]</span>
        {form.passwordChanged ? 'เปลี่ยนรหัสผ่านเรียบร้อย' : 'อัปเดตข้อมูลเรียบร้อย'}
      </div>
    {:else if form?.error}
      <div class="border-2 border-destructive bg-card p-3 font-mono text-[11px] flex items-center gap-2">
        <span class="font-pixel text-[10px] text-destructive">[ERR]</span>
        {form.error}
      </div>
    {/if}

    <!-- identity + wallet -->
    <div class="grid md:grid-cols-3 gap-4">
      <div class="md:col-span-2 border-2 border-border bg-card p-5 md:p-6 shadow-pixel">
        <div class="flex items-start gap-4 md:gap-5">
          <div
            class="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 grid place-items-center bg-primary text-primary-foreground font-pixel text-lg md:text-xl border-2 border-border shadow-pixel"
            style="image-rendering: pixelated"
            aria-hidden="true"
          >
            {avatarSeed}
          </div>

          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-pixel text-sm md:text-base text-foreground">
                {user.username.toUpperCase()}
              </span>
              <span
                class="font-pixel text-[9px] {user.rank === 'Admin' ? 'bg-destructive text-background' : 'bg-primary text-primary-foreground'} px-2 py-0.5 border border-border"
              >
                {user.rank.toUpperCase()}
              </span>
            </div>
            <div class="font-mono text-[11px] text-muted-foreground break-all">
              &gt; {user.email}
            </div>
            <div class="font-mono text-[10px] text-muted-foreground">
              JOINED {memberSince} · UID #{uid}
            </div>
          </div>
        </div>
      </div>

      <div
        class="border-2 border-primary bg-card p-5 md:p-6 shadow-pixel relative overflow-hidden flex flex-col"
      >
        <div class="font-pixel text-[9px] text-muted-foreground mb-2">// CREDIT</div>
        <div class="font-pixel text-2xl md:text-3xl text-glow">
          ฿{user.credit.toLocaleString()}
        </div>
        <div class="font-mono text-[10px] text-muted-foreground mt-1">
          AVAILABLE_BALANCE
        </div>
        <a
          href="/topup"
          class="mt-4 inline-flex items-center justify-center gap-2 h-10 font-pixel text-[10px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel rounded-none"
        >
          TOPUP NOW ▶
        </a>
      </div>
    </div>

    <!-- stats -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      {#each stats as s (s.label)}
        <div class="border-2 border-border bg-card p-4 md:p-5 shadow-pixel">
          <div class="font-mono text-[10px] text-muted-foreground">// {s.label}</div>
          <div class="font-pixel text-lg md:text-xl text-glow mt-2">{s.value}</div>
        </div>
      {/each}
    </div>

    <!-- account info + security -->
    <div class="grid lg:grid-cols-2 gap-4">
      <form
        method="POST"
        action="?/updateAccount"
        use:enhance
        class="border-2 border-border bg-card p-5 md:p-6 shadow-pixel space-y-4"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-pixel text-[11px] text-foreground">// ACCOUNT_INFO</h2>
          <span class="font-mono text-[10px] text-muted-foreground">EDITABLE</span>
        </div>

        <div class="space-y-1.5">
          <label for="f-username" class="font-pixel text-[9px] text-muted-foreground">USERNAME</label>
          <div class="flex gap-2">
            <input
              id="f-username"
              type="text"
              name="username"
              bind:value={usernameInput}
              readonly={!editingUsername}
              class="flex-1 h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none {editingUsername ? '' : 'opacity-80'}"
            />
            <button
              type="button"
              onclick={() => (editingUsername = !editingUsername)}
              class="h-10 px-3 border-2 border-border bg-muted text-foreground font-pixel text-[9px] hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {editingUsername ? 'CANCEL' : 'EDIT'}
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="f-email" class="font-pixel text-[9px] text-muted-foreground">EMAIL</label>
          <div class="flex gap-2">
            <input
              id="f-email"
              type="email"
              name="email"
              bind:value={emailInput}
              readonly={!editingEmail}
              class="flex-1 h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none {editingEmail ? '' : 'opacity-80'}"
            />
            <button
              type="button"
              onclick={() => (editingEmail = !editingEmail)}
              class="h-10 px-3 border-2 border-border bg-muted text-foreground font-pixel text-[9px] hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {editingEmail ? 'CANCEL' : 'EDIT'}
            </button>
          </div>
        </div>

        {#if editingUsername || editingEmail}
          <button
            type="submit"
            class="h-10 px-4 font-pixel text-[10px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel"
          >
            SAVE_CHANGES ▶
          </button>
        {/if}

        <div class="border-t border-border pt-3 space-y-1 font-mono text-[10px] text-muted-foreground">
          <div>UID #{uid}</div>
          <div>JOINED {memberSince}</div>
          <div>RANK · {user.rank}</div>
        </div>
      </form>

      <div class="space-y-4">
        <div class="border-2 border-border bg-card p-5 md:p-6 shadow-pixel space-y-4">
          <h2 class="font-pixel text-[11px] text-foreground">// SECURITY</h2>

          <div class="border border-border p-3">
            <div class="flex items-center justify-between gap-3 mb-2">
              <div class="min-w-0">
                <div class="font-pixel text-[10px]">PASSWORD</div>
                <div class="font-mono text-[10px] text-muted-foreground mt-1">
                  เปลี่ยนรหัสผ่านเป็นประจำเพื่อความปลอดภัย
                </div>
              </div>
              <button
                type="button"
                onclick={() => (showPasswordForm = !showPasswordForm)}
                class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground flex-shrink-0"
              >
                {showPasswordForm ? 'CLOSE' : 'CHANGE ▶'}
              </button>
            </div>

            {#if showPasswordForm}
              <form
                method="POST"
                action="?/changePassword"
                use:enhance={() =>
                  async ({ result, update }) => {
                    if (result.type === 'success') {
                      showPasswordForm = false;
                    }
                    await update();
                  }}
                class="space-y-2 mt-3"
              >
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="CURRENT_PASSWORD"
                  class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
                />
                <input
                  type="password"
                  name="newPassword"
                  required
                  minlength="6"
                  placeholder="NEW_PASSWORD (min 6)"
                  class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  class="h-9 px-3 font-pixel text-[9px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel"
                >
                  UPDATE_PASSWORD ▶
                </button>
              </form>
            {/if}
          </div>

          <div class="border border-border p-3 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <div class="font-pixel text-[10px]">TWO_FACTOR_AUTH</div>
              <div class="font-mono text-[10px] text-muted-foreground mt-1">
                {twoFA ? 'ENABLED — SMS + LINE' : 'NOT_ENABLED · COMING_SOON'}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={twoFA}
              aria-label="Two-factor authentication"
              disabled
              onclick={() => (twoFA = !twoFA)}
              class="relative h-7 w-14 border-2 border-border shadow-pixel flex-shrink-0 opacity-50 cursor-not-allowed {twoFA ? 'bg-primary' : 'bg-muted'}"
            >
              <span
                class="absolute top-0.5 w-4 h-4 bg-background border border-border transition-all {twoFA ? 'right-0.5' : 'left-0.5'}"
              ></span>
            </button>
          </div>

          <form method="POST" action="/logout" use:enhance>
            <button
              type="submit"
              class="w-full h-10 font-pixel text-[10px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background transition-colors"
            >
              LOGOUT ×
            </button>
          </form>
        </div>

        <div class="border-2 border-border bg-card p-5 md:p-6 shadow-pixel space-y-3">
          <h2 class="font-pixel text-[11px] text-foreground">// NOTIFICATIONS</h2>
          <div class="font-mono text-[10px] text-muted-foreground">
            // หมายเหตุ: การตั้งค่าฝั่งนี้ยังเก็บในเครื่องชั่วคราว
          </div>

          {#each [
            { key: 'email', label: 'EMAIL_UPDATES', get: () => notifEmail, set: (v: boolean) => (notifEmail = v) },
            { key: 'line', label: 'LINE_ALERTS', get: () => notifLine, set: (v: boolean) => (notifLine = v) },
            { key: 'promo', label: 'PROMO_OFFERS', get: () => notifPromo, set: (v: boolean) => (notifPromo = v) }
          ] as item (item.key)}
            <div class="border border-border p-3 flex items-center justify-between gap-3">
              <div class="font-pixel text-[10px]">{item.label}</div>
              <button
                type="button"
                role="switch"
                aria-checked={item.get()}
                aria-label={item.label}
                onclick={() => item.set(!item.get())}
                class="relative h-6 w-12 border-2 border-border shadow-pixel flex-shrink-0 {item.get() ? 'bg-primary' : 'bg-muted'}"
              >
                <span
                  class="absolute top-0.5 w-3 h-3 bg-background border border-border transition-all {item.get() ? 'right-0.5' : 'left-0.5'}"
                ></span>
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- recent orders preview -->
    <div class="border-2 border-border bg-card p-5 md:p-6 shadow-pixel">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-pixel text-[11px] text-foreground">// RECENT_ORDERS</h2>
        <a href="/history" class="font-pixel text-[10px] text-primary hover:underline">
          VIEW_ALL ▶
        </a>
      </div>
      {#if recent.length === 0}
        <div class="font-mono text-[11px] text-muted-foreground py-4 text-center">
          &gt; ยังไม่มีคำสั่งซื้อ — ไปเลือกสินค้าที่ <a href="/store" class="text-primary hover:underline">/store</a>
        </div>
      {:else}
        <ul class="divide-y divide-border font-mono text-[11px]">
          {#each recent as o (o.id)}
            <li class="py-3 grid grid-cols-[auto,1fr,auto] gap-3 items-center">
              <span class="text-muted-foreground text-[10px]">[{o.date}]</span>
              <span class="truncate">
                <span class="text-muted-foreground">#{o.id}</span>
                <span class="text-foreground ml-2 font-pixel text-[9px]">{o.product}</span>
              </span>
              <span class="font-pixel text-[10px]">฿{o.amount}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>

  <Footer />
</div>
