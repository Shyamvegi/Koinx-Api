import express from "express";
import mongoose from 'mongoose';
import routes from './controller/routes.js';
import dotenv from 'dotenv';

dotenv.config();
//Connect to mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dt4pg.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
 })
.then(()=>console.log('db connected'))
.catch(err=>console.log(err));

const app = express();
app.use('/',routes);
app.use(express.json());
//start server
app.listen(3000, () => console.log('Server running at http://localhost:3000'))