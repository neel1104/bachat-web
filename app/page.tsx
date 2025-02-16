'use client';
import React, { useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import Header from './components/header';

const FinancialInsights = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample monthly spending data
  const monthlySpending = [
    { category: 'Groceries', current: 600, previous: 500 },
    { category: 'Dining', current: 300, previous: 250 },
    { category: 'Transportation', current: 200, previous: 180 },
    { category: 'Entertainment', current: 150, previous: 200 },
    { category: 'Utilities', current: 250, previous: 240 },
    { category: 'Shopping', current: 400, previous: 350 }
  ];

  // Calculate totals for pie chart
  const totalSpending = monthlySpending.reduce((sum, item) => sum + item.current, 0);
  const pieChartData = monthlySpending.map(item => ({
    name: item.category,
    value: item.current
  }));

  // Color palette for charts
  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#607D8B'];

  // Calculate interesting facts
  const facts = monthlySpending.map(item => {
    const percentChange = ((item.current - item.previous) / item.previous) * 100;
    return {
      category: item.category,
      percentChange: percentChange,
      message: `You spent ${Math.abs(percentChange).toFixed(1)}% ${percentChange > 0 ? 'more' : 'less'} on ${item.category.toLowerCase()} this month`
    };
  }).filter(fact => Math.abs(fact.percentChange) > 10);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Header />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Insights</h1>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded-md"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spending</p>
              <p className="text-xl font-bold">${totalSpending.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Biggest Category</p>
              <p className="text-xl font-bold">Groceries</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Most Active Day</p>
              <p className="text-xl font-bold">Fridays</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Comparison Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Monthly Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="previous" name="Last Month" fill="#94a3b8" />
              <Bar dataKey="current" name="This Month" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Spending Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Box */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Interesting Facts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facts.map((fact, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-blue-50 border border-blue-100"
            >
              <p className="text-sm text-blue-800">{fact.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;