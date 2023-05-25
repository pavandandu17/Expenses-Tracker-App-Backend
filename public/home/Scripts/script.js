const localStorageKey = 'expensesTrackerAppData';
const expenseTypes = ['Food', 'Petrol/Gas', 'Entertainment', 'Fitness/Gym', 'Transport', 'Taxes', 'Investment', 'Shopping', 'Groceries', 'Bills', 'Books', 'Rent', 'EMI', 'Others'];
let today = new Date();

window.onload = showTodayMonthExpense;

async function sendData(data) {
    const res = await axios.post('https://expenses-tracker-app-backend.onrender.com/addExpense', data);
    console.log(res);
}

async function getExpenses(data) {
    const response = await axios.post('https://expenses-tracker-app-backend.onrender.com/getExpenses', data);
    return response.data;
}

async function getTotalAmount(data) {
    const response = await axios.post('https://expenses-tracker-app-backend.onrender.com/getAmount', data);
    return response.data;
}

async function showTodayMonthExpense() {
    let todayDisplayElement = document.getElementById('todaysExpense');
    monthDisplayElement = document.getElementById('thisMonthsExpense');

    //Calculating yesterday's date
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let yesterdaysExpense = (await getTotalAmount({
        year: yesterday.getFullYear(),
        month: yesterday.getMonth(),
        date: yesterday.getDate()
    })).data;

    let todaysExpense = (await getTotalAmount({
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate()
    })).data;

    const increaseCharacter = '\u25B2';
    const decreaseCharacter = '\u25BC';

    //Gets an array which contains [percentIncreased, percentChange]
    // let [isExpenseIncreased, percentChange] = getPercentChange(yesterdaysExpense, todaysExpense);

    let datePercentChangeText = null;
    if (todaysExpense == yesterdaysExpense) {

    } else if (todaysExpense > yesterdaysExpense) {
        datePercentChangeText = `${increaseCharacter} ${(todaysExpense - yesterdaysExpense)}/- Rs`;

        const displayEle = document.getElementById('datePercentChange');
        displayEle.style.color = "red";
        displayEle.innerText = datePercentChangeText;
    } else {
        datePercentChangeText = `${decreaseCharacter} ${yesterdaysExpense - todaysExpense}/- Rs`;

        const displayEle = document.getElementById('datePercentChange');
        displayEle.style.color = "green";
        displayEle.innerText = datePercentChangeText;
    }

    const prevMonthDate = (new Date(today.getFullYear(), today.getMonth() - 1));
    let monthsExpense = (await getTotalAmount({
        year: today.getFullYear(),
        month: today.getMonth()
    })).data;

    let prevMonthsExpense = (await getTotalAmount({
        year: prevMonthDate.getFullYear(),
        month: prevMonthDate.getMonth()
    })).data;

    // [isExpenseIncreased, percentChange] = getPercentChange(prevMonthsExpense, monthsExpense);
    datePercentChangeText = null;
    if (monthsExpense == prevMonthsExpense) {

    } else if (monthsExpense > prevMonthsExpense) {
        datePercentChangeText = `${increaseCharacter} ${Math.abs(monthsExpense - prevMonthsExpense)}/- Rs`;

        const displayEle = document.getElementById('monthPercentChange');
        displayEle.style.color = "red";
        displayEle.innerText = datePercentChangeText;
    } else {
        datePercentChangeText = `${decreaseCharacter} ${Math.abs(monthsExpense - prevMonthsExpense)}/- Rs`;

        const displayEle = document.getElementById('monthPercentChange');
        displayEle.style.color = "green";
        displayEle.innerText = datePercentChangeText;
    }

    monthDisplayElement.innerText = monthsExpense + "/- Rs ";
    todayDisplayElement.innerText = todaysExpense + "/- Rs ";
}

async function addExpense() {
    let expenseType = document.getElementById('expenseType').value;
    let expenseDescription = document.getElementById('expenseDescription').value;
    let expenseAmount = Number(document.getElementById('expenseAmount').value);
    let expenseDate = new Date(document.getElementById('expenseDate').value);

    let dataToSend = {
        'expenseType': expenseType,
        'expenseDescription': expenseDescription,
        'expenseAmount': expenseAmount,
        'year': Number(expenseDate.getFullYear()),
        'month': Number(expenseDate.getMonth()),
        'date': Number(expenseDate.getDate())
    }

    sendData(dataToSend);
    showTodayMonthExpense();
}

async function clearData() {
    const x = await axios.get('https://expenses-tracker-app-backend.onrender.com/deleteAll');
    location.reload();
}

function enableMonthDateInputs() {
    const monthInputEle = document.getElementById('month');
    const dateInputEle = document.getElementById('date');
    const submitBtn = document.getElementById('form2SubmitButton');

    monthInputEle.disabled = false;
    dateInputEle.disabled = false;
    submitBtn.disabled = false;
}

function updateDateInput() {
    const yearInputEle = document.getElementById('year');
    const monthInputEle = document.getElementById('month');
    const dateInputEle = document.getElementById('date');

    const year = Number(yearInputEle.value);
    const month = Number(monthInputEle.value);

    const daysInMonth = new Date(year, month, 0).getDate();
    dateInputEle.max = daysInMonth;
}

