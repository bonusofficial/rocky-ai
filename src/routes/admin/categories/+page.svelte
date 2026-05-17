<script lang="ts">
  import { enhance } from '$app/forms';
  import { isIconImage } from '$lib/icon';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const categories = $derived(data.categories);

  let editingId = $state<string | null>(null);
  let createForm = $state({ name: '', slug: '', description: '' });

  let createIconUrl = $state<string | null>(null);
  let createIconName = $state<string>('');
  let createIconInput = $state<HTMLInputElement | null>(null);

  let editIconUrl = $state<string | null>(null);
  let editIconName = $state<string>('');
  let editIconInput = $state<HTMLInputElement | null>(null);

  const slugAuto = $derived(
    createForm.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  );

  function pickIcon(
    e: Event,
    setUrl: (v: string | null) => void,
    setName: (v: string) => void
  ) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) {
      setUrl(null);
      setName('');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('FILE_TOO_LARGE — max 2 MB');
      (e.target as HTMLInputElement).value = '';
      return;
    }
    setUrl(URL.createObjectURL(file));
    setName(file.name);
  }

  function clearCreateIcon() {
    if (createIconInput) createIconInput.value = '';
    if (createIconUrl) URL.revokeObjectURL(createIconUrl);
    createIconUrl = null;
    createIconName = '';
  }

  function clearEditIcon() {
    if (editIconInput) editIconInput.value = '';
    if (editIconUrl) URL.revokeObjectURL(editIconUrl);
    editIconUrl = null;
    editIconName = '';
  }

  function startEdit(id: string) {
    clearEditIcon();
    editingId = id;
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= categories.length) return;
    const ids = categories.map((c) => c.id);
    [ids[idx], ids[target]] = [ids[target], ids[idx]];

    const fd = new FormData();
    fd.append('ids', ids.join(','));
    fetch('?/reorder', { method: 'POST', body: fd }).then(() => location.reload());
  }
</script>

<svelte:head><title>Categories — Admin</title></svelte:head>

