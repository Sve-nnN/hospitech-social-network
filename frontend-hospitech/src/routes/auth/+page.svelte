<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { onMount } from 'svelte';

  let username = '';
  let password = '';
  let email = '';
  let nombre = '';
  let apellido = '';
  let error = '';
  let fieldErrors: { [key: string]: string } = {};
  let mode: 'login' | 'register' = 'login';
  let loading = false;

  export let form: any;

  onMount(() => {
    // Check URL for mode query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('type');
    if (urlMode === 'signup') {
      mode = 'register';
    }

    // Handle server-side form submissions
    if (form) {
      error = form.message || '';
      fieldErrors = {};
      if (form.errors) {
        for (const err of form.errors) {
          if (err.param) fieldErrors[err.param] = err.msg;
        }
      }
      if (form.type === 'success') {
        goto('/feed');
      }
    }
  });

  function validate() {
    const errors: { [key: string]: string } = {};
    if (mode === 'register') {
      if (!username || username.length < 3) errors.username = $t('auth.validation.usernameMin');
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = $t('auth.validation.invalidEmail');
      if (!password || password.length < 6) errors.password = $t('auth.validation.passwordMin');
      if (!nombre || nombre.length < 2) errors.nombre = $t('auth.validation.firstNameRequired');
      if (!apellido || apellido.length < 2) errors.apellido = $t('auth.validation.lastNameRequired');
    } else {
      if (!username) errors.username = $t('auth.validation.usernameRequired');
      if (!password) errors.password = $t('auth.validation.passwordRequired');
    }
    return errors;
  }

  async function handleSubmit() {
    error = '';
    fieldErrors = {};
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      fieldErrors = { ...errors };
      return;
    }

    loading = true;
    let formData: any = { username, password };
    if (mode === 'register') {
      formData = { ...formData, email, nombre, apellido };
    }

    try {
      const res = await fetch('/auth?'+ new URLSearchParams({ type: mode }), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          for (const err of data.errors) {
            if (err.param) fieldErrors[err.param] = err.msg;
          }
          error = $t('auth.validation.formErrors');
        } else {
          error = data.msg || data.message || $t('auth.validation.unknownError');
        }
      } else {
        if (data.user && data.token) {
          authStore.set({ user: data.user, token: data.token, loading: false, error: null });
          goto('/feed');
        } else {
          error = $t('auth.validation.unexpectedResponse');
        }
      }
    } catch (e) {
      console.error("Auth error:", e);
      error = $t('auth.validation.networkError');
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    mode = mode === 'login' ? 'register' : 'login';
    error = '';
    fieldErrors = {};
  }
</script>

<div class="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 p-4 sm:p-6">
  <div class="w-full max-w-md bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">{mode === 'login' ? $t('auth.login') : $t('auth.register')}</h1>
      <p class="text-gray-500 mt-2">
        {mode === 'login' ? $t('auth.subtitle.login') : $t('auth.subtitle.register')}
      </p>
    </div>

    <form class="space-y-5" on:submit|preventDefault={handleSubmit}>
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">{$t('auth.username')}</label>
        <input
          id="username"
          name="username"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
          placeholder="{$t('auth.placeholder.username')}"
          bind:value={username}
          aria-invalid={!!fieldErrors.username}
          aria-describedby="username-error"
        />
        {#if fieldErrors.username}
          <p id="username-error" class="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
        {/if}
      </div>

      {#if mode === 'register'}
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{$t('auth.email')}</label>
          <input
            id="email"
            name="email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
            placeholder="{$t('auth.placeholder.email')}"
            bind:value={email}
            aria-invalid={!!fieldErrors.email}
            aria-describedby="email-error"
          />
          {#if fieldErrors.email}
            <p id="email-error" class="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          {/if}
        </div>
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">{$t('auth.nombre') || 'First Name'}</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
            placeholder="{$t('auth.placeholder.nombre') || 'John'}"
            bind:value={nombre}
            aria-invalid={!!fieldErrors.nombre}
            aria-describedby="nombre-error"
          />
          {#if fieldErrors.nombre}
            <p id="nombre-error" class="mt-1 text-sm text-red-600">{fieldErrors.nombre}</p>
          {/if}
        </div>
        <div>
          <label for="apellido" class="block text-sm font-medium text-gray-700 mb-1">{$t('auth.apellido') || 'Last Name'}</label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
            placeholder="{$t('auth.placeholder.apellido') || 'Doe'}"
            bind:value={apellido}
            aria-invalid={!!fieldErrors.apellido}
            aria-describedby="apellido-error"
          />
          {#if fieldErrors.apellido}
            <p id="apellido-error" class="mt-1 text-sm text-red-600">{fieldErrors.apellido}</p>
          {/if}
        </div>
      {/if}

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{$t('auth.password')}</label>
        <input
          id="password"
          name="password"
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
          placeholder="{$t('auth.placeholder.password')}"
          bind:value={password}
          aria-invalid={!!fieldErrors.password}
          aria-describedby="password-error"
        />
        {#if fieldErrors.password}
          <p id="password-error" class="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
        {/if}
      </div>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> {error}</span>
        </div>
      {/if}

      <button
        type="submit"
        class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-150 ease-in-out {
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }"
        disabled={loading}
      >
        {#if loading}
          <span class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {$t('auth.loading')}
          </span>
        {:else}
          {mode === 'login' ? $t('auth.login') : $t('auth.register')}
        {/if}
      </button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        {#if mode === 'login'}
          {$t('auth.noAccount')}
          <button type="button" on:click={toggleMode} class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline">
            {$t('auth.registerNow')}
          </button>
        {:else}
          {$t('auth.hasAccount')}
          <button type="button" on:click={toggleMode} class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline">
            {$t('auth.loginNow')}
          </button>
        {/if}
      </p>
    </div>
  </div>
</div>
