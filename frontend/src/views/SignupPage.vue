<template>
  <div class="signup-page-container">
    <div class="signup-box">
      <h1>Sign Up</h1>
      <form @submit.prevent="signupUser">
        <input type="text" v-model="name" placeholder="Full Name" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit" class="btn-signup" :disabled="loading">Sign Up</button>
      </form>
      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Signing up...</p>
      </div>
      <p class="login-prompt">
        Already have an account? <router-link to="/login" class="login-link">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
const backend = process.env.VUE_APP_ROOT_URL;

export default {
  name: 'SignupPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false // Add loading state
    };
  },
  methods: {
    async signupUser() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };

      this.loading = true; // Start loading
      const toast = useToast();

      try {
        const response = await axios.post(`${backend}/api/auth/register`, userData);

        if (response.status === 201) {
          toast.success("User Registered Successful")
          this.$router.push('/login'); // Redirect to login page after successful registration
        }
      } catch (error) {
        console.error('There was an error during signup:', error.response.data.message);
        toast.error("Problem occured while signing up")
      } finally {
        this.loading = false; // Stop loading
      }
    },
  },
};
</script>

<style scoped>
/* General Styles */
.signup-page-container {
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.signup-box {
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

.login-prompt {
  margin-top: 20px;
  font-size: 1rem;
  color: #777;
}

.login-link {
  color: #5c6bc0;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
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
