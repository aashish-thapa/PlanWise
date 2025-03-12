<template>
  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h4>About Hobby Organizer</h4>
        <p>Event Organizer is your go-to platform for managing and organizing events effortlessly. Whether personal or corporate, we simplify the planning process.</p>
      </div>
      
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><router-link to="/events">Browse Events</router-link></li>
          <li><router-link to="/about">About Us</router-link></li>
          <li><router-link to="/contact">Contact Us</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Follow Us</h4>
        <div class="social-icons">
          <a href="#" target="_blank" class="social-icon">FB</a>
          <a href="#" target="_blank" class="social-icon">TW</a>
          <a href="#" target="_blank" class="social-icon">IG</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Hobby Organizer. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
};
</script>

<style scoped>
footer {
  background-color: #0056b3; /* Blue Background */
  color: white;
  padding: 30px 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
  margin: 10px;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.footer-section p {
  font-size: 1rem;
  line-height: 1.5;
}

.footer-section ul {
  list-style-type: none;
  padding: 0;
}

.footer-section ul li {
  margin: 8px 0;
}

.footer-section ul li a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #ffcc00; /* Highlight color */
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  background-color: #333;
  color: white;
  padding: 10px;
  border-radius: 50%;
  text-align: center;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.social-icon:hover {
  background-color: #ffcc00;
}

.footer-bottom {
  text-align: center;
  font-size: 1rem;
  margin-top: 10px;
  font-weight: 500;
}

@media (max-width: 600px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
  }

  .footer-section {
    text-align: center;
  }
}
</style>
