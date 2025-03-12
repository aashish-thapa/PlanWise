<template>
    <div class="manage-expenses-container">
      <h1>Manage Expenses for Event: {{ event.title }}</h1>
      
      <!-- Add Expense Form -->
      <div class="expense-form">
        <h2>Add Expense</h2>
        <form @submit.prevent="addExpense">
          <label>Description:</label>
          <input v-model="newExpense.description" type="text" required />
          
          <label>Amount:</label>
          <input v-model="newExpense.amount" type="number" min="0" step="0.01" required />
  
          <label>Category:</label>
          <input v-model="newExpense.category" type="text" />
  
          <button type="submit">Add Expense</button>
        </form>
      </div>
  
      <!-- Expenses List -->
      <h2>Expenses List</h2>
      <ul>
        <li v-for="expense in expenses" :key="expense.id">
          {{ expense.description }} - ${{ expense.amount }} - {{ expense.category }}
        </li>
      </ul>
  
      <!-- Chart for Expenses -->
      <div class="chart-container">
        <h2>Expense Distribution</h2>
        <canvas id="expenseChart"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  export default {
    data() {
      return {
        event: null,
        expenses: [],
        newExpense: { description: "", amount: "", category: "" },
      };
    },
    created() {
      this.fetchEvent();
      this.fetchExpenses();
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
      async fetchExpenses() {
        try {
          const response = await axios.get(`http://localhost:5000/api/expenses/${this.event.id}`);
          this.expenses = response.data;
          this.createChart(); // Create chart after fetching data
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      },
      async addExpense() {
        try {
          await axios.post('http://localhost:5000/api/expenses', {
            event_id: this.event.id,
            description: this.newExpense.description,
            amount: this.newExpense.amount,
            category: this.newExpense.category,
          });
          this.newExpense = { description: "", amount: "", category: "" }; // Reset form
          this.fetchExpenses(); // Re-fetch expenses
        } catch (error) {
          console.error("Error adding expense:", error);
        }
      },
      createChart() {
        const categories = [...new Set(this.expenses.map(exp => exp.category))]; // Get unique categories
        const amounts = categories.map(category => {
          return this.expenses.filter(exp => exp.category === category)
            .reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
        });
  
        const ctx = document.getElementById('expenseChart').getContext('2d');
        new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: categories,
            datasets: [{
              label: 'Expense Amount',
              data: amounts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .manage-expenses-container {
    padding: 20px;
    max-width: 1200px;
    margin: auto;
  }
  
  .expense-form {
    margin-bottom: 30px;
  }
  
  .expense-form input {
    margin: 10px 0;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ddd;
    width: 100%;
  }
  
  button {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  h2 {
    margin-top: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  ul li {
    margin-bottom: 10px;
  }
  
  .chart-container {
    width: 100%;
    height: 400px;
  }
  </style>
  