require("dotenv").config();
const { Web3 } = require("web3");
const express = require("express");
const app = express();

const cors = require("cors");
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");

app.use(
  cors({
    credentials: true,
    origin: process.env.FrontEnd,
    // origin:"*"
  })
);
const lendingContractAddress = "0x04160607a777257C04FA90c078eF28cC2ee25448";
const lendingContractABI = [
  {
    inputs: [
      {
        internalType: "uint256",

        name: "_loanId",

        type: "uint256",
      },

      {
        internalType: "address payable",

        name: "borrower",

        type: "address",
      },

      {
        internalType: "uint256",

        name: "_collateral",

        type: "uint256",
      },
    ],

    name: "addCollateral",

    outputs: [],

    stateMutability: "payable",

    type: "function",
  },

  {
    inputs: [
      {
        internalType: "uint256",

        name: "_loanId",

        type: "uint256",
      },

      {
        internalType: "address payable",

        name: "borrower",

        type: "address",
      },
    ],

    name: "borrow",

    outputs: [],

    stateMutability: "nonpayable",

    type: "function",
  },

  {
    inputs: [],

    name: "counter",

    outputs: [
      {
        internalType: "uint256",

        name: "",

        type: "uint256",
      },
    ],

    stateMutability: "view",

    type: "function",
  },

  {
    inputs: [
      {
        internalType: "uint256",

        name: "_principal",

        type: "uint256",
      },

      {
        internalType: "uint256",

        name: "_interestRate",

        type: "uint256",
      },

      {
        internalType: "uint256",

        name: "_dueDate",

        type: "uint256",
      },

      {
        internalType: "address payable",

        name: "borrower",

        type: "address",
      },

      {
        internalType: "address payable",

        name: "lender",

        type: "address",
      },
    ],

    name: "lend",

    outputs: [],

    stateMutability: "payable",

    type: "function",
  },

  {
    inputs: [],

    name: "loanCounter",

    outputs: [
      {
        internalType: "uint256",

        name: "",

        type: "uint256",
      },
    ],

    stateMutability: "view",

    type: "function",
  },

  {
    inputs: [
      {
        internalType: "uint256",

        name: "",

        type: "uint256",
      },
    ],

    name: "loans",

    outputs: [
      {
        internalType: "address",

        name: "borrower",

        type: "address",
      },

      {
        internalType: "uint256",

        name: "principal",

        type: "uint256",
      },

      {
        internalType: "uint256",

        name: "interestRate",

        type: "uint256",
      },

      {
        internalType: "uint256",

        name: "dueDate",

        type: "uint256",
      },

      {
        internalType: "bool",

        name: "isClosed",

        type: "bool",
      },

      {
        internalType: "uint256",

        name: "collateral",

        type: "uint256",
      },

      {
        internalType: "address",

        name: "lender",

        type: "address",
      },

      {
        internalType: "bool",

        name: "isLent",

        type: "bool",
      },
    ],

    stateMutability: "view",

    type: "function",
  },

  {
    inputs: [
      {
        internalType: "uint256",

        name: "_loanId",

        type: "uint256",
      },

      {
        internalType: "address payable",

        name: "borrower",

        type: "address",
      },

      {
        internalType: "uint256",

        name: "amount",

        type: "uint256",
      },
    ],

    name: "repay",

    outputs: [],

    stateMutability: "payable",

    type: "function",
  },
];

const lendingContract = new web3.eth.Contract(
  lendingContractABI,
  lendingContractAddress
);

// Repay function

app.post("/lend", async function (req, res) {
  console.log(req.body);

  // Lend function

  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
  await lendingContract.methods
    .lend(
      req.body.principalAmt,
      req.body.interestRate,
      req.body.dueDate,
      req.body.borrower,
      req.body.address
    )
    .send({ from: "0x214fAA934A1C36808b9Ee2462f2A86487C705571" , gas: 400000})
    .then(receipt=>{
      console.log(receipt)
    })
    .catch(err=>{
      console.log(err);
      res.send("Error")
    });
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    await lendingContract.methods
      .counter()
      .call()
      .then(receipt=>{
         res.send(Number(receipt[Object.keys(receipt)[0]]));
      })
      .catch(err=>{
        console.log(err);
        res.send("Error")
      });
});
app.get("/", function(req,res){
  res.send("I am Live :)");
  })
app.post("/borrow", async function (req, res) {
  console.log(req.body);

  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
  await lendingContract.methods
  .addCollateral( req.body.loanid, req.body.address, req.body.amt)
  .send({ from: "0x214fAA934A1C36808b9Ee2462f2A86487C705571" , gas: 400000})
  .then(receipt=>{
    console.log(receipt);
  })
  .catch(err=>{
    console.log(err);
    res.send("Error")
  });
  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
  await lendingContract.methods
    .borrow(req.body.loanid, req.body.address)
    .send({ from: "0x214fAA934A1C36808b9Ee2462f2A86487C705571" , gas: 400000})
    .then(receipt=>{
      console.log(receipt);
      res.send("Form Submitted Successfully!!");
    })
    .catch(err=>{
      console.log(err);
      res.send("Error")
    });
});

app.post("/repay", async function (req, res) {
  console.log(req.body);

  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
  await lendingContract.methods
    .repay( req.body.loanid, req.body.address, req.body.amt)
    .send({ from: "0x214fAA934A1C36808b9Ee2462f2A86487C705571" , gas: 400000})
    .then(receipt=>{
      console.log(receipt)
      res.send("Form Submitted Successfully!!");
    })
    .catch(err=>{
      console.log(err);
      res.send("Error")
    });
});

app.listen(8888, function () {
  console.log("Listening on port 8888");
});
