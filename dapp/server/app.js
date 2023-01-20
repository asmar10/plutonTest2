const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const Mongoose = require("mongoose")
const abi = require("../contract/abi.json")
const { contract, web3 } = require("../contract/contract.js")
const path = require("path")
require("dotenv").config()

const app = express()

Mongoose.connect("mongodb://0.0.0.0:27017/accountsDB")

app.set('view engine', "ejs")
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }))
app.listen(3000, function () { console.log("server running on port 3000") })

app.get("/", function (req, res) {
    res.render("home", { balance: "" })
})

const accountsSchema = new Mongoose.Schema({
    address: String,
    balance: Number
})

const Account = Mongoose.model("account", accountsSchema)

app.post("/getBalance", async function (req, res) {
    const _account = req.body.account;
    const balanceInWei = await contract.methods.balanceOf(_account).call().catch(err => console.log(err)).then()
    const balance = web3.utils.fromWei(balanceInWei, 'ether')

    Account.findOne({ address: _account }, async (err, response) => {
        if (err) {
            console.log(err);
        }
        else {
            if (response) {
                if (response.balance == balance) {
                    res.render("home", { balance: response.balance })

                }
                else {
                    Account.findOneAndUpdate({ address: _account }, { balance: balance }, { new: true, upsert: true }, (err, response) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (response) {
                                res.render("home", { balance: response.balance });
                            } else {
                                res.render("home", { balance: "null" });
                            }
                        }
                    });
                }
            }
            else {

                if (balance > 0) {
                    Account.findOneAndUpdate({ address: _account }, { balance: balance }, { new: true, upsert: true }, (err, response) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (response) {
                                res.render("home", { balance: response.balance });
                            } else {
                                res.render("home", { balance: "null" });
                            }
                        }
                    });
                }
                else {
                    res.render("home", { balance: "" })
                }
            }
        }
    })
})

app.post("/transferTokens", async function (req, res) {

    const _to = req.body.to;
    const amountInEther = req.body.tokens;
    const amountInWei = web3.utils.toWei(amountInEther, 'Wei');

    Account.findOne({ address: _to }, async function (err, response) {
        if (err) {
            console.log(err)
        }
        else {
            if (response) {
                const currentBalance = response.balance
                const newBalance = amountInEther + currentBalance
                Account.updateOne({ address: _to }, { balance: newBalance })
                console.log("success")
                //res.render("home", { balance: "" })
            }
            else {
                const account = new Account({
                    address: _to,
                    balance: amountInEther
                })
                account.save()
                console.log("success")
                // res.render("home", { balance: "" })

            }
        }
    })


})


