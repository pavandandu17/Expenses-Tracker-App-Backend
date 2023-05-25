const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors({
    origin: ['https://etrackerapp.netlify.app', 'http://127.0.0.1:5500', 'http://localhost:3000']
}));
const AppData = require("./models/AppData");
const User = require("./models/user");

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

//To serve static files from public directory
app.use(express.static('public'));

//Routes
app.get('/', (req, res) => {
    res.sendFile('login/login.html', { root: __dirname + '/public' });
});

app.post('/login', (req, res) => {

});

app.post('/register',(req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(async (existingUser) => {
            if(existingUser) {
                res.send("USER ALREADY EXISTS");
            }

            const newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            };

            await newUser.save();
            res.redirect('/');
        })
        .catch((error) => {
            console.log(error);
            // res.status(500).json({message: 'Internal Server Error'});
        });
});

app.get('/home', (req, res) => {
    res.sendFile('home/index.html', { root: __dirname + '/public' });
});

app.get("/deleteAll", async (req, res) => {
    await AppData.deleteMany();
    res.send({});
});

app.post("/getExpenses", async (req, res) => {
    // console.log(req.ye/);
    const datatoFilter = req.body;
    const filteredData = await AppData.find(datatoFilter).sort({year:1, month:1, date:1});
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
    res.send({});
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

app.delete('/delete', (req, res) => {
    const expenseID = req.body.expenseID;
    console.log(expenseID);
    res.sendStatus(200);
})

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
