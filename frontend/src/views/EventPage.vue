<template>
    <div class="event-page-container">
      <div class="hero-section">
        <h1>Event Page</h1>
        <p>Explore and manage all the upcoming events.</p>
  
        <!-- Add Event Button -->
        <router-link to="/add-event" class="btn-add-event">Add Event</router-link>
        
        <!-- Go to Home Button -->
        <router-link to="/" class="btn-go-home">Go to Home</router-link>
      </div>
  
      <!-- Event List Section -->
      <section class="event-list">
        <h2>Upcoming Events</h2>
        <div class="events">
          <!-- If there are no events -->
          <div v-if="events.length === 0" class="no-events">
            <p>No events to display. Start by adding one!</p>
          </div>
  
          <!-- Event Cards -->
          <div class="event-card" v-for="event in events" :key="event.id">
            
            <img :src="event.image_url" :alt="event.name"/>
            <div class="event-info">
              <h3>{{ event.name }}</h3>
              <p>{{ event.date }}</p>
              <router-link :to="`/event/${event.id}`" class="btn-view-event">
                View Details
              </router-link>            
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  const backend = process.env.VUE_APP_BACKEND || 'http://localhost:5000';

  export default {
    name: "EventPage",
    data() {
      return {
        events: [], // Stores events fetched from API
      };
    },
    created() {
      this.fetchEvents();
    },
    methods: {
      // Fetch Events from API
      async fetchEvents() {
        try {
          
          const token = localStorage.getItem('token'); // Retrieve stored token
          const response = await axios.get(`${backend}/api/events`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          console.log(response.data);
  
          this.events = response.data;
        } catch (error) {
          console.error("Error fetching events:", error.response?.data || error.message);
        }
      },
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
    background: #082d55;
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
  
  /* Add Event Button */
  .btn-add-event {
    padding: 12px 25px;
    border-radius: 30px;
    font-size: 1.2rem;
    background-color: #4caf50;
    color: white;
    border: 2px solid #4caf50;
    text-decoration: none;
    display: inline-block;
    margin-right: 40px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
  }
  
  .btn-add-event:hover {
    background-color: #45a049;
    color: black;
    border: 2px solid #45a049;
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
    object-fit: contain;
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
  
  /* No Events Section */
  .no-events {
    font-size: 1.2rem;
    color: #999;
    margin-top: 20px;
  }
  </style>
  