async function submitForm2() {
    event.preventDefault();

    const yearInputEle = document.getElementById('year');
    const monthInputEle = document.getElementById('month');
    const dateInputEle = document.getElementById('date');

    const year = Number(yearInputEle.value);
    const month = Number(monthInputEle.value);
    const date = Number(dateInputEle.value);

    //If date given, but not month
    if (month == "" && date != "") {
        alert("Year, date select chesthe ae month dhi display cheyyali ra erri na modda");
        return;
    }

    let query = {};
    query.year = year;
    if (month != "")
        query.month = month;
    if (date != "")
        query.date = date;

    var expenses = 0;
    expenses = await getExpenses(query);
    console.log(expenses);

    const tableEle = document.getElementById('displayTable');
    const tHead = tableEle.querySelector('thead');
    tHead.style.display = "table-header-group";
    const tBody = tableEle.querySelector('tbody');
    tBody.innerHTML = '';

    let no = 1;
    for (let expense of expenses) {
        let row = tBody.insertRow();

        row.insertCell().innerText = no++;
        row.insertCell().innerText = getFormattedDate(expense.date, expense.month + 1, expense.year);
        row.insertCell().innerText = getExpenseType(expense.expenseType);
        row.insertCell().innerText = expense.expenseDescription;
        row.insertCell().innerText = expense.expenseAmount;
    }
}

function enableChartMonthInput() {
    const chartMonthInputEle = document.getElementById('chartMonth');
    chartMonthInputEle.disabled = false;
}

function enableChartTypeInput() {
    const chartTypeEle = document.getElementById('chartType');
    chartTypeEle.disabled = false;
}

function displayChart() {
    event.preventDefault();
    const chartType = document.getElementById('chartType').value;
    if (chartType == "bar") {
        const pieChartEle = document.getElementById('pieChart');
        pieChartEle.style.display = "none";
        displayBarChart();
    } else {
        const barChartEle = document.getElementById('barChart');
        barChartEle.style.display = "none";
        displayPieChart();
    }
}
async function displayBarChart() {
    const chartYear = document.getElementById('chartYear').value;
    const chartMonth = document.getElementById('chartMonth').value;
    const daysInMonth = new Date(2023, chartMonth, 0).getDate();

    const barChartEle = document.getElementById('barChart');
    barChartEle.style.display = "block";

    let labels = [];
    for (let i = 1; i <= daysInMonth; i++) {
        labels.push(i)
    }

    let query = {
        year: Number(chartYear),
        month: Number(chartMonth - 1)
    };
    let yValues = [];
    for (let i = 1; i <= daysInMonth; i++) {
        yValues.push(0);
    }

    let dayExpenses = (await axios.post('https://expenses-tracker-app-backend.onrender.com/getBarChartData', query)).data;
    for (let expense of dayExpenses) {
        yValues[expense._id.date] = expense.totalExpenses;
    }

    const barChart = new Chart('barChart', {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: yValues,
                label: 'Expense in Rs.',
                backgroundColor: 'blue',
                hoverBackgroundColor: 'green',
            }]
        },
        options: {}
    });
}

async function displayPieChart() {
    const chartMonth = document.getElementById('chartMonth').value;
    let yValues = [];
    for (let i = 0; i < expenseTypes.length; i++) {
        yValues.push(0);
    }
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f39c12'];
    const chartYear = document.getElementById('chartYear').value;
    let query = {
        year: Number(chartYear),
        month: Number(chartMonth - 1)
    };
    const d = (await axios.post("https://expenses-tracker-app-backend.onrender.com/getPieChartData", query)).data;
    for (let i of d) {
        yValues[i._id] = i.totalExpenseAmount;
    }


    const pieChartEle = document.getElementById('pieChart');
    pieChartEle.style.display = "block";

    new Chart('pieChart', {
        type: "doughnut",
        data: {
            labels: expenseTypes,
            datasets: [{
                data: yValues,
                backgroundColor: colors,
            }]
        },
        options: {
            title: {
                display: true,
                text: "Text to be displayed"
            }
        }
    });
}

function getExpenseType(typeIndex) {
    return expenseTypes[typeIndex];
}

function getFormattedDate(date, month, year) {
    return date + "-" + month + "-" + year;
}

function getPercentChange(yesterdaysExpense, todaysExpense) {
    let isExpenseIncreased = null;
    let percentChange = null;
    if (todaysExpense == 0 && yesterdaysExpense == 0) {
        isExpenseIncreased = null;
        percentChange = 0;
    } else if (todaysExpense == 0) {
        percentChange = yesterdaysExpense;
        isExpenseIncreased = false;
    } else if (yesterdaysExpense == 0) {
        percentChange = todaysExpense;
        isExpenseIncreased = true;
    } else {
        percentChange = (todaysExpense / yesterdaysExpense) * 100;
        if (percentChange < 100) {
            percentChange = 100 - percentChange;
            isExpenseIncreased = false;
        } else {
            isExpenseIncreased = true;
        }
    }

    // console.log(isExpenseIncreased);
    // console.log(percentChange);
    return [isExpenseIncreased, percentChange];
}
