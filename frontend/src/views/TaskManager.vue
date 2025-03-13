<template>
    <v-container>
      <!-- Add Task Button -->
      <v-row>
        <v-col>
          <v-btn color="primary" @click="openTaskDialog()">Add Task</v-btn>
        </v-col>
      </v-row>
  
      <!-- Tasks List -->
      <v-row>
        <v-col cols="12">
          <v-data-table :headers="taskHeaders" :items="tasks" item-key="id">
            <template #item="{ item }">
              <v-btn icon color="blue" @click="openTaskDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deleteTask(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
  
      <!-- Task Dialog -->
      <v-dialog v-model="taskDialog" max-width="500px">
        <v-card>
          <v-card-title>{{ isEditing ? 'Edit Task' : 'Add Task' }}</v-card-title>
          <v-card-text>
            <v-text-field label="Title" v-model="taskForm.title" required></v-text-field>
            <v-textarea label="Description" v-model="taskForm.description"></v-textarea>
            <v-text-field label="Due Date" type="date" v-model="taskForm.due_date"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="grey" @click="taskDialog = false">Cancel</v-btn>
            <v-btn color="green" @click="saveTask">{{ isEditing ? 'Update' : 'Add' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // State variables
  const tasks = ref([]);
  const taskDialog = ref(false);
  const taskForm = ref({ id: null, title: '', description: '', due_date: '', event_id: null });
  const isEditing = ref(false);
  const taskHeaders = [
    { title: 'Title', key: 'title' },
    { title: 'Description', key: 'description' },
    { title: 'Due Date', key: 'due_date' },
    { title: 'Actions', key: 'actions', sortable: false }
  ];
  
  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };
  
  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', getAuthHeaders());
      tasks.value = response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  // Open the task dialog (Add/Edit)
  const openTaskDialog = (task = null) => {
    if (task) {
      taskForm.value = { ...task };
      isEditing.value = true;
    } else {
      taskForm.value = { id: null, title: '', description: '', due_date: '', event_id: null };
      isEditing.value = false;
    }
    taskDialog.value = true;
  };
  
  // Save Task (Add or Update)
  const saveTask = async () => {
    try {
      if (isEditing.value) {
        await axios.put(`/api/tasks/${taskForm.value.id}`, {
          title: taskForm.value.title,
          description: taskForm.value.description,
          due_date: taskForm.value.due_date,
        }, getAuthHeaders());
      } else {
        await axios.post('/api/tasks', taskForm.value, getAuthHeaders());
      }
      taskDialog.value = false;
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  
  // Delete Task
  const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`, getAuthHeaders());
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  // Fetch tasks on component mount
  onMounted(fetchTasks);
  </script>
  
  <style scoped>
  .v-btn {
    margin: 5px;
  }
  
  .v-card {
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .v-data-table th {
    background-color: #1976d2;
    color: white;
  }
  
  .v-data-table td {
    padding: 16px;
  }
  
  .v-dialog {
    border-radius: 10px;
  }
  
  .v-text-field,
  .v-textarea {
    margin-bottom: 10px;
  }
  
  .v-card-actions {
    display: flex;
    justify-content: space-between;
  }
  </style>
  