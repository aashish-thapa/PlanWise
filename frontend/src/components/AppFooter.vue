<template>
  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h4>About PlanWise</h4>
        <p>PlanWise is the ultimate platform for seamlessly managing and organizing events, whether personal or corporate. We simplify event planning, making it stress-free for everyone.</p>
      </div>
      
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><router-link to="/events">Browse Events</router-link></li>
          <li><a href="https://aashish-thapa.com.np">About Us</a></li>
          <li><a href ="https://aashish-thapa.com.np">Portfolio</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Follow The Developer</h4>
        <div class="social-icons">
          <a href="https://www.facebook.com/aashish.thapa.96742/" target="_blank" class="social-icon">FB</a>
          <a href="https://github.com/aashish-thapa" target="_blank" class="social-icon">Github</a>
          <a href="https://www.instagram.com/iamaashishthapa/" target="_blank" class="social-icon">IG</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 PlanWise. All rights reserved.</p>
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
  background-color: #0056b3; /* PlanWise Blue Background */
  color: white;
  padding: 30px 20px;
  font-family: Arial, sans-serif;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 30px;
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

@media (max-width: 1024px) {
  .footer-content {
    justify-content: space-around;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
  }

  .footer-section {
    text-align: center;
    margin-bottom: 20px;
  }

  .footer-section h4 {
    font-size: 1.1rem;
  }

  .footer-section p {
    font-size: 0.95rem;
  }

  .footer-bottom {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .footer-section h4 {
    font-size: 1rem;
  }

  .footer-section p {
    font-size: 0.9rem;
  }

  .footer-section ul li a {
    font-size: 0.9rem;
  }

  .social-icon {
    width: 35px;
    height: 35px;
    padding: 8px;
    font-size: 0.9rem;
  }

  .footer-bottom {
    font-size: 0.8rem;
  }
}
</style>
