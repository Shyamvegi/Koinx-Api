## Backend Assignment

Here is live link https://koinx-api-v1/herokuapp.com

Tech Used : Javascript Node.js,Express.js,MongoDB
Deployed Using : Heroku

api endpoints : 

/getTransactions : 
request Type : GET
parameters required useraddress

https://koinx-api-v1/getTransactions/?&address=<address>

It fetches list pf all the transactions of the user provided with address.


/getbalance :
Request Type : GET
parameters required useraddress

https://koinx-api-v1/getBalance/?&adddress=<address>

It fetches the balacne of user using the transactions fetched before which were stored in MongoDB Atlas.
