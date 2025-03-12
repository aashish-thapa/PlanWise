<template>
    <div class="event-details-container">
      <!-- Left side: Task Manager and Manage Expenses -->
      <div class="left-side">
        <h2 class="section-title">Task Manager</h2>
  
        <!-- Task List -->
        <div v-for="(task, index) in tasks" :key="task.id" class="task-item">
          <input v-model="task.completed" type="checkbox" class="task-checkbox" />
          <input v-model="task.name" type="text" class="task-input" @blur="updateTask(task)" />
          <button @click="deleteTask(index)" class="delete-button">Delete</button>
        </div>
  
        <button @click="addTask" class="add-button">Add Task</button>
  
        <!-- Manage Expenses -->
        <div class="manage-expenses">
          <h2 class="section-title">Manage Expenses</h2>
          <button @click="navigateToExpenses" class="expense-button">Manage Expenses</button>
          
          <!-- Displaying Expenses -->
          <div v-if="expenses.length" class="expense-list">
            <h3>Expenses for this Event:</h3>
            <ul>
              <li v-for="expense in expenses" :key="expense.id">
                {{ expense.description }} - ${{ expense.amount }} ({{ expense.category }})
              </li>
            </ul>
          </div>
          <div v-else>
            <p>No expenses added yet.</p>
          </div>
        </div>
      </div>
  
      <!-- Right side: Event Details and Guests -->
      <div class="right-side">
        <!-- Event Title -->
        <h1 v-if="event" class="event-title">{{ event.title }}</h1>
  
        <!-- Event Details Form -->
        <h2 v-if="event" class="form-title">Edit Event</h2>
        <div v-if="event" class="form-container">
          <label for="eventTitle">Title:</label>
          <input id="eventTitle" v-model="event.title" type="text" class="input-field" />
  
          <label for="eventDate">Date:</label>
          <input id="eventDate" v-model="event.date" type="date" class="input-field" />
  
          <label for="eventDescription">Description:</label>
          <textarea id="eventDescription" v-model="event.description" class="input-field"></textarea>
  
          <label for="eventImage">Image URL:</label>
          <input id="eventImage" v-model="event.image" type="text" class="input-field" />
  
          <button @click="updateEvent" class="save-button">Save Changes</button>
        </div>
  
        <!-- Add Guest Form -->
        <h2 class="section-title">Invite Guests</h2>
        <form @submit.prevent="addGuest" class="guest-form">
          <input v-model="newGuest.name" type="text" placeholder="Guest Name" required class="guest-input" />
          <input v-model="newGuest.email" type="email" placeholder="Guest Email" required class="guest-input" />
          <button type="submit" class="add-guest-button">Add Guest</button>
        </form>
  
        <!-- Guest List -->
        <h2 class="guest-list-title">Attending Guests ({{ guests.length }})</h2>
        <ul class="guest-list">
          <li v-for="guest in guests" :key="guest.id" class="guest-item">
            {{ guest.name }} - {{ guest.rsvp_status }}
          </li>
        </ul>
  
        <button @click="sendInvitations" class="send-invitations-button">Send Invitations to All</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        event: null,
        tasks: [], // For task manager
        guests: [], // For storing attending guests
        newGuest: { name: "", email: "" }, // For adding new guests
        expenses: [], // For storing expenses
      };
    },
    created() {
      this.fetchEvent();
      this.fetchGuests();
      this.fetchExpenses(); // Fetch expenses when the component is created
    },
    methods: {
      async fetchEvent() {
        try {
          const response = await axios.get(`http://localhost:5000/api/events/${this.$route.params.id}`);
          this.event = response.data;
        } catch (error) {
          console.error("Error fetching event details:", error);
        }
      },
      async updateEvent() {
        try {
          await axios.put(`http://localhost:5000/api/events/${this.event.id}`, this.event);
          alert("Event updated successfully");
        } catch (error) {
          console.error("Error updating event:", error);
        }
      },
      async fetchGuests() {
        try {
          const response = await axios.get(`http://localhost:5000/api/guests/${this.event.id}`);
          this.guests = response.data;
        } catch (error) {
          console.error("Error fetching guests:", error);
        }
      },
      async fetchExpenses() {
        try {
          const response = await axios.get(`http://localhost:5000/api/expenses/${this.event.id}`);
          this.expenses = response.data;
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      },
      async addGuest() {
        try {
          await axios.post("http://localhost:5000/api/guests", {
            event_id: this.event.id,
            name: this.newGuest.name,
            email: this.newGuest.email,
          });
          this.newGuest = { name: "", email: "" }; // Reset form fields
          this.fetchGuests(); // Re-fetch guests
        } catch (error) {
          console.error("Error adding guest:", error);
        }
      },
      async sendInvitations() {
        try {
          const emails = this.guests.map(guest => guest.email);
          await axios.post("http://localhost:5000/api/inviteAll", {
            eventId: this.event.id,
            emails,
          });
          alert("Invitations sent to all guests!");
        } catch (error) {
          console.error("Error sending invitations:", error);
        }
      },
      addTask() {
        const newTask = { id: Date.now(), name: "New Task", completed: false };
        this.tasks.push(newTask);
      },
      updateTask(task) {
        console.log("Task updated:", task);
      },
      deleteTask(index) {
        this.tasks.splice(index, 1);
      },
      navigateToExpenses() {
        this.$router.push(`/expenses/${this.event.id}`);
      },
    },
  };
  </script>
  
 <style scoped>
  .event-details-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 30px;
    max-width: 1200px;
    margin: auto;
    background: #f9f9f9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  
  .left-side,
  .right-side {
    width: 48%;
  }
  
  .left-side {
    border-right: 2px solid #ddd;
    padding-right: 30px;
  }
  
  .right-side {
    padding-left: 30px;
  }
  
  h1, h2 {
    font-family: 'Arial', sans-serif;
    color: #333;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .section-title {
    font-size: 1.2rem;
    color: #007bff;
  }
  
  .input-field,
  textarea,
  .guest-input {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }
  
  textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .task-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 10px;
  }
  
  .task-checkbox {
    cursor: pointer;
  }
  
  .task-input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .delete-button {
    background-color: #e74c3c;
  }
  
  .delete-button:hover {
    background-color: #c0392b;
  }
  
  .add-button,
  .expense-button,
  .add-guest-button,
  .send-invitations-button {
    width: 100%;
  }
  
  .guest-list {
    list-style: none;
    padding: 0;
  }
  
  .guest-item {
    background-color: #f2f2f2;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .event-title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  </style>
  