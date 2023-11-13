import mongoose, { mongo } from "mongoose";
require('dotenv').config();
const Connection=()=>{
    const URL='mongodb://0.0.0.0:27017/SudokuDb?directConnection=true';
    try{
        mongoose.connect(URL);
        console.log("Database connected successfully");
    }
    catch(error){
     console.log('Error while connecting the database:',error);
    }
}
export default Connection;