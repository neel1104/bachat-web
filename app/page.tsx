'use client';
import { useState, useEffect } from "react";
import { parseTransactionsWithLLM } from './services/llm';

interface Transaction {
  description: string;
  amount: number;
  date?: string;
  id?: string;
  currency?: string;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [transactions, setTransactions] = useState<string[][]>([]);
  const [headerRowColumns, setHeaderRowColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const handleSubmit = async () => {
    try {
      // input contains content in the csv format
      const headerRow = input.split('\n')[0];
      const keyValueSeparator = headerRow.includes(',') ? ',' : '\t';
      const headerRowColumns = headerRow.split(keyValueSeparator).map(col => col.trim()).map(col => col.replace(/^"|"$/g, ''));
      setHeaderRowColumns(headerRowColumns);
      const rows = input.split('\n').slice(1);
      const newTransactions = rows.map(row => {
        return row.split(keyValueSeparator).map(col => col.trim()).map(col => col.replace(/^"|"$/g, ''));
      });
      const updatedTransactions = [...transactions, ...newTransactions];
      setTransactions(updatedTransactions);
      // localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setInput(''); // Clear input after successful parsing
    } catch (error) {
      alert('Error parsing transactions. Please check your input format.');
    }
  };

  const handleMappingChange = (attribute: string, value: string) => {
    setMapping(prev => ({ ...prev, [attribute]: value }));
  };

  const isColumnMapped = (col: string) => Object.values(mapping).includes(col);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Budget Planner</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-2">
              Enter transactions (in csv or tsv format)
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // placeholder="Groceries 50.50&#10;Coffee 3.99"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Transactions
          </button>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Mapping</h2>
            <div className="border rounded-md divide-y">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th>Transaction Attributes</th>
                    <th>Column name from input data</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { field: 'id', label: 'ID' },
                    { field: 'date', label: 'Date' },
                    { field: 'amount', label: 'Amount' },
                    { field: 'description', label: 'Description' },
                    { field: 'currency', label: 'Currency' },
                  ].map(({ field, label }) => (
                    <tr key={field}>
                      <td>{label}</td>
                      <td>
                        <select
                          onChange={(e) => handleMappingChange(field, e.target.value)}
                        >
                          {["-", ...headerRowColumns].map((col, i) => (
                            <option key={i}>{col}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold"></h2>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              {previewMode ? (
                <>
                  <span>Show All Columns</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Preview Mapped Columns</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Transactions</h2>
            <div className="divide-y">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    {headerRowColumns.map((col, i) => (
                      !previewMode || isColumnMapped(col) ? (
                        <th 
                          key={i} 
                          className={`p-2 ${isColumnMapped(col) ? 'bg-green-100 dark:bg-green-900' : ''}`}
                        >
                          {col}
                        </th>
                      ) : null
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        !previewMode || isColumnMapped(headerRowColumns[j]) ? (
                          <td 
                            key={j} 
                            className={`p-2 ${isColumnMapped(headerRowColumns[j]) ? 'bg-green-50 dark:bg-green-950' : ''}`}
                          >
                            {cell}
                          </td>
                        ) : null
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
