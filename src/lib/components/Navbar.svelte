<script lang="ts">
  import { page } from '$app/state';
  import { enhance, applyAction } from '$app/forms';
  import { goto } from '$app/navigation';

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/store', label: 'STORE' },
    { href: '/topup', label: 'TOPUP' },
    { href: '#features', label: 'FEATURES' },
    { href: '#faq', label: 'FAQ' }
  ];

  const currentUser = $derived(page.data.user);

  let isAuthOpen = $state(false);
  let isMobileMenuOpen = $state(false);
  let isUserMenuOpen = $state(false);
  let activeTab = $state<'login' | 'register'>('login');
  let loginError = $state<string | null>(null);
  let registerError = $state<string | null>(null);
  let submitting = $state(false);

  // Auto-open auth modal when arriving with ?login=1 or ?register=1
  $effect(() => {
    const url = page.url;
    if (url.searchParams.get('login') === '1') {
      activeTab = 'login';
      isAuthOpen = true;
    } else if (url.searchParams.get('register') === '1') {
      activeTab = 'register';
      isAuthOpen = true;
    }
  });

  const openAuth = (tab: 'login' | 'register' = 'login') => {
    activeTab = tab;
    isAuthOpen = true;
    isMobileMenuOpen = false;
    loginError = null;
    registerError = null;
  };

  const closeAuth = () => {
    isAuthOpen = false;
  };

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen = false;
  };

  const stopPropagation = (event: Event) => {
    event.stopPropagation();
  };
</script>

