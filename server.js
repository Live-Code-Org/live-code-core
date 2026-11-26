require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());


// app.get('/', (req, res) =>{
//     res.status(200).json({
//         status: 'API is running',
//         project: 'TeeCode Open Core'
//     });
// });

app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000 ;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
});