<div class="p-4 md:p-8 space-y-6 max-w-6xl">
  <header class="space-y-2">
    <div class="font-mono text-[11px] text-muted-foreground">// CATALOG_TAXONOMY</div>
    <h1 class="font-pixel text-xl md:text-2xl text-glow">CATEGORIES<span class="blink">_</span></h1>
    <p class="font-mono text-[12px] text-muted-foreground">
      &gt; กำหนดหมวดหมู่สินค้า ลำดับการแสดงผล และการมองเห็น
    </p>
  </header>

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

  <!-- create form -->
  <form
    method="POST"
    action="?/create"
    enctype="multipart/form-data"
    use:enhance={() => async ({ result, update }) => {
      if (result.type === 'success') {
        createForm = { name: '', slug: '', description: '' };
        clearCreateIcon();
      }
      await update();
    }}
    class="border-2 border-primary bg-card p-5 md:p-6 shadow-pixel space-y-4"
  >
    <div class="flex items-center justify-between">
      <h2 class="font-pixel text-[11px]">// ADD_CATEGORY</h2>
      <span class="font-mono text-[10px] text-muted-foreground">NEW_RECORD</span>
    </div>

    <div class="grid md:grid-cols-2 gap-3">
      <div class="space-y-1.5">
        <label for="cat-name" class="font-pixel text-[9px] text-muted-foreground">NAME *</label>
        <input
          id="cat-name"
          type="text"
          name="name"
          bind:value={createForm.name}
          required
          maxlength="80"
          placeholder="Cursor Unlimit"
          class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
        />
      </div>
      <div class="space-y-1.5">
        <label for="cat-slug" class="font-pixel text-[9px] text-muted-foreground">SLUG</label>
        <input
          id="cat-slug"
          type="text"
          name="slug"
          bind:value={createForm.slug}
          maxlength="80"
          placeholder={slugAuto || 'cursor-unlimit'}
          class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
        />
      </div>
      <div class="space-y-1.5 md:col-span-2">
        <label for="cat-desc" class="font-pixel text-[9px] text-muted-foreground">DESCRIPTION</label>
        <input
          id="cat-desc"
          type="text"
          name="description"
          bind:value={createForm.description}
          maxlength="500"
          placeholder="คำอธิบายหมวดหมู่..."
          class="w-full h-10 px-3 border-2 border-border bg-background font-mono text-sm rounded-none focus:border-primary focus:outline-none"
        />
      </div>
      <div class="space-y-1.5 md:col-span-2">
        <span class="font-pixel text-[9px] text-muted-foreground">ICON_IMAGE</span>
        <div class="flex items-center gap-3">
          <div class="w-16 h-16 grid place-items-center bg-muted border-2 border-border overflow-hidden flex-shrink-0">
            {#if createIconUrl}
              <img src={createIconUrl} alt="preview" class="w-full h-full object-cover" />
            {:else}
              <span class="font-pixel text-[9px] text-muted-foreground">NONE</span>
            {/if}
          </div>
          <div class="flex-1 min-w-0 space-y-1.5">
            <label class="inline-flex items-center gap-2 cursor-pointer h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">
              <span>SELECT_FILE ▶</span>
              <input
                bind:this={createIconInput}
                type="file"
                name="iconFile"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onchange={(e) =>
                  pickIcon(
                    e,
                    (v) => (createIconUrl = v),
                    (v) => (createIconName = v)
                  )}
                class="hidden"
              />
            </label>
            {#if createIconName}
              <div class="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span class="truncate">{createIconName}</span>
                <button type="button" onclick={clearCreateIcon} class="font-pixel text-[9px] text-destructive hover:underline">[REMOVE]</button>
              </div>
            {:else}
              <div class="font-mono text-[10px] text-muted-foreground">PNG / JPG / WEBP / GIF / SVG · max 2 MB</div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <button
      type="submit"
      class="h-10 px-5 font-pixel text-[10px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel"
    >+ CREATE ▶</button>
  </form>

  <!-- list -->
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="font-pixel text-[11px]">// EXISTING_CATEGORIES ({categories.length})</h2>
      <span class="font-mono text-[10px] text-muted-foreground">USE ▲▼ TO_REORDER</span>
    </div>

    {#if categories.length === 0 && !data.loadError}
      <div class="border-2 border-border bg-card p-8 text-center font-mono text-[11px] text-muted-foreground">
        &gt; ยังไม่มีหมวดหมู่ — เพิ่มใหม่ในฟอร์มด้านบน
      </div>
    {/if}

    <div class="grid md:grid-cols-2 gap-3">
      {#each categories as c, idx (c.id)}
        <div class="border-2 border-border bg-card p-4 shadow-pixel {c.visible ? '' : 'opacity-60'}">
          {#if editingId === c.id}
            <form
              method="POST"
              action="?/update"
              enctype="multipart/form-data"
              use:enhance={() => async ({ result, update }) => {
                if (result.type === 'success') {
                  editingId = null;
                  clearEditIcon();
                }
                await update();
              }}
              class="space-y-2"
            >
              <input type="hidden" name="id" value={c.id} />
              <input type="text" name="name" value={c.name} required maxlength="80" class="w-full h-9 px-2 border-2 border-border bg-background font-mono text-sm" />
              <input type="text" name="slug" value={c.slug} maxlength="80" class="w-full h-9 px-2 border-2 border-border bg-background font-mono text-sm" />
              <input type="text" name="description" value={c.description} maxlength="500" class="w-full h-9 px-2 border-2 border-border bg-background font-mono text-sm" />

              <div class="flex items-center gap-2 pt-1">
                <div class="w-12 h-12 grid place-items-center bg-muted border-2 border-border overflow-hidden flex-shrink-0">
                  {#if editIconUrl}
                    <img src={editIconUrl} alt="new" class="w-full h-full object-cover" />
                  {:else if isIconImage(c.icon)}
                    <img src={c.icon} alt={c.name} class="w-full h-full object-cover" />
                  {:else}
                    <span class="font-pixel text-base text-glow">{c.icon}</span>
                  {/if}
                </div>
                <label class="inline-flex items-center gap-2 cursor-pointer h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">
                  <span>{editIconName ? 'CHANGE' : 'REPLACE_ICON'}</span>
                  <input
                    bind:this={editIconInput}
                    type="file"
                    name="iconFile"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    onchange={(e) =>
                      pickIcon(
                        e,
                        (v) => (editIconUrl = v),
                        (v) => (editIconName = v)
                      )}
                    class="hidden"
                  />
                </label>
                {#if editIconName}
                  <span class="font-mono text-[10px] text-muted-foreground truncate flex-1">{editIconName}</span>
                  <button type="button" onclick={clearEditIcon} class="font-pixel text-[9px] text-destructive hover:underline">×</button>
                {/if}
              </div>

              <div class="flex gap-2">
                <button type="submit" class="h-9 px-3 font-pixel text-[9px] bg-primary text-primary-foreground hover:bg-primary-glow shadow-pixel">SAVE ▶</button>
                <button type="button" onclick={() => { editingId = null; clearEditIcon(); }} class="h-9 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-card">CANCEL</button>
              </div>
            </form>
          {:else}
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 grid place-items-center bg-muted border-2 border-border flex-shrink-0 overflow-hidden">
                {#if isIconImage(c.icon)}
                  <img src={c.icon} alt={c.name} class="w-full h-full object-cover" />
                {:else}
                  <span class="font-pixel text-xl text-glow">{c.icon}</span>
                {/if}
              </div>
              <div class="flex-1 min-w-0 space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-pixel text-[10px]">{c.name}</span>
                  {#if !c.visible}
                    <span class="font-pixel text-[8px] bg-muted text-muted-foreground px-2 py-0.5 border border-border">HIDDEN</span>
                  {/if}
                </div>
                <div class="font-mono text-[10px] text-muted-foreground">/{c.slug} · {c.productCount} PRODUCTS</div>
                <div class="font-mono text-[10px] text-muted-foreground line-clamp-2">{c.description || '—'}</div>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between gap-2 flex-wrap">
              <div class="flex gap-1">
                <button type="button" onclick={() => move(idx, -1)} disabled={idx === 0} class="h-8 w-8 grid place-items-center font-pixel text-[10px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground disabled:opacity-30">▲</button>
                <button type="button" onclick={() => move(idx, 1)} disabled={idx === categories.length - 1} class="h-8 w-8 grid place-items-center font-pixel text-[10px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground disabled:opacity-30">▼</button>
              </div>
              <div class="flex gap-2 flex-wrap">
                <form method="POST" action="?/toggleVisibility" use:enhance>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="visible" value={String(c.visible)} />
                  <button type="submit" class="h-8 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">
                    {c.visible ? 'HIDE' : 'SHOW'}
                  </button>
                </form>
                <button type="button" onclick={() => startEdit(c.id)} class="h-8 px-3 font-pixel text-[9px] border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground">EDIT</button>
                <form method="POST" action="?/delete" use:enhance>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" class="h-8 px-3 font-pixel text-[9px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-background">DEL</button>
                </form>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