<header class="border-b border-border relative z-10">
  <div class="container flex items-center justify-between py-5">
    <a href="/" class="flex items-center gap-3">
      <img
        src="/icon.png"
        alt="Rocky AI"
        width="32"
        height="32"
        class="w-8 h-8"
        style="image-rendering: pixelated"
      />
      <div class="flex flex-col leading-none">
        <span class="font-pixel text-sm text-glow">ROCKY AI</span>
        <span class="font-pixel text-[7px] text-muted-foreground mt-1">
          AI INNOVATIONS &amp; GOODS
        </span>
      </div>
    </a>

    <nav class="hidden md:flex items-center gap-8 font-pixel text-[10px] text-muted-foreground">
      {#each navItems as item (item.href)}
        <a href={item.href} class="hover:text-primary transition-colors">{item.label}</a>
      {/each}
    </nav>

    <div class="flex items-center gap-3">
      {#if currentUser}
        <div class="relative">
          <button
            type="button"
            onclick={() => (isUserMenuOpen = !isUserMenuOpen)}
            class="inline-flex items-center gap-2 h-9 px-3 font-pixel text-[10px] border-2 border-border bg-card hover:border-primary transition-colors"
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
          >
            <span class="w-5 h-5 grid place-items-center bg-primary text-primary-foreground font-pixel text-[8px] border border-border">
              {currentUser.username.slice(0, 2).toUpperCase()}
            </span>
            <span class="hidden sm:inline truncate max-w-[120px]">{currentUser.username.toUpperCase()}</span>
            <span class="font-pixel text-[8px] text-muted-foreground">▼</span>
          </button>

          {#if isUserMenuOpen}
            <div
              role="presentation"
              class="fixed inset-0 z-30"
              onclick={() => (isUserMenuOpen = false)}
              onkeydown={(e) => e.key === 'Escape' && (isUserMenuOpen = false)}
            ></div>
            <div
              role="menu"
              class="absolute right-0 top-full mt-2 w-56 z-40 border-2 border-border bg-card shadow-pixel"
              onclick={stopPropagation}
              onkeydown={stopPropagation}
            >
              <div class="px-3 py-3 border-b border-border">
                <div class="font-pixel text-[10px]">{currentUser.username.toUpperCase()}</div>
                <div class="font-mono text-[10px] text-muted-foreground truncate mt-1">{currentUser.email}</div>
                <div class="font-pixel text-[9px] mt-2">
                  <span class="bg-primary text-primary-foreground px-2 py-0.5 border border-border">
                    {currentUser.rank.toUpperCase()}
                  </span>
                  <span class="ml-2 text-glow">฿{currentUser.credit.toLocaleString()}</span>
                </div>
              </div>
              <ul class="py-1 font-pixel text-[10px]">
                <li><a href="/profile" class="block px-3 py-2 hover:bg-muted hover:text-primary">▶ PROFILE</a></li>
                <li><a href="/history" class="block px-3 py-2 hover:bg-muted hover:text-primary">▶ ORDER_HISTORY</a></li>
                <li><a href="/topup" class="block px-3 py-2 hover:bg-muted hover:text-primary">▶ TOPUP</a></li>
                {#if currentUser.rank === 'Admin'}
                  <li><a href="/admin" class="block px-3 py-2 hover:bg-muted text-destructive">▶ ADMIN_PANEL</a></li>
                {/if}
                <li class="border-t border-border mt-1 pt-1">
                  <form method="POST" action="/logout" use:enhance>
                    <button type="submit" class="w-full text-left px-3 py-2 hover:bg-destructive hover:text-background">▶ LOGOUT</button>
                  </form>
                </li>
              </ul>
            </div>
          {/if}
        </div>
      {:else}
        <button
          type="button"
          class="desktop-login inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors h-9 px-3 font-pixel text-[10px] shadow-pixel bg-primary text-primary-foreground hover:bg-primary-glow rounded-none"
          onclick={() => openAuth('login')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 mr-1">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          LOGIN
        </button>
      {/if}

      <button
        type="button"
        class="mobile-menu-trigger hidden sm:inline-flex md:hidden h-9 w-9 items-center justify-center border-2 border-border bg-card text-primary shadow-pixel"
        onclick={toggleMobileMenu}
        aria-label="Open menu"
        aria-expanded={isMobileMenuOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
          {#if isMobileMenuOpen}
            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
          {:else}
            <path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>
          {/if}
        </svg>
      </button>
    </div>
  </div>
</header>

<style>
  .mobile-menu-trigger { display: none; }
  @media (min-width: 640px) and (max-width: 767px) { .mobile-menu-trigger { display: inline-flex; } }
  @media (min-width: 768px) { .mobile-menu-trigger { display: none; } }
</style>

{#if isMobileMenuOpen}
  <div
    class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
    onclick={closeMobileMenu}
    onkeydown={(event) => event.key === 'Escape' && closeMobileMenu()}
    role="presentation"
    tabindex="-1"
  >
    <aside
      class="fixed right-0 top-0 h-full w-[82vw] max-w-xs border-l-2 border-primary bg-card p-5 shadow-lg shadow-pixel"
      onclick={stopPropagation}
      onkeydown={stopPropagation}
      role="presentation"
    >
      <div class="mb-6 flex items-center gap-3">
        <img src="/icon.png" alt="Rocky AI" width="32" height="32" class="w-8 h-8" style="image-rendering: pixelated" />
        <div class="flex flex-col leading-none">
          <span class="font-pixel text-sm text-glow">ROCKY AI</span>
          <span class="font-pixel text-[7px] text-muted-foreground mt-1">MOBILE_MENU</span>
        </div>
      </div>

      {#if currentUser}
        <div class="mb-4 p-3 border-2 border-border bg-background">
          <div class="font-pixel text-[10px]">{currentUser.username.toUpperCase()}</div>
          <div class="font-mono text-[10px] text-muted-foreground truncate mt-1">{currentUser.email}</div>
          <div class="font-pixel text-[9px] text-glow mt-2">฿{currentUser.credit.toLocaleString()}</div>
        </div>
      {/if}

      <nav class="flex flex-col gap-3 font-pixel text-[11px] text-muted-foreground">
        {#each navItems as item (item.href)}
          <a href={item.href} class="border-2 border-border bg-background px-4 py-3 hover:border-primary hover:text-primary" onclick={closeMobileMenu}>
            {item.label}
          </a>
        {/each}
        {#if currentUser}
          <a href="/profile" class="border-2 border-border bg-background px-4 py-3 hover:border-primary hover:text-primary" onclick={closeMobileMenu}>PROFILE</a>
          <a href="/history" class="border-2 border-border bg-background px-4 py-3 hover:border-primary hover:text-primary" onclick={closeMobileMenu}>HISTORY</a>
          {#if currentUser.rank === 'Admin'}
            <a href="/admin" class="border-2 border-destructive bg-background px-4 py-3 text-destructive hover:bg-destructive hover:text-background" onclick={closeMobileMenu}>ADMIN_PANEL</a>
          {/if}
        {/if}
      </nav>

      {#if currentUser}
        <form method="POST" action="/logout" use:enhance class="mt-6">
          <button type="submit" class="w-full inline-flex items-center justify-center h-10 px-4 font-pixel text-[10px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">
            LOGOUT ×
          </button>
        </form>
      {:else}
        <button
          type="button"
          class="mt-6 inline-flex w-full items-center justify-center gap-2 h-10 px-4 py-2 font-pixel text-[10px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel rounded-none"
          onclick={() => openAuth('login')}
        >
          LOGIN
        </button>
      {/if}
    </aside>
  </div>
{/if}

{#if isAuthOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
    onclick={closeAuth}
    onkeydown={(event) => event.key === 'Escape' && closeAuth()}
    role="presentation"
    tabindex="-1"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      class="relative z-50 grid w-full max-w-md gap-4 border-2 border-primary bg-card p-6 shadow-lg shadow-pixel"
      onclick={stopPropagation}
      onkeydown={stopPropagation}
    >
      <div class="flex flex-col space-y-1.5">
        <h2 id="auth-modal-title" class="font-pixel text-sm text-glow flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </svg>
          {activeTab === 'login' ? 'LOGIN_TO_ROCKY' : 'CREATE_ACCOUNT'}
        </h2>
        <p class="font-mono text-[11px] text-muted-foreground">
          &gt; {activeTab === 'login' ? 'เข้าสู่ระบบเพื่อจัดการคีย์และเติมเงิน' : 'สมัครฟรี เริ่มสะสมเครดิตได้ทันที'}
        </p>
      </div>

      <div class="grid w-full grid-cols-2 bg-muted rounded-none border-2 border-border h-auto p-0">
        <button
          type="button"
          class="font-pixel text-[10px] py-2 transition-all {activeTab === 'login' ? 'bg-primary text-primary-foreground' : ''}"
          onclick={() => { activeTab = 'login'; loginError = null; registerError = null; }}
        >LOGIN</button>
        <button
          type="button"
          class="font-pixel text-[10px] py-2 transition-all {activeTab === 'register' ? 'bg-primary text-primary-foreground' : ''}"
          onclick={() => { activeTab = 'register'; loginError = null; registerError = null; }}
        >REGISTER</button>
      </div>

      {#if activeTab === 'login'}
        <form
          method="POST"
          action="/login"
          use:enhance={() => {
            submitting = true;
            loginError = null;
            return async ({ result }) => {
              submitting = false;
              if (result.type === 'redirect') {
                isAuthOpen = false;
                await goto(result.location, { invalidateAll: true });
              } else if (result.type === 'failure') {
                loginError =
                  (result.data as { error?: string } | null)?.error ?? 'LOGIN_FAILED';
              } else {
                await applyAction(result);
              }
            };
          }}
          class="space-y-4 mt-3"
        >
          <div class="space-y-2">
            <label for="login-id" class="font-pixel text-[9px] text-muted-foreground">USERNAME_OR_EMAIL</label>
            <input
              id="login-id"
              type="text"
              name="identifier"
              required
              autocomplete="username"
              class="flex h-10 w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
              placeholder="rockyuser หรือ you@example.com"
            />
          </div>
          <div class="space-y-2">
            <label for="login-pw" class="font-pixel text-[9px] text-muted-foreground">PASSWORD</label>
            <input
              id="login-pw"
              type="password"
              name="password"
              required
              autocomplete="current-password"
              class="flex h-10 w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {#if loginError}
            <div class="border border-destructive bg-destructive/10 px-3 py-2 font-mono text-[11px] text-destructive">
              [ERR] {loginError}
            </div>
          {/if}

          <button
            type="submit"
            disabled={submitting}
            class="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel disabled:opacity-60"
          >
            {submitting ? 'PROCESSING...' : 'LOGIN ▶'}
          </button>

          <div class="text-center font-mono text-[10px] text-muted-foreground">
            ยังไม่มีบัญชี?
            <button type="button" class="text-primary hover:underline font-pixel text-[10px]" onclick={() => (activeTab = 'register')}>REGISTER</button>
          </div>
        </form>
      {:else}
        <form
          method="POST"
          action="/register"
          use:enhance={() => {
            submitting = true;
            registerError = null;
            return async ({ result }) => {
              submitting = false;
              if (result.type === 'redirect') {
                isAuthOpen = false;
                await goto(result.location, { invalidateAll: true });
              } else if (result.type === 'failure') {
                registerError =
                  (result.data as { error?: string } | null)?.error ?? 'REGISTER_FAILED';
              } else {
                await applyAction(result);
              }
            };
          }}
          class="space-y-4 mt-3"
        >
          <div class="space-y-2">
            <label for="reg-username" class="font-pixel text-[9px] text-muted-foreground">USERNAME (3-32, a-z 0-9 . _ -)</label>
            <input
              id="reg-username"
              type="text"
              name="username"
              required
              minlength="3"
              maxlength="32"
              pattern="[a-zA-Z0-9_.\-]+"
              autocomplete="username"
              class="flex h-10 w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
              placeholder="rockyuser"
            />
          </div>
          <div class="space-y-2">
            <label for="reg-email" class="font-pixel text-[9px] text-muted-foreground">EMAIL</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              required
              autocomplete="email"
              class="flex h-10 w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div class="space-y-2">
            <label for="reg-pw" class="font-pixel text-[9px] text-muted-foreground">PASSWORD (min 6)</label>
            <input
              id="reg-pw"
              type="password"
              name="password"
              required
              minlength="6"
              autocomplete="new-password"
              class="flex h-10 w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {#if registerError}
            <div class="border border-destructive bg-destructive/10 px-3 py-2 font-mono text-[11px] text-destructive">
              [ERR] {registerError}
            </div>
          {/if}

          <button
            type="submit"
            disabled={submitting}
            class="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 w-full font-pixel text-[10px] rounded-none bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel disabled:opacity-60"
          >
            {submitting ? 'PROCESSING...' : 'REGISTER ▶'}
          </button>

          <div class="text-center font-mono text-[10px] text-muted-foreground">
            มีบัญชีแล้ว?
            <button type="button" class="text-primary hover:underline font-pixel text-[10px]" onclick={() => (activeTab = 'login')}>LOGIN</button>
          </div>
        </form>
      {/if}

      <button
        type="button"
        class="absolute right-4 top-4 opacity-70 hover:opacity-100"
        onclick={closeAuth}
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
  </div>
{/if}
