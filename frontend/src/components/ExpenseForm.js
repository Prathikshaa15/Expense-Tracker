import React, { useState } from 'react';
import axios from 'axios';

function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({ title: '', amount: '', category: '' });
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/expenses', form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({ title: '', amount: '', category: '' });
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      <input placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
      <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
      <button>Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
