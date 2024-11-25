// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const path = require('path');


// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
// app.engine('html', require('ejs').renderFile);


// mongoose.connect('process.env.MONGODB_URI', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));



// const UserSchema = new mongoose.Schema({
//     Email: {
//         type: String,
//         required: [true, 'Email is required'],
//         // // unique: true,
//         // trim: true,
//         // // lowercase: true,
//         // validate: {
//         //     validator: function (email) {
//         //         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//         //     },
//         //     message: props => `${props.value} is not a valid email address!`,
//         // },
//     },
// });
// const User = mongoose.model('User', UserSchema);


// app.get('/', (req, res) => {
//     res.render('listing.ejs');
// });

// app.post('/listing', async (req, res) => {
//     try {
//         const { Email } = req.body;
//         console.log('Received email:', Email);

//         const user = new User({ Email });
//         await user.save();

//         console.log('User saved successfully:', user);
//         res.render('thankyou.ejs');
//     } catch (err) {
//         console.error('Error during save:', err.message);
//         res.status(500).send('Error saving data to the database.');
//     }
// });



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });





const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB Connection
const dbURI = process.env.MONGODB_URI; // Use the environment variable for MongoDB URI
if (!dbURI) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1); // Exit the application if the URI is missing
}

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit the application on connection failure
    });

// Mongoose Schema and Model
const UserSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
});

const User = mongoose.model('User', UserSchema);

// Routes
app.get('/', (req, res) => {
    res.render('listing');
});

app.post('/listing', async (req, res) => {
    try {
        const { Email } = req.body;
        console.log('Received email:', Email);

        if (!Email) {
            return res.status(400).send('Email is required.');
        }

        const user = new User({ Email });
        await user.save();

        console.log('User saved successfully:', user);
        res.render('thankyou');
    } catch (err) {
        console.error('Error during save:', err.message);
        res.status(500).send('Error saving data to the database.');
    }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

