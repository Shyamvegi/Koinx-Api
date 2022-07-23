import mongoose from "mongoose";
const { Schema, model } = mongoose;

const usersModel = model("user",new Schema({
    address: { type: String, required: true },
    transactions: [],
}));

const coinsModel = model("coin",new Schema({
    currentPrice: { type: String, default: 0 }
}));

export {usersModel,coinsModel}