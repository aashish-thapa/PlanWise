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

      <button @click="navigateToTaskManager" class="add-button">Go to Task Manager</button>

      <!-- Manage Expenses -->
      <div class="manage-expenses">
        <h2 class="section-title">Manage Expenses</h2>
        <button @click="navigateToExpenses" class="expense-button">Manage Expenses</button>

        <div v-if="expenses.length" class="expense-list">
          <h3>Expenses for this Event:</h3>
          <ul>
            <li v-for="expense in expenses" :key="expense.id">
              {{ expense.description }} - ${{ expense.amount }} ({{ expense.category }})
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Right side: Event Details and Guests -->
    <div class="right-side">
      <h1 v-if="event" class="event-title">{{ event.title }}</h1>

      <button @click="isEditing = !isEditing" class="edit-event-button">
        {{ isEditing ? "Cancel Edit" : "Edit Event" }}
      </button>

      <!-- Event Details Form -->
      <div v-if="isEditing" class="form-container">
        <h2 class="form-title">Edit Event</h2>
        
        <label for="eventTitle">Title:</label>
        <input id="eventTitle" v-model="event.title" type="text" class="input-field" />
        
        <label for="eventDate">Date:</label>
        <input id="eventDate" v-model="event.date" type="date" class="input-field" />
        
        <label for="eventTime">Time:</label>
        <input id="eventTime" v-model="event.time" type="time" class="input-field" />
        
        <label for="eventLocation">Location:</label>
        <input id="eventLocation" v-model="event.location" type="text" class="input-field" />
        
        <label for="eventImage">Image URL:</label>
        <input id="eventImage" v-model="event.image" type="text" class="input-field" />

        <button @click="updateEvent" class="save-button">Save Changes</button>
      </div>

      <!-- Delete Event Button -->
      <button @click="deleteEvent" class="delete-event-button" v-if="!isEditing">
        Delete Event
      </button>

      <!-- Invite Guests -->
      <h2 class="section-title">Invite Guests</h2>
      <form @submit.prevent="addGuest" class="guest-form">
        <input v-model="newGuest.name" type="text" placeholder="Guest Name" required class="guest-input" />
        <input v-model="newGuest.email" type="email" placeholder="Guest Email" required class="guest-input" />
        <button type="submit" class="add-guest-button">Add Guest</button>
      </form>

      <!-- Edit form for the selected guest -->
      <div v-if="guestToEdit" class="edit-form">
        <h3>Edit Guest</h3>
        <form @submit.prevent="saveGuestEdit">
          <div>
            <label for="name">Name:</label>
            <input type="text" v-model="guestToEdit.name" id="name" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" v-model="guestToEdit.email" id="email" required />
          </div>
          <div>
            <label for="rsvp_status">RSVP Status:</label>
            <select v-model="guestToEdit.rsvp_status" id="rsvp_status">
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>

      <h2 class="guest-list-title">Attending Guests ({{ guestCount }})</h2>
      <ul class="guest-list">
        <li v-for="guest in guests" :key="guest.id" class="guest-item">
          <div class="guest-info">
            {{ guest.name ? guest.name : "Unknown" }} 
            ({{ guest.email ? guest.email : "No Email" }}) - 
            RSVP: {{ guest.rsvp_status ? guest.rsvp_status : "Pending" }}
          </div>

          <!-- Edit and Delete buttons (visible on hover) -->
          <div class="guest-actions">
            <button @click="editGuest(guest)" class="edit-button">Edit</button>
            <button @click="deleteGuest(guest.id)" class="delete-button">Delete</button>
          </div>
        </li>
      </ul>

      <button @click="sendInvitations" class="send-invitations-button">Send Invitations to All</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const backend = process.env.VUE_APP_ROOT_URL;
