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
          <option value="beverages">Beverages</option>
          <option value="other">Other</option>
        </select>

        <button type="submit">Add Expense</button>
      </form>
      <LoadingComponent :loading="loading" message="Adding Expenses..." />
    </div>

    <!-- Expenses List -->
    <h2>Expenses List</h2>
    <ul class="expenses-list">
      <li v-for="expense in expenses" :key="expense.id" 
          @mouseover="hoveredExpense = expense" @mouseleave="hoveredExpense = null">
        <span>{{ expense.description }}</span>
        <span class="amount">${{ parseFloat(expense.amount).toFixed(2) }}</span>
        <span class="category">{{ expense.category }}</span>

        <!-- Edit and Delete Buttons -->
        <div v-if="hoveredExpense && hoveredExpense.id === expense.id" class="expense-actions">
          <button @click="editExpense(expense)">Edit</button>
          <button @click="deleteExpense(expense.id)">Delete</button>
        </div>
      </li>
    </ul>

    <!-- Total Expenses -->
    <div class="total-expenses">
      <h2>Total Expenses: ${{ totalExpenses.toFixed(2) }}</h2>
    </div>

    <!-- Edit Expense Modal -->
    <div v-if="editingExpense" class="edit-expense-modal">
      <div class="modal-content">
        <h2>Edit Expense</h2>
        <form @submit.prevent="updateExpense">
          <label>Description:</label>
          <input v-model="editingExpense.description" type="text" required />

          <label>Amount:</label>
          <input v-model="editingExpense.amount" type="number" min="0" step="0.01" required />

          <label>Category:</label>
          <select v-model="editingExpense.category" required>
            <option value="decoration">Decoration</option>
            <option value="food">Food</option>
            <option value="venue">Venue</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>

          <button type="submit">Update Expense</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>
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
import LoadingComponent from "@/components/LoadingComponent.vue";
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
import { useToast } from "vue-toastification";

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

const backend = process.env.VUE_APP_ROOT_URL;

export default {
  components: {
    LoadingComponent,
  },
  data() {
    return {
      event: null,
      expenses: [],
      newExpense: { description: "", amount: "", category: "decoration" },
      hoveredExpense: null,
      chartInstance: null, // To hold the chart instance for updating
      loading: false,
      editingExpense: null, // For handling the expense edit modal
    };
  },
  computed: {
    totalExpenses() {
      return this.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    },
  },
  created() {
    this.fetchEvent();
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async fetchEvent() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${backend}/api/events/${this.$route.params.id}`,
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
          `${backend}/api/expenses/${this.event.id}`,
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
        this.loading = true;
        await axios.post(
          `${backend}/api/expenses`,
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
        
        this.loading = false;
        this.toast.success("Expenses added successfully");
        this.newExpense = { description: "", amount: "", category: "decoration" };
        this.fetchExpenses();
      } catch (error) {
        this.toast.error("Error adding expense:", error);
      } finally{
        this.loading = false;
      }
    },
    async editExpense(expense) {
      this.editingExpense = { ...expense }; // Make a copy for editing
    },
    async updateExpense() {
      try {
        this.loading = true;
        const token = localStorage.getItem("token");
        await axios.put(
          `${backend}/api/expenses/${this.editingExpense.id}`,
          this.editingExpense,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        this.loading=false;
        this.toast.success("Expenses updated successfully");
        this.fetchExpenses();
        this.editingExpense = null; // Close the edit modal after update
      } catch (error) {
        this.toast.error("Error updating expense:", error);
      }
    },
    cancelEdit() {
      this.editingExpense = null; // Close the edit modal without saving
    },
    async deleteExpense(expenseId) {
      if (confirm("Are you sure you want to delete this expense?")) {
        try {
          this.loading= true;
          const token = localStorage.getItem("token");
          await axios.delete(
            `${backend}/api/expenses/${expenseId}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          this.loading=false;
          this.toast.success("Expenses deleted successfully.")
          this.fetchExpenses(); // Refresh expenses after delete
        } catch (error) {
          this.toast.error("Error deleting expense:", error);
          this.loading = false;
        }
      }
    },
    createChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy(); // Destroy the old chart if it exists
      }

      const categories = [...new Set(this.expenses.map((exp) => exp.category))];
      const amounts = categories.map((category) =>
        this.expenses
          .filter((exp) => exp.category === category)
          .reduce((acc, exp) => acc + parseFloat(exp.amount), 0)
      );

      // Define colors for each category
      const categoryColors = {
        decoration: "rgba(75, 192, 192, 0.2)",
        food: "rgba(255, 99, 132, 0.2)",
        venue: "rgba(54, 162, 235, 0.2)",
        entertainment: "rgba(153, 102, 255, 0.2)",
        other: "rgba(255, 159, 64, 0.2)"
      };

      const borderColor = {
        decoration: "rgba(75, 192, 192, 1)",
        food: "rgba(255, 99, 132, 1)",
        venue: "rgba(54, 162, 235, 1)",
        entertainment: "rgba(153, 102, 255, 1)",
        
        other: "rgba(255, 159, 64, 1)"
      };

      // Map each category to its corresponding color
      const backgroundColors = categories.map((category) => categoryColors[category]);
      const borderColors = categories.map((category) => borderColor[category]);

      const ctx = document.getElementById("expenseChart").getContext("2d");
      this.chartInstance = new ChartJS(ctx, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [
            {
              label: "Expense Amount ($)",
              data: amounts,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Expense Distribution by Category",
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.raw.toFixed(2)} $`,
              },
            },
          },
        },
      });
    },
  },
};
</script>




<style scoped>
/* Style for the edit modal */
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

/* Hover effect and details */
.expenses-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  flex-wrap: wrap;
  position: relative;
  transition: background-color 0.3s;
}

.expenses-list li:hover {
  background-color: #e0e0e0;
}

/* Details box that shows on hover */
.hover-details {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  max-width: 250px;
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
.edit-expense-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

button {
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}
</style>
