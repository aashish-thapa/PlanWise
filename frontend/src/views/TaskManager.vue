<template>
  <div class="task-manager">
    <h2>Task Manager</h2>
    <form @submit.prevent="addTask" class="task-form">
      <input v-model="newTask.title" placeholder="Task Title" required />
      <textarea v-model="newTask.description" placeholder="Task Description"></textarea>
      <input type="date" v-model="newTask.due_date" required />
      <button type="submit">{{ isEditing ? "Update Task" : "Add Task" }}</button>
    </form>
    <LoadingComponent :loading="loading" message="Processing task..." />
    <div v-if="tasks.length > 0" class="task-list">
      <h3>Your Tasks</h3>
      <ul>
        <li v-for="task in tasks" :key="task.id" class="task-item">
          <div class="task-content">
            <strong>{{ task.title }}</strong>
            <span class="due-date">{{ formatDate(task.due_date)}}</span>
            <p>{{ task.description }}</p>
          </div>
          <div class="task-actions">
            <button class="edit-btn" @click="loadTaskForEdit(task)">Edit</button>
            <button class="delete-btn" @click="deleteTask(task.id)">Done</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="no-tasks">
      <p>No tasks added yet. Start by creating a task!</p>
    </div>
  </div>
</template>

<script>
import LoadingComponent from '@/components/LoadingComponent.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const backend = process.env.VUE_APP_ROOT_URL;

export default {
  components: {
    LoadingComponent
  },
  data() {
    return {
      tasks: [],
      loading: false,
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
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    formatDate(dateString){
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  },
    async fetchTasks() {
      this.loading = true;
      try {
        const response = await axios.get(`${backend}/api/tasks/${this.$route.params.id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.tasks = response.data.tasks.map(task => ({
      ...task,
      due_date: new Date(task.due_date) // Ensure the date is parsed as a Date object
    })).sort((a, b) => a.due_date - b.due_date);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.toast.error('Error fetching tasks');
      }
    },
    async addTask() {
      this.loading = true;
      try {
        this.newTask.event_id = this.$route.params.id;
        if (this.isEditing) {
          await axios.put(`${backend}/api/tasks/${this.editTaskId}`, this.newTask, {
            headers: { Authorization: `Bearer ${this.token}` }
          });
          this.isEditing = false;
          this.editTaskId = null;
          this.toast.success('Task updated successfully');
        } else {
          await axios.post(`${backend}/api/tasks`, this.newTask, {
            headers: { Authorization: `Bearer ${this.token}` }
          });
          this.toast.success('Task added successfully');
        }
        this.fetchTasks();
        this.resetTaskForm();
      } catch (error) {
        this.toast.error('Error saving task');
      } finally {
        this.loading = false;
      }
    },
    async deleteTask(taskId) {
      this.loading = true;
      try {
        await axios.delete(`${backend}/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.toast.success('Task deleted successfully');
        this.fetchTasks();
      } catch (error) {
        this.toast.error('Error deleting task');
      } finally {
        this.loading = false;
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
  },
  
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

.task-form input,
.task-form textarea,
.task-form button {
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
  position: relative; /* For positioning the actions */
  transition: background-color 0.3s ease;
}

.task-item:hover {
  background-color: #f0f0f0;
}

.task-content {
  flex: 1;
}

.due-date {
  padding: 5%;
  font-size: 0.9em;
  color: #888;
}

/* Task Actions - hidden by default and shown on hover */
.task-actions {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  opacity: 0;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.task-item:hover .task-actions {
  opacity: 1;
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

.no-tasks {
  text-align: center;
  color: #888;
  font-size: 1.2em;
  margin-top: 20px;
}
</style>
