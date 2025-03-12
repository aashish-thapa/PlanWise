<template>
    <div class="add-event-container">
      <div class="form-box">
        <h1>Create Event 🎉</h1>
        <form @submit.prevent="addEvent">
          <div class="form-group">
            <label for="name">Event Name:</label>
            <input type="text" id="name" v-model="event.name" required />
          </div>
          <div class="form-group">
            <label for="date">Event Date:</label>
            <input type="date" id="date" v-model="event.date" required />
          </div>
          <div class="form-group">
            <label for="time">Event Time:</label>
            <input type="time" id="time" v-model="event.time" required />
          </div>
          <div class="form-group">
            <label for="location">Event Location:</label>
            <input type="text" id="location" v-model="event.location" required />
          </div>
          <div class="form-group">
            <label for="imageUrl">Event Image URL:</label>
            <input type="url" id="imageUrl" v-model="event.imageUrl" placeholder="Image URL (optional)" />
          </div>
          <button type="submit" class="submit-btn">Create Event</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        event: {
          name: '',
          date: '',
          time: '',
          location: '',
          imageUrl: '',
        },
      };
    },
    methods: {
      addEvent() {
        const eventData = {
          name: this.event.name,
          date: this.event.date,
          time: this.event.time,
          location: this.event.location,
          imageUrl: this.event.imageUrl,
        };

        const token = localStorage.getItem("token");
  
        axios.post('http://localhost:5000/api/events', eventData, {
  headers: {
    Authorization: `Bearer ${token}` // Replace with actual token storage method
  }
})
          .then(response => {
            console.log('Event Created:', response);
            this.$router.push('/events');
          })
          .catch(error => {
            console.error('Error creating event:', error);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Background container */
  .add-event-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #f9f9f9, #eef2f3);
  }
  
  /* Form box */
  .form-box {
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }
  
  /* Title */
  .form-box h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }
  
  /* Form inputs */
  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    transition: border 0.3s ease;
  }
  
  .form-group input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
  }
  
  /* Submit button */
  .submit-btn {
    width: 100%;
    padding: 12px;
    font-size: 18px;
    color: white;
    background: #007bff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
  }
  
  .submit-btn:hover {
    background: #0056b3;
    transform: scale(1.02);
  }
  
  .submit-btn:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  }
  
  /* Responsive design */
  @media (max-width: 480px) {
    .form-box {
      width: 90%;
      padding: 20px;
    }
  }
  </style>
  