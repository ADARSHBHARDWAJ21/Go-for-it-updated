import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  PieChart,
  TrendingUp,
  CreditCard,
  Plane,
  Hotel,
  Car,
  MapPin,
  Plus,
  Target,
  AlertTriangle,
  Utensils,
  ShoppingCart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

// Helper to get data from localStorage
const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

const Budget = () => {
    // --- STATE MANAGEMENT ---
    const [trips, setTrips] = useLocalStorage('userTrips', [
        { id: 'paris', name: 'Udaipur Vibe', budget: 3500 },
        { id: 'tokyo', name: 'Goa Explorer', budget: 4200 }
    ]);
    const [expenses, setExpenses] = useLocalStorage('userExpenses', {
        paris: [
            { id: 1, date: '2024-12-20', description: 'Hotel Rassionance', amount: 280, category: 'Accommodation' },
            { id: 2, date: '2024-12-19', description: 'Hotel Lake Pichola', amount: 85, category: 'Food' },
            // Added more data to show the over-budget case accurately
            { id: 4, date: '2024-12-20', description: 'Lavish Dinner', amount: 4500, category: 'Food' },
        ],
        tokyo: [
             { id: 3, date: '2024-12-15', description: 'Travel Insurance', amount: 150, category: 'Activities' }
        ]
    });

    const [selectedTrip, setSelectedTrip] = useState(trips[0]?.id || '');
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Food' });
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    // --- DERIVED STATE & MEMOS ---
    const currentTrip = useMemo(() => trips.find(t => t.id === selectedTrip), [trips, selectedTrip]);
    const currentExpenses = useMemo(() => expenses[selectedTrip] || [], [expenses, selectedTrip]);

    const totalSpent = useMemo(() => 
        currentExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0), 
    [currentExpenses]);
    
    const remainingBudget = (currentTrip?.budget || 0) - totalSpent;
    const spentPercentage = currentTrip?.budget ? (totalSpent / currentTrip.budget) * 100 : 0;

    // We define a mock budget per category for more accurate progress bars
    const categoryBudgets = useMemo(() => ({
        paris: { Flights: 1200, Accommodation: 1400, Transportation: 300, Activities: 400, Food: 200, Shopping: 150 },
        tokyo: { Flights: 1500, Accommodation: 1800, Transportation: 400, Activities: 300, Food: 200, Shopping: 200 }
    }[selectedTrip] || {}), [selectedTrip]);

    const categoryBreakdown = useMemo(() => {
        const categories = [
            { name: 'Flights', icon: Plane, color: 'blue' },
            { name: 'Accommodation', icon: Hotel, color: 'teal' },
            { name: 'Transportation', icon: Car, color: 'orange' },
            { name: 'Activities', icon: MapPin, color: 'green' },
            { name: 'Food', icon: Utensils, color: 'purple' },
            { name: 'Shopping', icon: ShoppingCart, color: 'pink' }
        ];

        return categories.map(cat => {
            const spent = currentExpenses
                .filter(e => e.category === cat.name)
                .reduce((sum, e) => sum + Number(e.amount), 0);
            const budgeted = categoryBudgets[cat.name] || 0; // Use the mock budget for the category
            const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
            return { ...cat, spent, budgeted, percentage };
        });
    }, [currentExpenses, categoryBudgets]);

    // --- FUNCTIONS ---
    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!newExpense.description || !newExpense.amount) return;

        const newExpenseEntry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...newExpense,
            amount: parseFloat(newExpense.amount)
        };
        
        setExpenses(prev => ({
            ...prev,
            [selectedTrip]: [...(prev[selectedTrip] || []), newExpenseEntry]
        }));
        
        setNewExpense({ description: '', amount: '', category: 'Food' });
        setIsAddExpenseOpen(false);
    };

    const getColorClasses = (color) => {
        const colors = {
          blue: { bg: 'from-blue-600 to-blue-700', text: 'text-blue-400', progress: 'bg-blue-500' },
          teal: { bg: 'from-teal-600 to-teal-700', text: 'text-teal-400', progress: 'bg-teal-500' },
          orange: { bg: 'from-orange-600 to-orange-700', text: 'text-orange-400', progress: 'bg-orange-500' },
          green: { bg: 'from-green-600 to-green-700', text: 'text-green-400', progress: 'bg-green-500' },
          purple: { bg: 'from-purple-600 to-purple-700', text: 'text-purple-400', progress: 'bg-purple-500' },
          pink: { bg: 'from-pink-600 to-pink-700', text: 'text-pink-400', progress: 'bg-pink-500' }
        };
        return colors[color] || colors.blue;
    };

    if (!currentTrip) {
        return <div className="bg-gray-900 text-center text-red-400 p-8">No trips found. Please add a trip to start tracking your budget.</div>;
    }

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-8 text-gray-100">
      
      {/* Header and Add Expense Dialog */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Budget Tracker</h1>
          <p className="text-gray-400 mt-1">Real-time expense tracking for your adventures</p>
        </div>
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-teal-500 text-gray-900 font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-black/30">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Expense</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                        Log a new expense for your trip to {currentTrip.name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddExpense} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="col-span-3" placeholder="e.g., Dinner at a cafe" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount (₹)</Label>
                        <Input id="amount" type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="col-span-3" placeholder="e.g., 1500" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select value={newExpense.category} onValueChange={value => setNewExpense({...newExpense, category: value})}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryBreakdown.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Expense</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      {/* Trip Selector */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calculator className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-300">Select Trip:</span>
            <div className="flex space-x-2">
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border ${
                    selectedTrip === trip.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-700 text-gray-300 border-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {trip.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          {/* Budget Overview Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${Math.min(spentPercentage, 100) * 3.51} 351`}
                    className={spentPercentage > 100 ? 'text-red-500' : spentPercentage > 80 ? 'text-yellow-500' : 'text-green-500'}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{spentPercentage.toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">Used</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-400">Total Budget</p>
                  <p className="text-xl font-bold text-white">₹{currentTrip.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Spent</p>
                  <p className="text-lg font-semibold text-gray-300">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Remaining</p>
                  <p className={`text-lg font-semibold ${remainingBudget < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  ₹{remainingBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Budget Breakdown</h2>
            <div className="space-y-4">
              {categoryBreakdown.map((category, index) => {
                const Icon = category.icon;
                const colors = getColorClasses(category.color);
                const isOverBudget = category.percentage > 100;
                
                return (
                  <div key={index} className="p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${colors.bg} rounded-lg flex items-center justify-center shadow-md`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{category.name}</h3>
                          <p className="text-sm text-gray-400">
                          ₹{category.spent.toLocaleString()} / ₹{category.budgeted.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isOverBudget && <AlertTriangle className="w-4 h-4 text-red-400" />}
                        <span className={`text-sm font-medium ${isOverBudget ? 'text-red-400' : colors.text}`}>
                          {category.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* --- FIX IS HERE --- */}
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isOverBudget ? 'bg-red-500' : colors.progress
                        }`}
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenses and Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Expenses</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {currentExpenses.length > 0 ? (
                currentExpenses
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-700/50 hover:bg-gray-700 transition-colors">
                <div>
                  <p className="font-medium text-white">{expense.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{expense.date}</span>
                    <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
                      {expense.category}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-red-400">- ₹{expense.amount.toLocaleString()}</span>
              </div>
            ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No expenses logged for this trip yet.</p>
                </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-teal-700 to-green-700 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold">Smart Budget Tips</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h3 className="font-medium mb-2">💡 Optimize Spending</h3>
              <p className="text-sm opacity-90">
                You're **{spentPercentage > 70 ? 'approaching' : 'within'}** your budget limits. 
                Consider booking activities in advance for better rates.
              </p>
            </div>
            <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h3 className="font-medium mb-2">🎯 Category Alert</h3>
              <p className="text-sm opacity-90">
                Track where your money goes. If one category like 'Food' is high, consider more budget-friendly dining options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;