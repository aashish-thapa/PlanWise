<template>
    <div class="event-page-container">
      <div class="hero-section">
        <h1>Event Page</h1>
        <p>Explore and manage all the upcoming events.</p>
        <router-link to="/" class="btn-go-home">Go to Home</router-link>
      </div>
  
      <!-- Event List Section -->
      <section class="event-list">
        <h2>Upcoming Events</h2>
        <div class="events">
          <div class="event-card" v-for="event in events" :key="event.id">
            <img :src="event.image" :alt="event.title" />
            <div class="event-info">
              <h3>{{ event.title }}</h3>
              <p>{{ event.date }}</p>
              <p>{{ event.description }}</p>
              <router-link :to="'/event/' + event.id" class="btn-view-event">View Details</router-link>
            </div>
          </div>
        </div>
      </section>
  
    </div>
  </template>
  
  <script>
  export default {
    name: 'EventPage',
    data() {
      return {
        events: [
          {
            id: 1,
            title: 'Community Picnic',
            date: 'March 25, 2025',
            description: 'Join us for a fun-filled day at the park with games, food, and activities for the whole family.',
            image: 'https://via.placeholder.com/400x250',
          },
          {
            id: 2,
            title: 'Tech Talk: The Future of AI',
            date: 'April 10, 2025',
            description: 'A deep dive into the latest trends and developments in Artificial Intelligence.',
            image: 'https://via.placeholder.com/400x250',
          },
          {
            id: 3,
            title: 'Charity Gala',
            date: 'May 5, 2025',
            description: 'An elegant evening of fundraising to support local charities and community initiatives.',
            image: 'https://via.placeholder.com/400x250',
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* General Styles */
  .event-page-container {
    font-family: 'Arial', sans-serif;
    background-color: #f4f7fa;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  
  /* Hero Section */
  .hero-section {
    background: #082d55;;
    padding: 50px;
    border-radius: 15px;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 800px;
  }
  
  .hero-section h1 {
    font-size: 3.5rem;
    margin-bottom: 10px;
  }
  
  .hero-section p {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
  
  .btn-go-home {
    padding: 12px 25px;
    border-radius: 30px;
    font-size: 1.2rem;
    background-color: #ff6347;
    color: white;
    border: 2px solid #ff6347;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
  }
  
  .btn-go-home:hover {
    background-color: #ff6347;
    color: black;
    border: 2px solid #ff6347;
  }
  
  /* Event List Section */
  .event-list {
    margin-top: 40px;
    width: 100%;
    max-width: 1200px;
    text-align: center;
  }
  
  .event-list h2 {
    font-size: 2.5rem;
    margin-bottom: 30px;
    color: #333;
  }
  
  .events {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .event-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
  }
  
  .event-card:hover {
    transform: translateY(-5px);
  }
  
  .event-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .event-info {
    padding: 20px;
  }
  
  .event-info h3 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  
  .event-info p {
    font-size: 1rem;
    margin-bottom: 20px;
    color: #555;
  }
  
  .btn-view-event {
    padding: 10px 20px;
    background-color: #ff6347;
    color: white;
    text-decoration: none;
    border-radius: 20px;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .btn-view-event:hover {
    background-color: #ff7f50;
  }
  </style>
  