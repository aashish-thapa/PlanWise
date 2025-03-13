<template>
  <div class="task-manager">
    <h2>Task Manager</h2>
    <form @submit.prevent="addTask" class="task-form">
      <input v-model="newTask.title" placeholder="Task Title" required />
      <textarea v-model="newTask.description" placeholder="Task Description"></textarea>
      <input type="date" v-model="newTask.due_date" required />
      <button type="submit">{{ isEditing ? "Update Task" : "Add Task" }}</button>
    </form>

    <div v-if="tasks.length" class="task-list">
      <h3>Your Tasks</h3>
      <ul>
        <li v-for="task in tasks" :key="task.id" class="task-item">
          <div class="task-content">
            <strong>{{ task.title }}</strong>
            <span class="due-date">{{ task.due_date }}</span>
            <p>{{ task.description }}</p>
          </div>
          <div class="task-actions">
            <button class="edit-btn" @click="loadTaskForEdit(task)">Edit</button>
            <button class="delete-btn" @click="deleteTask(task.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      newTask: {
        event_id: '',
        title: '',
        description: '',
        due_date: ''
      },
      isEditing: false,
      editTaskId: null,
      token: localStorage.getItem('token') || ''
    };
  },
  methods: {
    async fetchTasks() {
  try {
    const response = await axios.get(`http://localhost:5000/api/tasks/${this.$route.params.id}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    this.tasks = response.data.tasks; // Extracting the tasks array
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
},
    async addTask() {
      try {
        this.newTask.event_id = this.$route.params.id;
        if (this.isEditing) {
          await axios.put(`http://localhost:5000/api/tasks/${this.editTaskId}`, this.newTask, {
            headers: { Authorization: `Bearer ${this.token}` }
          });
          this.isEditing = false;
          this.editTaskId = null;
        } else {
          await axios.post(`http://localhost:5000/api/tasks`, this.newTask, {
            headers: { Authorization: `Bearer ${this.token}` }
          });
        }
        this.fetchTasks();
        this.resetTaskForm();
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
    async deleteTask(taskId) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    loadTaskForEdit(task) {
      this.newTask = { ...task };
      this.isEditing = true;
      this.editTaskId = task.id;
    },
    resetTaskForm() {
      this.newTask = { event_id: this.$route.params.id, title: '', description: '', due_date: '' };
    }
  },
  mounted() {
    this.fetchTasks();
  }
};
</script>

<style scoped>
.task-manager {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-form input, .task-form textarea, .task-form button {
  display: block;
  margin: 10px 0;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.task-form button {
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.task-form button:hover {
  background: #0056b3;
}

.task-list {
  margin-top: 20px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.task-content {
  flex: 1;
}

.due-date {
  font-size: 0.9em;
  color: #888;
}

.task-actions button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.edit-btn {
  background: #ffc107;
  color: white;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.edit-btn:hover {
  background: #e0a800;
}

.delete-btn:hover {
  background: #c82333;
}
</style>
