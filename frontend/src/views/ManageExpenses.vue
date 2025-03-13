<template>
  <div class="manage-expenses-container">
    <h1 v-if="event">Manage Expenses for Event: {{ event.title }}</h1>
    <p v-else>Loading event details...</p>

    <!-- Add Expense Form -->
    <div class="expense-form">
      <h2>Add Expense</h2>
      <form @submit.prevent="addExpense">
        <label>Description:</label>
        <input v-model="newExpense.description" type="text" required />

        <label>Amount:</label>
        <input v-model="newExpense.amount" type="number" min="0" step="0.01" required />

        <label>Category:</label>
        <select v-model="newExpense.category" required>
          <option value="decoration">Decoration</option>
          <option value="food">Food</option>
          <option value="venue">Venue</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>

        <button type="submit">Add Expense</button>
      </form>
    </div>

    <!-- Expenses List -->
    <h2>Expenses List</h2>
    <ul class="expenses-list">
      <li v-for="expense in expenses" :key="expense.id">
        <span>{{ expense.description }}</span>
        <span class="amount">${{ parseFloat(expense.amount).toFixed(2) }}</span>
        <span class="category">{{ expense.category }}</span>
      </li>
    </ul>

    <!-- Total Expenses -->
    <div class="total-expenses">
      <h2>Total Expenses: ${{ totalExpenses.toFixed(2) }}</h2>
    </div>

    <!-- Chart for Expenses -->
    <div class="chart-container">
      <h2>Expense Distribution</h2>
      <canvas id="expenseChart"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

export default {
  data() {
    return {
      event: null,
      expenses: [],
      newExpense: { description: "", amount: "", category: "decoration" },
    };
  },
  computed: {
    // Compute total expenses dynamically
    totalExpenses() {
      return this.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    },
  },
  created() {
    this.fetchEvent();
  },
  methods: {
    async fetchEvent() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/events/${this.$route.params.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        this.event = response.data;
        if (this.event) {
          this.fetchExpenses();
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    },
    async fetchExpenses() {
      if (!this.event) {
        console.error("Event is not loaded yet.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/expenses/${this.event.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        this.expenses = response.data;
        this.createChart();
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    },
    async addExpense() {
      if (!this.event) {
        console.error("Event not loaded, cannot add expense.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/api/expenses",
          {
            event_id: this.event.id,
            description: this.newExpense.description,
            amount: this.newExpense.amount,
            category: this.newExpense.category,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        this.newExpense = { description: "", amount: "", category: "decoration" };
        this.fetchExpenses();
        
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    },
    createChart() {
      const categories = [...new Set(this.expenses.map((exp) => exp.category))];
      const amounts = categories.map((category) =>
        this.expenses
          .filter((exp) => exp.category === category)
          .reduce((acc, exp) => acc + parseFloat(exp.amount), 0)
      );

      const ctx = document.getElementById("expenseChart").getContext("2d");
      new ChartJS(ctx, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [
            {
              label: "Expense Amount",
              data: amounts,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
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

h1,
h2 {
  text-align: center;
  color: #333;
}

/* Responsive Styling */
@media (max-width: 768px) {
  .manage-expenses-container {
    padding: 10px;
  }
}

/* Expense Form */
.expense-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
}

.expense-form label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

.expense-form input,
.expense-form select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

button {
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

/* Expenses List */
.expenses-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.expenses-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.amount {
  font-weight: bold;
  color: #007bff;
}

.category {
  font-style: italic;
  color: #555;
}

/* Total Expenses */
.total-expenses {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
}

/* Chart */
.chart-container {
  width: 100%;
  height: auto;
  margin-top: 30px;
  text-align: center;
}
</style>
