'use client';
import { useState } from "react";

export default function Home() {
  
  const [step, setStep] = useState(1);
  const [finalTransactions, setFinalTransactions] = useState<Record<string, string>[]>([]);
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="w-full max-w-3xl p-8 bg-white shadow-xl rounded-2xl border border-blue-400">
        {step === 1 ? <InlineInput setRows={setRows} setStep={setStep} setHeaderRowColumns={setHeaderRowColumns} /> : step === 2 ? (
          
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">Final Transactions</h1>
            <div className="border rounded-md overflow-auto max-h-80 mb-4">
              <table className="w-full border-collapse text-left">
                <thead className="bg-blue-200">
                  <tr>
                    {Object.keys(mapping).map((field, i) => (
                      <th key={i} className="p-2 border">{field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {finalTransactions.map((transaction, i) => (
                    <tr key={i} className="odd:bg-blue-50 even:bg-white">
                      {Object.keys(mapping).map((field, j) => (
                        <td key={j} className="p-2 border">{transaction[field]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InlineInput({ setRows, setStep, setHeaderRowColumns }: { setRows: (rows: string[][]) => void, setStep: (step: number) => void, setHeaderRowColumns: (columns: string[]) => void }) {
  const [input, setInput] = useState('');

  const handleProceed = () => {
    if (input.trim()) {
      const lines = input.split("\n");
      const headerRow = lines[0];
      const separator = headerRow.includes(",") ? "," : "\t";
      setHeaderRowColumns(headerRow.split(separator).map(col => col.trim()).map(col => col.replace(/['"]/g, '')));
      setRows(lines.slice(1).map(line => line.split(separator).map(col => col.trim()).map(col => col.replace(/['"]/g, ''))));
      setStep(2);
    } else {
      alert("Please enter some expenses before proceeding.");
    }
  };

  return <>
    <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">Bulk Expense Entry</h1>
    <p className="text-blue-700 text-center mb-4">Easily input your expenses in bulk and keep track of your finances.</p>
    <textarea
      className="w-full p-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-blue-900 bg-blue-50"
      rows={6}
      placeholder="Enter expenses, e.g., Groceries 50.50\nCoffee 3.99"
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <button
      className="mt-6 w-full px-5 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300"
      onClick={handleProceed}
    >
      Proceed
    </button>
  </>
}


function MappingInput({ headerRowColumns, rows, setStep }: { headerRowColumns: string[], rows: string[][], setMapping: (mapping: Record<string, string>) => void, setStep: (step: number) => void }) {
  const [input, setInput] = useState('');
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleProceed = () => {
    const mapping = input.split("\n").map(line => line.split(/\s+/).map(col => col.trim()));
  }



  const handleMappingChange = (attribute: string, value: string) => {
    setMapping(prev => ({ ...prev, [attribute]: value }));
  };

  const handleConfirmMapping = () => {
    const mappedTransactions = rows.map(row => {
      let transaction: Record<string, string> = {};
      Object.keys(mapping).forEach(field => {
        const columnIndex = headerRowColumns.indexOf(mapping[field]);
        if (columnIndex !== -1) {
          transaction[field] = row[columnIndex] || "";
        }
      });
      return transaction;
    });
    setFinalTransactions(mappedTransactions);
    setStep(3);
  };

  return <>
  <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">Preview & Map Expenses</h1>
  <p className="text-blue-700 text-center mb-4">Map the columns to transaction fields.</p>
  <div className="border rounded-md overflow-auto max-h-80 mb-4">
    <table className="w-full border-collapse text-left">
      <thead className="bg-blue-200">
        <tr>
          {headerRowColumns.map((col, i) => (
            <th key={i} className="p-2 border">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="odd:bg-blue-50 even:bg-white">
            {row.map((cell, j) => (
              <td key={j} className="p-2 border">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-blue-800 mb-2">Column Mapping</h2>
    {['id', 'date', 'amount', 'description', 'currency'].map(field => (
      <div key={field} className="mb-2 flex justify-between items-center">
        <label className="text-blue-700 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
        <select
          className="border p-2 rounded-md bg-blue-50"
          onChange={(e) => handleMappingChange(field, e.target.value)}
        >
          <option value="">Select column</option>
          {headerRowColumns.map((col, i) => (
            <option key={i} value={col}>{col}</option>
          ))}
        </select>
      </div>
    ))}
  </div>
  <button
    className="w-full px-5 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300"
    onClick={handleConfirmMapping}
  >
    Confirm Mapping
  </button>
</>
}
