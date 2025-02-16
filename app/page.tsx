'use client';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import Header from './components/header';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  tags: string[];
}

const FinancialInsights = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const transactionsFromStorage = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(transactionsFromStorage);
  }, []);

  // Process transactions for pie chart
  const pieChartData = React.useMemo(() => {
    const categoryTotals = transactions.reduce((acc: { [key: string]: number }, transaction) => {
      // Use the first tag as the category
      const category = transaction.tags[0] || 'Uncategorized';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round(Math.abs(value)) // Use absolute value to handle negative amounts
    }));
  }, [transactions]);

  // Calculate total spending from actual transactions
  const totalSpending = React.useMemo(() => 
    transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0),
    [transactions]
  );

  // Color palette for charts
  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#607D8B'];

  // Calculate interesting facts
  // const facts = transactions.map(item => {
  //   const percentChange = ((item.amount) / Math.abs(item.amount)) * 100;
  //   return {
  //     category: item.description,
  //     percentChange: percentChange,
  //     message: `You spent ${Math.abs(percentChange).toFixed(1)}% ${percentChange > 0 ? 'more' : 'less'} on ${item.description.toLowerCase()}`
  //   };
  // }).filter(fact => Math.abs(fact.percentChange) > 10);

  // Process transactions for bar chart
  const barChartData = React.useMemo(() => {
    const categoryTotals = transactions.reduce((acc: { [key: string]: number }, transaction) => {
      const category = transaction.tags[0] || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount: Math.round(amount)
    }));
  }, [transactions]);

  const topCategory = transactions.length > 0 ? barChartData.sort((a, b) => b.amount - a.amount)[0].category : 'No transactions';

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
              <p className="text-xl font-bold">
                {topCategory}
              </p>
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
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" name="Amount" fill="#16a34a" />
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
      {/* <div className="bg-white p-6 rounded-lg shadow-sm border">
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
      </div> */}
    </div>
  );
};

export default FinancialInsights;