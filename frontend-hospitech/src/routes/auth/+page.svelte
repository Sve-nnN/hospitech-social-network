<script>
function onSubmit(e) {
  error = '';
  fieldErrors = {};
  const errors = validate();
  if (Object.keys(errors).length > 0) {
    fieldErrors = { ...errors };
    return;
  }
  e.target.submit();
}
  function validate() {
    const errors = {};
    if (mode === 'register') {
      if (!username || username.length < 3) errors.username = 'El usuario debe tener al menos 3 caracteres';
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email inválido';
      if (!password || password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres';
      if (!nombre || nombre.length < 2) errors.nombre = 'El nombre es obligatorio';
      if (!apellido || apellido.length < 2) errors.apellido = 'El apellido es obligatorio';
    } else {
      if (!username) errors.username = 'Usuario requerido';
      if (!password) errors.password = 'Contraseña requerida';
    }
    return errors;
  }
function handleSubmit(event) {
  error = '';
  fieldErrors = {};
    // Detectar qué botón fue presionado
    const submitter = event?.submitter;
    let submitMode = mode;
    if (submitter && submitter.textContent === $t('auth.login')) submitMode = 'login';
    if (submitter && submitter.textContent === $t('auth.register')) submitMode = 'register';
    mode = submitMode;
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      fieldErrors = errors;
      return;
    }
    loading = true;
    // Enviar el formulario manualmente
    let formData = { username, password };
    if (submitMode === 'register') {
      formData = { ...formData, email, nombre, apellido };
    }
    fetch('/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (data.errors) {
            for (const err of data.errors) {
              if (err.param) fieldErrors[err.param] = err.msg;
            }
            error = 'Corrige los errores del formulario.';
          } else {
            error = data.msg || data.message || 'Error desconocido';
          }
        } else {
          // Redirigir a feed
          goto('/feed');
        }
      })
      .catch((e) => {
        error = 'Error de red o del servidor';
      })
      .finally(() => {
        loading = false;
      });
  }
  import { t } from '$lib/i18n';
  let username = '';
  let password = '';
  let email = '';
  let nombre = '';
  let apellido = '';
  let error = '';
  let fieldErrors = {};
  let mode = 'login'; // o 'register'
  let loading = false;

  import { goto } from '$app/navigation';
export let form;
  $: if (form) {
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
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">{$t('auth.title')}</h1>
  <div class="flex justify-center mb-4 gap-2">
    <button type="button" class="px-4 py-2 rounded border" class:bg-blue-600={mode==='login'} class:text-white={mode==='login'} on:click={() => mode = 'login'}>{$t('auth.login')}</button>
    <button type="button" class="px-4 py-2 rounded border" class:bg-blue-600={mode==='register'} class:text-white={mode==='register'} on:click={() => mode = 'register'}>{$t('auth.register')}</button>
  </div>
  <form method="POST" class="space-y-4" on:submit|preventDefault={onSubmit}>
    <div>
      <label class="block mb-1" for="username">{$t('auth.username')}</label>
      <input id="username" name="username" class="w-full border px-3 py-2 rounded" bind:value={username} />
      {#if fieldErrors.username}
        <p class="text-red-600 text-sm">{fieldErrors.username}</p>
      {/if}
    </div>
    {#if mode === 'register'}
    <div>
      <label class="block mb-1" for="email">{$t('auth.email')}</label>
      <input id="email" name="email" class="w-full border px-3 py-2 rounded" bind:value={email} />
      {#if fieldErrors.email}
        <p class="text-red-600 text-sm">{fieldErrors.email}</p>
      {/if}
    </div>
    <div>
      <label class="block mb-1" for="nombre">{$t('auth.nombre') || 'Nombre'}</label>
      <input id="nombre" name="nombre" class="w-full border px-3 py-2 rounded" bind:value={nombre} />
      {#if fieldErrors.nombre}
        <p class="text-red-600 text-sm">{fieldErrors.nombre}</p>
      {/if}
    </div>
    <div>
      <label class="block mb-1" for="apellido">{$t('auth.apellido') || 'Apellido'}</label>
      <input id="apellido" name="apellido" class="w-full border px-3 py-2 rounded" bind:value={apellido} />
      {#if fieldErrors.apellido}
        <p class="text-red-600 text-sm">{fieldErrors.apellido}</p>
      {/if}
    </div>
    {/if}
    <input type="hidden" name="mode" value={mode} />
    <div>
      <label class="block mb-1" for="password">{$t('auth.password')}</label>
      <input id="password" name="password" type="password" class="w-full border px-3 py-2 rounded" bind:value={password} />
      {#if fieldErrors.password}
        <p class="text-red-600 text-sm">{fieldErrors.password}</p>
      {/if}
    </div>
    <div class="flex gap-2">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{mode === 'login' ? $t('auth.login') : $t('auth.register')}</button>
    </div>
    {#if error}
      <p class="text-red-600">{error}</p>
    {/if}
  </form>
</div>