export default {
  data() {
    return {
      event: null,
      tasks: [],
      guests: [],
      guestToEdit: null,
      newGuest: { name: "", email: "" },
      expenses: [],
      isEditing: false,
    };
  },
  computed: {
    guestCount() {
      return this.guests.length;
    },
    totalExpenses() {
      return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    },
  },
  async created() {
    await this.fetchEvent();  // Ensure event is loaded first
    if (this.event && this.event.id) {
    this.fetchGuests(); // Fetch guests after event is available
    this.fetchExpenses(); // Fetch expenses as usual
  } else {
    console.error("Event data is not loaded, cannot fetch expenses");
  } // Fetch expenses as usual
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem("token");
      return {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
    },
    async fetchEvent() {
      try {
        const response = await axios.get(
          `${backend}/api/events/${this.$route.params.id}`,
          this.getAuthHeaders()
        );
        this.event = response.data;
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    },
    async updateEvent() {
      try {
        const updatedEvent = {
          title: this.event.title,
          date: this.event.date,
          time: this.event.time,
          location: this.event.location,
          image: this.event.image,
        };

        await axios.put(
          `${backend}/api/events/${this.event.id}`,
          updatedEvent,
          this.getAuthHeaders()
        );

        alert("Event updated successfully");
        this.isEditing = false;
        this.fetchEvent(); // Refresh event details after update
      } catch (error) {
        console.error("Error updating event:", error);
      }
    },
    async deleteEvent() {
      if (confirm("Are you sure you want to delete this event?")) {
        try {
          await axios.delete(
            `${backend}/api/events/${this.event.id}`,
            this.getAuthHeaders()
          );
          alert("Event deleted successfully");
          this.$router.push("/events"); // Redirect to events list after deletion
        } catch (error) {
          console.error("Error deleting event:", error);
        }
      }
    },

    async fetchGuests() {
      if (!this.event || !this.event.id) {
        console.error("Event ID is not available yet");
        return;
      }
      try {
        const response = await axios.get(
          `${backend}/api/guests/${this.event.id}`,
          this.getAuthHeaders()
        );

        if (response.data && Array.isArray(response.data.guests)) {
          this.guests = response.data.guests;
        } else {
          console.error("Invalid response format for guests:", response.data);
        }
      } catch (error) {
        console.error("Error fetching guests:", error);
      }
    },
    async addGuest() {
  if (!this.event) {
    alert("Event not loaded, cannot add guest.");
    return;
  }

  try {
    const response = await axios.post(
      `${backend}/api/guests`,
      {
        event_id : this.event.id,
        name: this.newGuest.name,
        email: this.newGuest.email,
      },
      this.getAuthHeaders()
    );
    console.log("API Response: ", response.data);
    this.newGuest = { name: "", email: "" }; // Reset form
    this.fetchGuests(); // Refresh guest list after adding a new guest
  } catch (error) {
    console.error("Error adding guest:", error);
  }
}
    ,

    async deleteGuest(guestId) {
      try {
        await axios.delete(
          `${backend}/api/guests/${guestId}`,
          this.getAuthHeaders()
        );
        this.guests = this.guests.filter((guest) => guest.id !== guestId);
      } catch (error) {
        console.error("Error deleting guest:", error);
      }
    },

    editGuest(guest) {
      this.guestToEdit = { ...guest };
    },

    async saveGuestEdit() {
      try {
        await axios.put(
          `${backend}/api/guests/${this.guestToEdit.id}`,
          this.guestToEdit,
          this.getAuthHeaders()
        );
        this.guests = this.guests.map((guest) =>
          guest.id === this.guestToEdit.id ? this.guestToEdit : guest
        );
        this.guestToEdit = null; // Reset edit form
      } catch (error) {
        console.error("Error saving guest edit:", error);
      }
    },

    cancelEdit() {
      this.guestToEdit = null;
    },

    async fetchExpenses() {
      if (!this.event) {
        console.error("Event is not loaded yet.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${backend}/api/expenses/${this.event.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        this.expenses = response.data;
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    },

    navigateToTaskManager() {
      this.$router.push({ name: "TaskManager" });
    },
    navigateToExpenses() {
      this.$router.push({ name: "Expenses" });
    },

    sendInvitations() {
      alert("Sending invitations...");
      // Implement sending invitations
    },
  },
};
</script>


<style scoped>
.edit-event-button {
  margin-bottom: 15px;
  background-color: #f39c12;
}

.edit-event-button:hover {
  background-color: #e67e22;
}
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
  .edit-form {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  margin-top: 20px;
  border-radius: 5px;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.edit-form h3 {
  text-align: center;
}

.edit-form form {
  display: flex;
  flex-direction: column;
}

.edit-form input,
.edit-form select,
.edit-form button {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.edit-form button {
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

.edit-form button[type="button"] {
  background-color: #f44336;
}

.edit-form button:hover {
  background-color: #45a049;
}

.edit-form button[type="button"]:hover {
  background-color: #e53935;
}
  
  .guest-list {
    list-style: none;
    padding: 0;
  }
  
  .guest-item {
    position: relative;
  }
  .guest-actions {
  display: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.guest-item:hover .guest-actions {
  display: block;
}

.edit-button{
  margin-left: 5px;
  padding: 5px;
  background-color: orange;
  border: none;
  cursor: pointer;
}
.delete-button {
  margin-left: 5px;
  padding: 5px;
  background-color: red;
  border: none;
  cursor: pointer;
}

.edit-button:hover,
.delete-button:hover {
  background-color: #ddd;
}
  
  .event-title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  </style>
  