const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
const AppData = require("./models/AppData");

//Connecting DB
const DBLink = 'mongodb+srv://pavandandu17:trhtvgsdp@cluster0.xjicp93.mongodb.net/expensestrackerapp?retryWrites=true&w=majority';
mongoose.connect(DBLink, {
    useNewUrlParser: true,
}).then(() => {
    console.log("DB Connected Successfully");
}).catch((err) => console.log(err));

//to allow Access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//to parse req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res) => {
    res.send("Hello");
})

app.get("/deleteAll", async (req, res) => {
    await AppData.deleteMany();
    res.send({});
});

app.post("/getExpenses", async (req, res) => {
    // console.log(req.ye/);
    const datatoFilter = req.body;
    const filteredData = await AppData.find(datatoFilter);
    res.send(filteredData);
    //    console.log(filteredData);

})

app.post("/getAmount", async (req, res) => {
    const records = await AppData.find(req.body);
    const Amount = calculate(records);
    res.send({ data: Amount });
});

app.post('/addExpense', async (req, res) => {
    const dataToAdd = req.body;
    const data = new AppData(dataToAdd);
    const x = await data.save();
});

app.post('/getBarChartData', async (req, res) => {
    AppData.aggregate([
        {
            $match: {
                year: req.body.year,
                month: req.body.month
            }
        },
        {
            $group: {
                _id: { year: "$year", month: "$month", date: "$date" },
                totalExpenses: { $sum: "$expenseAmount" }
            }
        }
    ])
        .then((results) => {
            res.json(results);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'An error occured' });
        });
});

app.post('/getPieChartData', async (req, res) => {
    AppData.aggregate([
        {
            $match: {
                year: req.body.year,
                month: req.body.month,
            },
        },
        {
            $group: {
                _id: '$expenseType',
                totalExpenseAmount: { $sum: '$expenseAmount' },
            },
        },
    ])
        .then(results => {
            console.log(results);
            res.json(results);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occured' });
        })
});


function calculate(Array) {
    let amount = 0;
    for (let i of Array) {
        amount += i.expenseAmount;
    }
    return amount;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Running Server on ${PORT}`);
});
