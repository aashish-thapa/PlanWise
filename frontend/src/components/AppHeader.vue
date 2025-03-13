<template>
  <header>
    <nav>
      <!-- Logo and Hamburger Menu (on small screens) -->
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
      </div>
      
      <!-- Hamburger Menu -->
      <div class="hamburger" @click="toggleMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
      
      <!-- Navbar links -->
      <div :class="['nav-links', { 'active': isMenuOpen }]">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/events" class="nav-link">Events</router-link>
        <router-link v-if="!isLoggedIn" to="/login" class="nav-link login">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/signup" class="nav-link signup">Sign Up</router-link>
        <router-link v-if="isLoggedIn" to="/signout" @click.prevent="signOut" class="nav-link signout">Sign Out</router-link>
      </div>
    </nav>
  </header>
</template>


<script>
import { watch } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "AppHeader",
  data() {
    return {
      isMenuOpen: false,
      isLoggedIn: false,
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    },
    signOut() {
      localStorage.removeItem("isLoggedIn");
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
  },
  mounted() {
    const route = useRoute();

    // Watch for route changes and update login status
    watch(route, () => {
      this.checkLoginStatus();
    });
  },
};
</script>



<style scoped>
/* General Styles for Header */
header {
  background-color: white; /* White background */
  color: black; /* Black text */
  padding: 10px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed; /* Sticky navbar */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  margin-top: 0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
}

.logo img {
  height: 50px; /* Adjust logo size */
}

/* Navbar Links */
.nav-links {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.nav-link {
  color: black; /* Black text color */
  text-decoration: none;
  padding: 10px 20px;
  margin: 0 15px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: color 0.3s ease, border-bottom 0.3s ease;
}

.nav-link:hover {
  color: #1e88e5; /* Blue color for hover */
  border-bottom: 2px solid #1e88e5; /* Blue line underneath */
}

.nav-link:active {
  color: #1565c0; /* Darker blue for active state */
}
.nav-links .signup {
  background-color: #1e88e5; /* Blue background */
  color: white; /* White text */
  border-radius: 5px;
  padding: 10px 20px;
  margin-right: 1px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.nav-links .signup:hover {
  background-color: #1565c0; /* Darker blue on hover */
  transform: translateY(-3px);
}
/* Position login and signup to the right */
.nav-links .login,
.nav-links .signup {
  margin-left: 20px;
}

/* Hamburger Menu Styles */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 10px;
  width: 30px;
  height: 25px;
  justify-content: space-between;
}

.bar {
  height: 4px;
  width: 100%;
  background-color: black;
  border-radius: 2px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .nav-links {
    display: none; /* Hide the navbar links by default on small screens */
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    background-color: white; /* White background */
    width: 100%;
    z-index: 999;
  }

  .nav-links.active {
    display: flex; /* Show the navbar links when active */
  }

  .hamburger {
    display: flex; /* Show hamburger menu on small screens */
  }

  .logo {
    display: block;
  }
}
</style>
