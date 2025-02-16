'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, Pencil } from 'lucide-react';
import Header from '../components/header';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  suggestedTag: string;
}

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(transactions);
  }, []);

  const handleEditTransaction = (id: string) => {
    console.log('Edit transaction:', id);
  };

  const handleEditTags = () => {
    console.log('Edit tags clicked');
  };

  const getTagColor = (tag: string) => {
    const tagColors: { [key: string]: string } = {
      'Groceries': 'text-green-600',
      'Entertainment': 'text-purple-600',
      'Utilities': 'text-blue-600',
      'Dining': 'text-orange-600',
      'Health': 'text-red-600',
      'Transportation': 'text-yellow-600',
      'Education': 'text-indigo-600'
    };
    return tagColors[tag] || 'text-gray-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transaction List</h1>
        <button
          onClick={handleEditTags}
          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2"
        >
          <Pencil className="w-4 h-4" />
          Edit Tags
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Transaction ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Suggested Tag</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${transaction.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <button className="flex items-center gap-2 px-3 py-1 border rounded-md">
                    {transaction.date}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${getTagColor(transaction.suggestedTag)}`}>
                    {transaction.suggestedTag}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditTransaction(transaction.id)}
                    className="px-4 py-1 bg-green-600 text-white rounded-md"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;