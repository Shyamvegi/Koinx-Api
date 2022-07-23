import fetch from "node-fetch";
import { usersModel, coinsModel } from "../models/schemas.js"
import dotenv from 'dotenv';
dotenv.config();

const api_key = process.env.API_KEY;
/*
    Task-1 : getTransactions
    It fetches transactions from users address passed through url.
    Once Data fetched Successfully data gets stored into database. 
*/
const getTransactions = async (req, res) => {
    const userAddress = req.query.address;
    if(!userAddress || userAddress==='')return renderError("Enter User Address");
    const response = await fetchTransactions(userAddress);
    if (response[1] === 1) return renderError(res,response[2]);
    //Store
    const dbresponse = storeTransactions(userAddress, response[0].result);
    if (dbresponse[1] === 1)  return renderError(dbresponse[2]); 
    res.status(200).json({
        "message": "Transactions Data",
        "transactions": response[0]
    }).end();
}

// Fetch
const fetchTransactions = async (userAddress) => {
    let url = `https://api.etherscan.io/api?&module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${api_key}`;
    const response = await fetch(url)
        .then(res => res.json())
        .then((data) => {
            if (data.status === '0') return [{}, 1, "Invalid User Address"];
            return [data, 0, ''];
        })
        .catch((err) => {
    
            return [, 1, err];
        });
    return response;
}

//Store
const storeTransactions = async (userAddress, transactions) => {
    try {
        const userData = await usersModel.findOneAndUpdate({ "address": userAddress }, { "transactions": transactions });  
        if (!userData || userData.length === 0) {
            const user = await usersModel.create({
                "address": userAddress,
                "transactions": transactions,
            });
            user.save();
        }
        return [, 0,]
    }
    catch (err) {
        console.log(err);
        return [, 1, err];
    }
}
const renderError = (res, errdata) => {
    return res.status(500).json({
        "status": "NotOK",
        "message": errdata,
    }).end();
}

/*
    Task-2 : asynchronus Task
    Using Api https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr
    It fetches Price of Ethereum for every 10 Minutes
    Once Data fetched Successfully data gets updated into database. 
*/
setInterval(async () => {
    await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr")
        .then(res => res.json())
        .then(async data => {
            const newdata = { "currentPrice": data.ethereum.inr };
            const coinData = await coinsModel.findOneAndUpdate({}, newdata);
            if (!coinData) {
                const coin = await coinsModel.create({ newdata })
            }
        })
        .catch(err => console.log(err));
}, 4000);


/*
    Task 3 : getBalance
    It fetches the balance of User and Shows the current Price of the Ethereum
    requires Users Address inorder to fetch the data from database to calculate balance.
*/
const getBalance = async (req, res) => {
    try {
        const userAddress = req.query.address;
        if(!userAddress || userAddress===''){
            return renderError(res,'Invalid Address');
        }
        var userData = await usersModel.findOne({ "address": userAddress });   
        //if user tries to fetch balance before fetching transactions
        if (!userData || userData.length === 0) {

            const response = await fetchTransactions(userAddress);
            if (response[1]) return renderError(res, response[2]);
            const dbResponse = await storeTransactions(userAddress, response[0].result);
            if (dbResponse[1])  return renderError(res, dbResponse[2]);

            userData = await usersModel.findOne({ "address": userAddress });
        }

        //Find Balance 
        var balance = 0;
        userData.transactions.forEach(transaction => balance += parseFloat(transaction.value) * ((transaction.from === userAddress) ? -1 : 1));

        const coinData = await coinsModel.find();
        const curPrice = parseFloat(coinData[0].currentPrice)
        let data = {
            "status": "OK",
            "balance": {
                "wei": balance,
                "ETH": balance / 1000000000000000000,
                "inr": (balance / 1000000000000000000) * (balance * curPrice),
            },
            "currentPrice": `${curPrice} inr`,
        }
        res.status(200).json(data).end();
    }
    catch (err) {
        console.log(err);
        return renderError(res,"Internal Error");
    }
}
/*
    Home Where we can see list of api endpoints
*/
const home = (req, res) => {
    const info = `<div style="
        margin:50px 50px;
        padding:50px 50px;
        border:20px solid Red;
        border-radius:20px;
        color:white;
        background-color:black;
        "
    >
        <h1>Koinx Api</h1>
        <p>Use below routes <br/>
        where userAddress is <strong>0xce94e5621a5f7068253c42558c147480f38b5e0d</strong></p>
        <ul>
            <li>getTransactions/?&address=useraddress</li>
            <li>getBalance/?&address=useraddress</li>
        </ul>


        <h5 >Try this</h5>
        <a  style={color:red} href="https://koinx-api-v1/getTransactions/?&address=0x642ae78fafbb8032da552d619ad43f1d81e4dd7c">getTransactions</a>
        <a style={color:red} href="https://koinx-api-v1/getBalance/?&address=0x642ae78fafbb8032da552d619ad43f1d81e4dd7c">getBalance</a>
    </div>`;

    res.send(info);
}

const exitHandler = (req, res) => {
    res.redirect('/');
}
export { getBalance, getTransactions, exitHandler, home };