<template>
  <div class="home-container">
    <header class="hero">
      <div class="hero-text">
        <h1>Welcome to PlanWise</h1>
        <p>Your go-to platform for managing and organizing all your events!</p>

        <!-- Conditionally display the button based on login status -->
        <router-link v-if="isLoggedIn" to="/events" class="btn-primary">Browse Events</router-link>
        <p v-else class="login-prompt">Please log in to browse events.</p>
      </div>
    </header>

    <section class="features">
      <h2>Our Features</h2>
      <div class="feature-cards">
        <div class="card">
          <img src="https://d92mrp7hetgfk.cloudfront.net/images/sites/H2B/Event-Planner/original.jpg?1532640584" alt="Event Planning" />
          <h3>Event Planning</h3>
          <p>Organize events seamlessly with our simple and intuitive tools.</p>
        </div>
        <div class="card">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVq-x8mCG0sCxJ9PpOheD2kSeBl7q9nvxctQ&s" alt="Guest Management" />
          <h3>Guest Management</h3>
          <p>Effortlessly track RSVPs, manage guest lists, and more.</p>
        </div>
        <div class="card">
          <img src="https://www.cflowapps.com/wp-content/uploads/2021/11/budgt_mngmnt.jpg" alt="Budget Tracker" />
          <h3>Budget Tracker</h3>
          <p>Stay on top of your event expenses with our easy-to-use budget tracker.</p>
        </div>
      </div>
    </section>

    <section class="about">
      <h2>About Us</h2>
      <p>At Event Organizer, we aim to provide a comprehensive event management solution that helps individuals and organizations efficiently plan, execute, and manage their events. Whether it’s a personal celebration, corporate gathering, or community event, we’re here to make the process seamless and enjoyable.</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  computed: {
    // Check if the user is logged in based on the presence of a token in localStorage
    isLoggedIn() {
      return !!localStorage.getItem('token'); // Token exists means user is logged in
    }
  }
};
</script>

<style scoped>
/* General Container */
.home-container {
  width: 100%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

/* Hero Section */
.hero {
  position: relative;
  background-color: #082d55; /* Blue Background */
  color: #0056b3;
  padding: 150px 40px;
  text-align: center;
  background-image: url('https://images.theeventscalendar.com/uploads/2023/05/The-Benefits-of-Hiring-a-Professional-Event-Planner.jpg');
  background-size: cover;
  background-position: center;
  height: 77vh; /* Full viewport height */
  overflow: hidden;
}

/* Blur effect */
.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay for contrast */
  backdrop-filter: blur(10px); /* Applying blur effect */
  z-index: -1;
}

.hero-text h1 {
  font-family: 'Poppins', sans-serif; /* Stylish Font */
  font-size: 4rem;
  margin-bottom: 20px;
}

.hero-text p {
  font-family: 'Lora', serif; /* Stylish Font */
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.hero .btn-primary {
  padding: 12px 30px;
  background-color: #007bff; /* Lighter Blue */
  color: white;
  text-decoration: none;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.hero .btn-primary:hover {
  background-color: #0056b3; /* Darker Blue */
}

.login-prompt {
  font-size: 1.2rem;
  color: #f00; /* Red color to indicate a message */
  margin-top: 20px;
}

/* Features Section */
.features {
  padding: 50px 20px;
  text-align: center;
  background-color: #f0f8ff; /* Light Blue Background */
}

.features h2 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #0056b3; /* Blue Color */
}

.feature-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 300px;
  text-align: center;
  transition: transform 0.3s ease;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card h3 {
  font-size: 1.8rem;
  margin: 20px 0;
  color: #0056b3; /* Blue Color */
}

.card p {
  font-size: 1rem;
  padding: 0 10px;
  color: #555;
}

.card:hover {
  transform: translateY(-5px);
}

/* About Section */
.about {
  padding: 50px 20px;
  background-color: #ffffff;
  text-align: center;
}

.about h2 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #1e69b9; /* Blue Color */
}

.about p {
  font-size: 1.2rem;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;
}
@media (max-width: 768px) {
  .hero {
    padding: 15vh 10vw;
    height: auto;
  }
  
  .hero-text h1 {
    font-size: 5vw;
  }

  .hero-text p {
    font-size: 3.5vw;
  }

  .hero .btn-primary {
    font-size: 3.5vw;
    padding: 10px 15vw;
  }

  .features h2, .about h2 {
    font-size: 5vw;
  }

  .card {
    width: 90%;
    max-width: 350px;
  }

  .about p {
    font-size: 3vw;
  }
}
/* Footer Section */
footer {
  background-color: #0056b3; /* Blue Background */
  color: white;
  padding: 20px;
  text-align: center;
}

footer p {
  font-size: 1rem;
}
</style>
