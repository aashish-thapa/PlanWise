<template>
    <div class="signout">
      <p>You have been signed out.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SignOut',
    created() {
      this.signOut();
    },
    methods: {
      signOut() {
        // Clear the user session (for example, clear localStorage or token)
        localStorage.removeItem('isLoggedIn'); // Clear login status
  
        // Redirect the user to the login page
        this.$router.push('/login');
      },
    },
  };
  </script>
  
  <style scoped>
  .signout {
    text-align: center;
    padding: 50px;
    font-size: 1.5rem;
  }
  </style>
  