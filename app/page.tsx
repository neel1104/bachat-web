'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Trash } from 'lucide-react';
import Header from './components/header';
interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  category: string;
  description: string;
}

const Home = () => {
  const router = useRouter();
  const [csvData, setCsvData] = useState('');
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<{ [key: string]: number }>({});
  const transactionAttributes = ["id", "date", "amount", "type", "category", "description"];

  const handleDataPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvData(e.target.value);
  };

  const handleParseData = () => {
    const separator = csvData.includes('\t') ? '\t' : ',';
    const rows = csvData.split('\n').map(row => row.split(separator).map(col => col.trim().replace(/^"|"$/g, '')));
    setRows(rows);
  };

  const handleRemoveTransaction = (idx: number) => {
    const newRows = [...rows];
    newRows.splice(idx + 1, 1);
    setRows(newRows);
  };

  const handleImportTransactions = () => {
    const transactions: Transaction[] = [];
    for (const transaction of previewTransactions) {
      const newTransaction = {
        id: transaction.id,
        date: transaction.date,
        amount: Number(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        description: transaction.description
      }
      transactions.push(newTransaction);
    }
    // save transactions to local storage
    localStorage.setItem("transactions", JSON.stringify(transactions));
    // redirect to transactions page
    router.push("/transactions");
  };

  const previewTransactions: { [key: string]: string }[] = [];
  if (Object.keys(mapping).length > 0) {
    for (const row of rows.slice(1)) {
      const previewTransaction: { [key: string]: string } = {};
      for (const attr of transactionAttributes) {
        previewTransaction[attr] = row[mapping[attr]];
      }
      previewTransactions.push(previewTransaction);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header />

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Input Area</h2>
        <p className="text-gray-600 mb-4">
          Please paste your CSV or TSV data below. Ensure the data is properly formatted for accurate parsing.
        </p>
        <textarea
          className="w-full h-40 p-4 border rounded-md mb-4"
          placeholder="Paste your data here..."
          value={csvData}
          onChange={handleDataPaste}
        />
        <button
          onClick={handleParseData}
          className="px-4 py-2 bg-green-600 text-white rounded-md float-right"
        >
          Parse Data
        </button>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-semibold mb-4">Map Columns to Transaction</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                {transactionAttributes.map((attr) => (
                  <th key={attr} className="py-3 basis-0 text-left text-sm font-medium text-gray-600">
                    {attr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                {
                  rows.length > 0 ?
                    transactionAttributes.map((attr) => (
                      <td key={attr}>
                        <select onChange={(e) => setMapping({ ...mapping, [attr]: parseInt(e.target.value) })}>
                          {
                            ["-", ...rows[0]].map((col, idx) => (
                              <option key={idx} value={idx - 1} >{col}</option>
                            ))
                          }
                        </select>
                      </td>
                    ))
                    :
                    <td colSpan={6} className="text-center">Paste your transaction data to get started</td>
                }
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                {transactionAttributes.map((attr) => (
                  <th key={attr} className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    {attr}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {
                previewTransactions.length > 0 ?
                  previewTransactions.map((transaction, idx) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleRemoveTransaction(idx)}>
                          <Trash className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan={6} className="text-center">Select columns to map to transaction attributes to see preview</td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md" onClick={handleImportTransactions}>
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;