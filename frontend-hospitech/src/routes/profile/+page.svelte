<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { showLoading, hideLoading, showError } from '$lib/ui/globalFeedback';
  import { t } from '$lib/i18n';

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

<section class="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">{$t('profile.title')}</h1>
  {#if user}
    {#if editing}
      <form on:submit|preventDefault={saveProfile} class="space-y-4">
        <div>
          <label class="block text-sm font-medium" for="fullName">{$t('profile.name')}</label>
          <input id="fullName" class="w-full border rounded-md px-3 py-2 mt-1" bind:value={fullName} required />
        </div>
        <div>
          <label class="block text-sm font-medium" for="email">{$t('profile.email')}</label>
          <input id="email" class="w-full border rounded-md px-3 py-2 mt-1" type="email" bind:value={email} required />
        </div>
        <div>
          <label class="block text-sm font-medium" for="status">{$t('profile.status')}</label>
          <select id="status" class="w-full border rounded-md px-3 py-2 mt-1" bind:value={status}>
            <option value="Active">{$t('profile.active')}</option>
            <option value="Inactive">{$t('profile.inactive')}</option>
          </select>
        </div>
        {#if error}
          <div class="text-red-600">{$t('profile.error')}</div>
        {/if}
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" type="submit" disabled={loading}>{loading ? $t('profile.save') : $t('profile.save')}</button>
        <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition ml-2" type="button" on:click={() => editing = false}>{$t('profile.cancel')}</button>
      </form>
    {:else}
      <div class="space-y-2">
        <div><span class="font-semibold">{$t('profile.name')}:</span> {user.fullName}</div>
        <div><span class="font-semibold">{$t('profile.email')}:</span> {user.email}</div>
        <div><span class="font-semibold">{$t('profile.status')}:</span> {user.status === 'Active' ? $t('profile.active') : $t('profile.inactive')}</div>
        <div><span class="font-semibold">{$t('profile.verified')}:</span> {user.emailVerified ? 'Sí' : 'No'}</div>
        <div><span class="font-semibold">{$t('profile.mfa')}:</span> {user.mfaEnabled ? 'Sí' : 'No'}</div>
      </div>
      {#if !editing}
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mt-4" on:click={() => editing = true}>{$t('profile.edit')}</button>
      {/if}
    {/if}
  {:else}
    <div>Cargando usuario...</div>
  {/if}
</section>

<!-- No custom styles, solo clases Tailwind en los elementos -->
