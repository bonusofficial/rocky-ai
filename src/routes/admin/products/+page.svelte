<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const products = $derived(data.products);
  const categories = $derived(data.categories);

  let search = $state('');
  let activeCategory = $state<string>('ALL');
  let showForm = $state(false);
  let editingId = $state<string | null>(null);

  let createImageUrl = $state<string | null>(null);
  let createImageName = $state<string>('');
  let createImageInput = $state<HTMLInputElement | null>(null);

  let editImageUrl = $state<string | null>(null);
  let editImageName = $state<string>('');
  let editImageInput = $state<HTMLInputElement | null>(null);
  let editClearImage = $state<boolean>(false);

  function pickImage(e: Event, setUrl: (v: string | null) => void, setName: (v: string) => void) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) {
      setUrl(null);
      setName('');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('FILE_TOO_LARGE — max 5 MB');
      (e.target as HTMLInputElement).value = '';
      return;
    }
    setUrl(URL.createObjectURL(file));
    setName(file.name);
  }

  function clearCreateImage() {
    if (createImageInput) createImageInput.value = '';
    if (createImageUrl) URL.revokeObjectURL(createImageUrl);
    createImageUrl = null;
    createImageName = '';
  }

  function clearEditImage() {
    if (editImageInput) editImageInput.value = '';
    if (editImageUrl) URL.revokeObjectURL(editImageUrl);
    editImageUrl = null;
    editImageName = '';
    editClearImage = true;
  }

  const categoryOptions = $derived([
    { id: 'ALL', label: 'ALL' },
    ...categories.map((c) => ({ id: c.id, label: c.name.toUpperCase() }))
  ]);

  const visible = $derived(
    products.filter((p) => {
      if (activeCategory !== 'ALL' && p.category.id !== activeCategory) return false;
      if (search && !`${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
  );

  function statusClass(s: string) {
    return s === 'ACTIVE'
      ? 'bg-primary text-primary-foreground'
      : s === 'DRAFT'
      ? 'bg-muted text-foreground'
      : 'bg-destructive text-background';
  }
</script>

<svelte:head><title>Products — Admin</title></svelte:head>

<div class="p-4 md:p-8 space-y-6 max-w-6xl">
  <header class="flex items-end justify-between gap-4 flex-wrap">
    <div class="space-y-2">
      <div class="font-mono text-[11px] text-muted-foreground">// CATALOG_ITEMS</div>
      <h1 class="font-pixel text-xl md:text-2xl text-glow">PRODUCTS<span class="blink">_</span></h1>
      <p class="font-mono text-[12px] text-muted-foreground">
        &gt; เพิ่ม แก้ไข และเปิด/ปิดการขายของแต่ละ SKU
      </p>
    </div>
    <button
      type="button"
      onclick={() => (showForm = !showForm)}
      disabled={categories.length === 0}
      class="h-10 px-4 font-pixel text-[10px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {showForm ? '× CANCEL' : '+ NEW_PRODUCT ▶'}
    </button>
  </header>

  {#if categories.length === 0}
    <div class="border-2 border-destructive bg-card p-3 font-mono text-[11px]">
      [WARN] ยังไม่มีหมวดหมู่ — สร้างที่ <a href="/admin/categories" class="text-primary hover:underline">/admin/categories</a> ก่อน
    </div>
  {/if}
  {#if data.loadError}
    <div class="border-2 border-destructive bg-card p-3 font-mono text-[11px] text-destructive">
      [ERR] {data.loadError}
    </div>
  {/if}
  {#if form?.success}
    <div class="border-2 border-primary bg-primary/10 p-3 font-mono text-[11px]">
      <span class="font-pixel text-[10px] text-primary">[OK]</span> {form.success}
    </div>
  {:else if form?.error}
    <div class="border-2 border-destructive bg-card p-3 font-mono text-[11px] text-destructive">
      [ERR] {form.error}
    </div>
  {/if}

  {#if showForm && categories.length > 0}
    <form
      method="POST"
      action="?/create"
      enctype="multipart/form-data"
      use:enhance={() => async ({ result, update }) => {
        if (result.type === 'success') {
          showForm = false;
          clearCreateImage();
        }
        await update();
      }}
      class="border-2 border-primary bg-card p-5 md:p-6 shadow-pixel space-y-4"
    >
      <h2 class="font-pixel text-[11px]">// NEW_PRODUCT</h2>
      <div class="grid md:grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <label for="p-sku" class="font-pixel text-[9px] text-muted-foreground">SKU *</label>
          <input id="p-sku" type="text" name="sku" required placeholder="CURSOR_14D" class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm uppercase rounded-none focus:border-primary focus:outline-none" />
        </div>
        <div class="space-y-1.5">
          <label for="p-name" class="font-pixel text-[9px] text-muted-foreground">NAME *</label>
          <input id="p-name" type="text" name="name" required placeholder="Cursor Unlimit — 14 Days" class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none" />
        </div>
        <div class="space-y-1.5">
          <label for="p-cat" class="font-pixel text-[9px] text-muted-foreground">CATEGORY *</label>
          <select id="p-cat" name="categoryId" required class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none">
            {#each categories as c (c.id)}
              <option value={c.id}>{c.name} ({c.slug})</option>
            {/each}
          </select>
        </div>
        <div class="space-y-1.5">
          <label for="p-price" class="font-pixel text-[9px] text-muted-foreground">PRICE (฿)</label>
          <input id="p-price" type="number" name="price" min="0" value="0" class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none" />
        </div>
        <div class="space-y-1.5">
          <label for="p-dur" class="font-pixel text-[9px] text-muted-foreground">DURATION</label>
          <input id="p-dur" type="text" name="duration" placeholder="14 days" class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none" />
        </div>
        <div class="space-y-1.5">
          <label for="p-status" class="font-pixel text-[9px] text-muted-foreground">STATUS</label>
          <select id="p-status" name="status" class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none">
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="SOLD_OUT">SOLD_OUT</option>
          </select>
        </div>
        <div class="space-y-1.5 md:col-span-2">
          <label for="p-desc" class="font-pixel text-[9px] text-muted-foreground">DESCRIPTION</label>
          <textarea id="p-desc" name="description" rows="3" placeholder="รายละเอียดสินค้า..." class="w-full p-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none resize-none"></textarea>
        </div>
        <div class="space-y-1.5 md:col-span-2">
          <span class="font-pixel text-[9px] text-muted-foreground">PRODUCT_IMAGE</span>
          <div class="flex items-center gap-3">
            <div class="w-20 h-20 grid place-items-center bg-muted border-2 border-border overflow-hidden flex-shrink-0">
              {#if createImageUrl}
                <img src={createImageUrl} alt="preview" class="w-full h-full object-cover" />
              {:else}
                <span class="font-pixel text-[9px] text-muted-foreground">NONE</span>
              {/if}
            </div>
            <div class="flex-1 min-w-0 space-y-1.5">
              <label class="inline-flex items-center gap-2 cursor-pointer h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground w-fit">
                <span>SELECT_FILE ▶</span>
                <input
                  bind:this={createImageInput}
                  type="file"
                  name="imageFile"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  onchange={(e) =>
                    pickImage(
                      e,
                      (v) => (createImageUrl = v),
                      (v) => (createImageName = v)
                    )}
                  class="hidden"
                />
              </label>
              {#if createImageName}
                <div class="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                  <span class="truncate">{createImageName}</span>
                  <button type="button" onclick={clearCreateImage} class="font-pixel text-[9px] text-destructive hover:underline">[REMOVE]</button>
                </div>
              {:else}
                <div class="font-mono text-[10px] text-muted-foreground">PNG / JPG / WEBP / GIF · max 5 MB</div>
              {/if}
            </div>
          </div>
        </div>
      </div>
      <button type="submit" class="h-10 px-5 font-pixel text-[10px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel">CREATE ▶</button>
    </form>
  {/if}

  <div class="space-y-3">
    <div class="flex flex-wrap gap-2">
      <span class="font-pixel text-[9px] text-muted-foreground self-center mr-1">CATEGORY:</span>
      {#each categoryOptions as c (c.id)}
        <button
          type="button"
          onclick={() => (activeCategory = c.id)}
          class="h-8 px-3 font-pixel text-[9px] border-2 border-border transition-colors {activeCategory === c.id ? 'bg-primary text-primary-foreground shadow-pixel' : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'}"
        >{c.label}</button>
      {/each}
    </div>
    <div class="relative max-w-md">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted-foreground pointer-events-none">&gt;</span>
      <input type="text" bind:value={search} placeholder="SEARCH_NAME_OR_SKU..." class="w-full h-10 pl-7 pr-3 border-2 border-border bg-background font-mono text-[12px] rounded-none focus:border-primary focus:outline-none" />
    </div>
  </div>

  <div class="border-2 border-border bg-card shadow-pixel">
    <div class="hidden md:grid grid-cols-[1fr,140px,90px,90px,110px,160px] gap-3 px-4 py-3 border-b-2 border-border font-pixel text-[9px] text-muted-foreground">
      <span>SKU · NAME</span><span>CATEGORY</span><span>PRICE</span><span>STOCK</span><span>STATUS</span><span>ACTIONS</span>
    </div>

    {#if visible.length === 0}
      <div class="px-6 py-12 text-center font-mono text-[11px] text-muted-foreground">&gt; NO_PRODUCTS_FOUND</div>
    {:else}
      <ul class="divide-y divide-border">
        {#each visible as p (p.id)}
          <li class="px-4 py-3">
            {#if editingId === p.id}
              <form
                method="POST"
                action="?/update"
                enctype="multipart/form-data"
                use:enhance={() => async ({ result, update }) => {
                  if (result.type === 'success') {
                    editingId = null;
                    clearEditImage();
                  }
                  await update();
                }}
                class="grid md:grid-cols-[1fr,140px,90px,110px,auto] gap-2 items-center"
              >
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="clearImage" value={String(editClearImage)} />
                <div class="grid gap-1">
                  <input type="text" name="sku" value={p.sku} required class="h-9 px-2 border-2 border-border bg-background font-mono text-sm uppercase" />
                  <input type="text" name="name" value={p.name} required class="h-9 px-2 border-2 border-border bg-background font-mono text-sm" />
                </div>
                <div class="grid gap-1">
                  <select name="categoryId" class="h-9 px-2 border-2 border-border bg-background font-mono text-sm">
                    {#each categories as c (c.id)}
                      <option value={c.id} selected={c.id === p.category.id}>{c.slug}</option>
                    {/each}
                  </select>
                  <div class="flex items-center gap-1">
                    <label class="h-9 px-2 font-pixel text-[8px] flex items-center justify-center border-2 border-border bg-muted cursor-pointer hover:bg-primary hover:text-primary-foreground flex-1">
                      IMG ▶
                      <input
                        bind:this={editImageInput}
                        type="file"
                        name="imageFile"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        onchange={(e) => {
                          pickImage(e, (v) => (editImageUrl = v), (v) => (editImageName = v));
                          editClearImage = false;
                        }}
                        class="hidden"
                      />
                    </label>
                    {#if (p.image && !editClearImage) || editImageUrl}
                       <button type="button" onclick={clearEditImage} class="h-9 px-2 font-pixel text-[8px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background flex-none">×</button>
                    {/if}
                  </div>
                </div>
                <input type="number" name="price" value={p.price} min="0" class="h-9 px-2 border-2 border-border bg-background font-mono text-sm" />
                <select name="status" class="h-9 px-2 border-2 border-border bg-background font-mono text-sm">
                  <option value="ACTIVE" selected={p.status === 'ACTIVE'}>ACTIVE</option>
                  <option value="DRAFT" selected={p.status === 'DRAFT'}>DRAFT</option>
                  <option value="SOLD_OUT" selected={p.status === 'SOLD_OUT'}>SOLD_OUT</option>
                </select>
                <div class="flex gap-1">
                  <button type="submit" class="h-9 px-3 font-pixel text-[9px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel">SAVE</button>
                  <button type="button" onclick={() => { editingId = null; clearEditImage(); }} class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-card">×</button>
                </div>
              </form>
            {:else}
              <div class="md:hidden space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-pixel text-[10px]">{p.sku}</span>
                  <span class="font-pixel text-[9px] px-2 py-0.5 border border-border {statusClass(p.status)}">{p.status}</span>
                </div>
                <div class="font-mono text-[10px] text-muted-foreground truncate">{p.name}</div>
                <div class="flex items-center justify-between gap-2 font-mono text-[10px]">
                  <span class="text-muted-foreground">{p.category.slug} · STOCK {p.availableStock}</span>
                  <span class="font-pixel text-[10px]">฿{p.price}</span>
                </div>
                <div class="flex gap-2 pt-1">
                  <button type="button" onclick={() => (editingId = p.id)} class="h-8 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">EDIT</button>
                  <a href="/admin/stock?product={p.id}" class="h-8 px-3 inline-flex items-center font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">+STOCK</a>
                  <form method="POST" action="?/delete" use:enhance>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" class="h-8 px-3 font-pixel text-[9px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">DEL</button>
                  </form>
                </div>
              </div>

              <div class="hidden md:grid grid-cols-[1fr,140px,90px,90px,110px,160px] gap-3 items-center">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 grid place-items-center bg-muted border-2 border-border flex-shrink-0">
                    {#if p.image}
                      <img src={p.image} alt={p.name} class="w-full h-full object-cover" />
                    {:else}
                      <span class="font-pixel text-[8px] text-muted-foreground">NONE</span>
                    {/if}
                  </div>
                  <div class="truncate">
                    <span class="font-pixel text-[10px]">{p.sku}</span>
                    <span class="block font-mono text-[10px] text-muted-foreground mt-0.5 truncate">{p.name}</span>
                  </div>
                </div>
                <span class="font-mono text-[10px] text-muted-foreground">{p.category.slug}</span>
                <span class="font-pixel text-[10px]">฿{p.price}</span>
                <span class="font-pixel text-[10px] {p.availableStock === 0 ? 'text-destructive' : ''}">{p.availableStock}</span>
                <span class="font-pixel text-[9px] px-2 py-0.5 border border-border w-fit {statusClass(p.status)}">{p.status}</span>
                <div class="flex gap-1">
                  <button type="button" onclick={() => (editingId = p.id)} class="h-8 px-2 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">EDIT</button>
                  <a href="/admin/stock?product={p.id}" class="h-8 px-2 inline-flex items-center font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">+STOCK</a>
                  <form method="POST" action="?/delete" use:enhance>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" aria-label="Delete" class="h-8 w-8 grid place-items-center font-pixel text-[10px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">×</button>
                  </form>
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
