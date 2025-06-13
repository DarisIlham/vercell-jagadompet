import { useState } from "react";

const ExportTodayExpenses = () => {
  const [todayExpenses, setTodayExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to fetch and export today's expenses
  const exportTodayExpenses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      const todayDate = getTodayDate();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      // Fetch today's expenses from database
      const response = await fetch(`${API_BASE_URL}/api/transactions?date=${todayDate}&type=expense`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const expenses = await response.json();
      
      // Filter only today's expenses (additional safety check)
      const todayExpenseData = expenses.filter(expense => {
        const expenseDate = new Date(expense.date).toISOString().split('T')[0];
        return expenseDate === todayDate && expense.type === 'expense';
      });

      setTodayExpenses(todayExpenseData);

      // Generate CSV content
      if (todayExpenseData.length > 0) {
        const headers = ['ID', 'Amount (Rp)', 'Description', 'Category', 'Date'];
        const csvContent = [
          headers.join(','),
          ...todayExpenseData.map(expense => [
            expense.transaction_id || expense.id,
            expense.amount,
            `"${expense.description}"`,
            expense.category,
            expense.date
          ].join(','))
        ].join('\n');

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `today_expenses_${todayDate}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log(`Exported ${todayExpenseData.length} expenses for ${todayDate}`);
      } else {
        setError("No expenses found for today");
      }

    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to export expenses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Export Today's Expenses</h3>
      
      {/* Export Button */}
      <button
        onClick={exportTodayExpenses}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Exporting...' : 'Export Today\'s Expenses'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Success Message */}
      {todayExpenses.length > 0 && !isLoading && !error && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
          Successfully exported {todayExpenses.length} expenses for today ({getTodayDate()})
        </div>
      )}

      {/* Data Preview */}
      {todayExpenses.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Today's Expenses ({todayExpenses.length} transactions):</h4>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            {todayExpenses.map((expense, index) => (
              <div key={expense.transaction_id || index} className="p-2 border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between">
                  <span className="text-sm">{expense.description}</span>
                  <span className="text-sm font-medium">Rp {Number(expense.amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="text-xs text-gray-500 capitalize">{expense.category}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm font-medium">
            Total: Rp {todayExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0).toLocaleString('id-ID')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportTodayExpenses;