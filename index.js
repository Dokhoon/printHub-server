const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://printhub-client.onrender.com" // your frontend URL
    ],
    credentials: true
  })
);
app.use(express.json());

// MongoDB Connectionk
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));
app.use("/api/orders", require("./routes/orderRoutes"));



// Example route
app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
