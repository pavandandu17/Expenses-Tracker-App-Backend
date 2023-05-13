const mongoose = require("mongoose");


const today = new Date();

const AppSchema = new mongoose.Schema({
  year: {
    type: Number,
    require: true,
    max: today.getFullYear(),
  },
  month: {
    type: Number,
    require: true,
    min: 1,
    max: 12,
  },
  date: {
    type: Number,
    require: true,
    min: 1,
    max: (new Date(today.getFullYear(), today.getMonth(), 0)).getDate(),
  },
  expenseType: {
    type: Number,
    require: true,
  },
  expenseDescription: {
    type: String,
  },
  expenseAmount: {
    type: Number,
  }
});

const ExpenseSchema = mongoose.model('expensesData', AppSchema);

module.exports = ExpenseSchema;
