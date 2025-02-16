'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, Pencil, Plus, Check, X, Trash, Search, Filter } from 'lucide-react';
import Header from '../components/header';
import { Tags, getTagColor } from '../components/tag'

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    tags: string[];
    suggestedTags: string[];
}

const TransactionList = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
    const [showTagModal, setShowTagModal] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        dateRange: 'all',
        minAmount: '',
        maxAmount: '',
        tags: [] as string[],
        showUntagged: false
    });

    useEffect(() => {
        const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
        setTransactions(transactions);
    }, []);

    const handleEditTransaction = (id: string) => {
        console.log('Edit transaction:', id);
    };

    const handleDeleteTransaction = (id: string) => {
        console.log('Delete transaction:', id);
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())

        if (!matchesSearch) return false;

        const amount = transaction.amount;
        const minAmount = selectedFilters.minAmount ? parseFloat(selectedFilters.minAmount) : 0;
        const maxAmount = selectedFilters.maxAmount ? parseFloat(selectedFilters.maxAmount) : Infinity;

        if (selectedFilters.showUntagged) {
            return (!transaction.tags || transaction.tags.length === 0) && 
                   amount >= minAmount && amount <= maxAmount;
        }

        return amount >= minAmount && amount <= maxAmount;
    });

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedTransactions(filteredTransactions.map(t => t.id));
        } else {
            setSelectedTransactions([]);
        }
    };

    const handleSelectTransaction = (id: string) => {
        setSelectedTransactions(prev => 
            prev.includes(id) 
                ? prev.filter(tId => tId !== id)
                : [...prev, id]
        );
    };

    const handleAddBulkTag = (tag: string) => {
        const updatedTransactions = transactions.map(transaction => {
            if (selectedTransactions.includes(transaction.id)) {
                const oldTags = transaction.tags || [];
                return {
                    ...transaction,
                    tags: [...new Set([...oldTags, tag])]
                };
            }
            return transaction;
        });
        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
        setShowTagModal(false);
        setSelectedTransactions([]);
    };

    const SearchFilters = () => (
        <div className="bg-white border rounded-lg p-4 mt-2 shadow-lg">
            <h3 className="font-medium mb-4">Filters</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Date Range</label>
                    <select
                        className="w-full p-2 border rounded-md"
                        value={selectedFilters.dateRange}
                        onChange={e => setSelectedFilters({ ...selectedFilters, dateRange: e.target.value })}
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Min Amount</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-md"
                            placeholder="0"
                            value={selectedFilters.minAmount}
                            onChange={e => setSelectedFilters({ ...selectedFilters, minAmount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Max Amount</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-md"
                            placeholder="999999"
                            value={selectedFilters.maxAmount}
                            onChange={e => setSelectedFilters({ ...selectedFilters, maxAmount: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {['Groceries', 'Entertainment', 'Utilities', 'Dining', 'Health', 'Transportation', 'Education'].map(tag => (
                            <button
                                key={tag}
                                className={`px-3 py-1 rounded-full text-sm ${selectedFilters.tags.includes(tag)
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                onClick={() => {
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        tags: prev.tags.includes(tag)
                                            ? prev.tags.filter(t => t !== tag)
                                            : [...prev.tags, tag]
                                    }));
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedFilters.showUntagged}
                            onChange={e => setSelectedFilters(prev => ({
                                ...prev,
                                showUntagged: e.target.checked
                            }))}
                            className="rounded"
                        />
                        <span className="text-sm text-gray-600">Show only untagged transactions</span>
                    </label>
                </div>
            </div>
        </div>
    );


    return (
        <div className="max-w-6xl mx-auto p-6">
            <Header />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Transaction List</h1>
                {selectedTransactions.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowTagModal(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Tag to Selected ({selectedTransactions.length})
                        </button>
                    </div>
                )}
            </div>

            {showTagModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Select Tags</h2>
                            <button
                                onClick={() => setShowTagModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {Tags.map(({ label, icon }) => (
                                <button
                                    key={label}
                                    onClick={() => {
                                        handleAddBulkTag(label);
                                        setShowTagModal(false);
                                    }}
                                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-2xl">{icon}</span>
                                    <span className="text-gray-700">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-10 py-2 border rounded-lg"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${showFilters ? 'bg-green-50 border-green-600 text-green-600' : 'text-gray-600'
                            }`}
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                        {(selectedFilters.minAmount || selectedFilters.maxAmount || selectedFilters.tags.length > 0) && (
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        )}
                    </button>
                </div>

                {showFilters && <SearchFilters />}
            </div>


            <div className="border rounded-lg overflow-hidden">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-12 px-6 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedTransactions.length === filteredTransactions.length}
                                    onChange={handleSelectAll}
                                    className="rounded"
                                />
                            </th>
                            {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Transaction ID</th> */}
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Tags</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Suggested Tags</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">...</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedTransactions.includes(transaction.id)}
                                        onChange={() => handleSelectTransaction(transaction.id)}
                                        className="rounded"
                                    />
                                </td>
                                {/* <td className="px-6 py-4 text-sm text-gray-900">{transaction.id}</td> */}
                                <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">${transaction.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <button className="flex">
                                        {transaction.date}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    {
                                        transaction.tags && transaction.tags.length > 0 ?
                                            transaction.tags.map((tag) => (
                                                <span key={tag} className={`text-sm font-medium ${getTagColor(tag)}`}>
                                                    {tag}
                                                </span>
                                            )) :
                                            <span className="text-sm font-medium text-gray-600">No tags</span>
                                    }
                                    <button className="px-4 py-1"><Plus className="w-4 h-4" /></button>
                                </td>
                                <td className="px-6 py-4">
                                    {
                                        transaction.suggestedTags && transaction.suggestedTags.length > 0 ?
                                            [...transaction.suggestedTags.map((tag) => (
                                                <span key={tag} className={`rounded-full bg-gray-100 text-sm font-medium ${getTagColor(tag)}`}>
                                                    {tag}
                                                </span>
                                            )), <button key="check" className="px-4 py-1"><Check className="w-4 h-4" /></button>] :
                                            <span className="text-sm font-medium text-gray-600">No suggested tags</span>
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEditTransaction(transaction.id)}
                                        className="px-1 py-1"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTransaction(transaction.id)}
                                        className="px-1 py-1"
                                    >
                                        <Trash className="w-4 h-4" />
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