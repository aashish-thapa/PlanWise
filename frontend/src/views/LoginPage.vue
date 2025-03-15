<template>
  <div class="login-page-container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="loginUser">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit" class="btn-login" :disabled="loading">
          Login
        </button>
      </form>
      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Logging in...</p>
      </div>
      <p class="signup-prompt">
        Don't have an account? <router-link to="/signup" class="signup-link">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
const backend = process.env.VUE_APP_ROOT_URL;

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      loading: false // Add loading state
    };
  },
  methods: {
    async loginUser() {
      this.loading = true; // Start loading
      const toast = useToast();
      try {
        // Send POST request to the backend for login
        const response = await axios.post(`${backend}/api/auth/login`, {
          email: this.email,
          password: this.password
        });

        // Store token in localStorage for future use
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', true);

        // Set user data in Vuex store or wherever needed
        this.$store.commit('setUser', { email: this.email });
        toast.success('Login Successful! Welcome back!')

        // Redirect to homepage or another authenticated page
        this.$router.push('/events');
      } catch (error) {
        toast.error("Invalid Credentials")
      } finally {
        this.loading = false; // Stop loading
      }
    }
  }
};
</script>

<style scoped>
/* General Styles */
.login-page-container {
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.login-box {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #5c6bc0;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3f51b5;
}

.signup-prompt {
  margin-top: 20px;
  font-size: 1rem;
  color: #777;
}

.signup-link {
  color: #5c6bc0;
  text-decoration: none;
  font-weight: bold;
}

.signup-link:hover {
  text-decoration: underline;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #5c6bc0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
