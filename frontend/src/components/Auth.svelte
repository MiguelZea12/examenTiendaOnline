<script>
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../firebase';
  import { api } from '../lib/api';
  import { navigate } from 'svelte-routing';

  let isLogin = true;
  let email = '';
  let password = '';
  let nombre = '';
  let rol = 'cliente';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    error = '';
    loading = true;

    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        
        // Obtener información del usuario
        const userData = await api.getMe();
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirigir según rol
        if (userData.rol === 'vendedor') {
          navigate('/vendedor');
        } else {
          navigate('/cliente');
        }
      } else {
        // Register
        // Primero registrar en backend
        await api.register({ email, password, nombre, rol });
        
        // Luego hacer login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        
        // Obtener información del usuario
        const userData = await api.getMe();
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirigir según rol
        if (rol === 'vendedor') {
          navigate('/vendedor');
        } else {
          navigate('/cliente');
        }
      }
    } catch (err) {
      error = err.message || 'Error en autenticación';
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = '';
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>
    
    <form on:submit|preventDefault={handleSubmit}>
      {#if !isLogin}
        <div class="form-group">
          <label for="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            bind:value={nombre}
            required
            placeholder="Tu nombre"
          />
        </div>

        <div class="form-group">
          <label for="rol">Tipo de cuenta</label>
          <select id="rol" bind:value={rol} required>
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
      {/if}

      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          placeholder="tu@email.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          placeholder="••••••••"
          minlength="6"
        />
      </div>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      <button type="submit" disabled={loading}>
        {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
      </button>
    </form>

    <p class="toggle">
      {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
      <button type="button" on:click={toggleMode}>
        {isLogin ? 'Regístrate' : 'Inicia Sesión'}
      </button>
    </p>
  </div>
</div>

<style>
  .auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
  }

  .auth-card {
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  h1 {
    margin: 0 0 30px;
    color: #333;
    text-align: center;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-weight: 500;
  }

  input, select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    box-sizing: border-box;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #667eea;
  }

  button[type="submit"] {
    width: 100%;
    padding: 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  button[type="submit"]:hover:not(:disabled) {
    background: #5568d3;
  }

  button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    background: #fee;
    color: #c33;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    font-size: 14px;
  }

  .toggle {
    text-align: center;
    margin-top: 20px;
    color: #666;
  }

  .toggle button {
    background: none;
    border: none;
    color: #667eea;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
  }
</style>
