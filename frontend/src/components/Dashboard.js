import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "./Dashboard.css";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });
  const [total, setTotal] = useState(0);
  const [chartType, setChartType] = useState("pie");

  const categoryColors = {
    Food: "#A8E6CF",
    Travel: "#FFD3B6",
    Shopping: "#FFAAA5",
    Entertainment: "#D4A5A5",
    Bills: "#E4C1F9",
    Health: "#81ECEC",
    Others: "#FFE156",
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    setTotal(totalAmount);
  }, [expenses]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async () => {
    if (form.title && form.amount && form.category) {
      const newExp = { ...form, amount: parseFloat(form.amount) };
      const token = localStorage.getItem("token");

      if (token) {
        try {
          await axios.post(
            "http://localhost:5000/api/expenses",
            newExp,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchExpenses();
          setForm({ title: "", amount: "", category: "" });
        } catch (err) {
          console.error("Error adding expense:", err);
        }
      } else {
        setExpenses([...expenses, { ...newExp, id: Date.now() }]);
        setForm({ title: "", amount: "", category: "" });
      }
    } else {
      alert("Please fill all fields!");
    }
  };

  const handleDelete = async (id) => {
    const expenseToDelete = expenses.find((exp) => (exp.id || exp._id) === id);
    if (!expenseToDelete) return;

    const token = localStorage.getItem("token");

    if (token && expenseToDelete._id) {
      try {
        await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(expenses.filter((exp) => (exp.id || exp._id) !== id));
      } catch (err) {
        console.error("Failed to delete expense:", err);
      }
    } else {
      setExpenses(expenses.filter((exp) => (exp.id || exp._id) !== id));
    }
  };

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(
          (cat) => categoryColors[cat] || "#ccc"
        ),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="add-expense-card">
        <h2>Add Expense</h2>
        <input
          name="title"
          placeholder="Expense Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {Object.keys(categoryColors).map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>

      <div className="expense-summary">
        <h2>Total Expense: ₹{total}</h2>
        <button
          className="toggle-btn"
          onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}
        >
          Switch to {chartType === "pie" ? "Bar" : "Pie"} Chart
        </button>
      </div>

      <div className="chart-container">
        {chartType === "pie" ? <Pie data={chartData} /> : <Bar data={chartData} />}
      </div>

      <div className="expense-list">
        <h3>Expense Details</h3>
        {expenses.map((exp) => (
          <div
            key={exp.id || exp._id}
            className="expense-item"
            style={{ borderLeft: `8px solid ${categoryColors[exp.category] || "#ccc"}` }}
          >
            <div>
              <strong>{exp.title}</strong> — ₹{exp.amount} <span>({exp.category})</span>
            </div>
            <button onClick={() => handleDelete(exp.id || exp._id)}>❌</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;