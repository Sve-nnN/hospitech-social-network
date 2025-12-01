<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { showLoading, hideLoading, showError } from '$lib/ui/globalFeedback';
  import { t } from '$lib/i18n';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";

  /** @type {any} */
  let user = null;
  let editing = false;
  let fullName = '';
  let email = '';
  let status = '';
  let error = '';
  let loading = false;

  onMount(() => {
    const auth = get(authStore);
    if (!auth.user) {
      goto('/auth');
      return;
    }
    user = { ...auth.user };
    fullName = user.fullName;
    email = user.email;
    status = user.status;
  });

  async function saveProfile() {
    showLoading();
    error = '';
    try {
      // Simulación de llamada a backend
      await new Promise(r => setTimeout(r, 500));
      user.fullName = fullName;
      user.email = email;
      user.status = status;
      authStore.update(s => ({ ...s, user: { ...user } }));
      editing = false;
    } catch (e) {
      showError('Error al guardar perfil');
      error = 'Error al guardar perfil';
    } finally {
      hideLoading();
    }
  }
</script>

<div class="container max-w-xl mx-auto mt-8 p-4">
  <Card.Root>
    <Card.Header>
      <Card.Title>{$t('profile.title')}</Card.Title>
    </Card.Header>
    <Card.Content>
      {#if user}
        {#if editing}
          <form on:submit|preventDefault={saveProfile} class="space-y-4">
            <div class="grid w-full items-center gap-1.5">
              <Label for="fullName">{$t('profile.name')}</Label>
              <Input id="fullName" bind:value={fullName} required />
            </div>
            <div class="grid w-full items-center gap-1.5">
              <Label for="email">{$t('profile.email')}</Label>
              <Input id="email" type="email" bind:value={email} required />
            </div>
            <div class="grid w-full items-center gap-1.5">
              <Label for="status">{$t('profile.status')}</Label>
              <select
                id="status"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                bind:value={status}
              >
                <option value="Active">{$t('profile.active')}</option>
                <option value="Inactive">{$t('profile.inactive')}</option>
              </select>
            </div>
            {#if error}
              <div class="text-destructive text-sm">{$t('profile.error')}</div>
            {/if}
            <div class="flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? $t('profile.save') : $t('profile.save')}</Button>
              <Button variant="outline" type="button" on:click={() => (editing = false)}>{$t('profile.cancel')}</Button>
            </div>
          </form>
        {:else}
          <div class="space-y-2">
            <div><span class="font-semibold">{$t('profile.name')}:</span> {user.fullName}</div>
            <div><span class="font-semibold">{$t('profile.email')}:</span> {user.email}</div>
            <div>
              <span class="font-semibold">{$t('profile.status')}:</span>
              {user.status === 'Active' ? $t('profile.active') : $t('profile.inactive')}
            </div>
            <div><span class="font-semibold">{$t('profile.verified')}:</span> {user.emailVerified ? 'Sí' : 'No'}</div>
            <div><span class="font-semibold">{$t('profile.mfa')}:</span> {user.mfaEnabled ? 'Sí' : 'No'}</div>
          </div>
          {#if !editing}
            <Button class="mt-4" on:click={() => (editing = true)}>{$t('profile.edit')}</Button>
          {/if}
        {/if}
      {:else}
        <div>Cargando usuario...</div>
      {/if}
    </Card.Content>
  </Card.Root>
</div>

<!-- No custom styles, solo clases Tailwind en los elementos -->
