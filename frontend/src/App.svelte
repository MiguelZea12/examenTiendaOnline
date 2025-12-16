<script>
  import { Router, Route } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { auth } from './firebase';
  import { onAuthStateChanged } from 'firebase/auth';
  import Auth from './components/Auth.svelte';
  import Vendedor from './components/Vendedor.svelte';
  import Cliente from './components/Cliente.svelte';

  export let url = "";

  let ready = false;

  onMount(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
      }
      ready = true;
    });
  });
</script>

{#if ready}
  <Router {url}>
    <Route path="/" component={Auth} />
    <Route path="/vendedor" component={Vendedor} />
    <Route path="/cliente" component={Cliente} />
  </Router>
{:else}
  <div class="loading">Cargando...</div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 20px;
    color: #667eea;
  }
</style>
