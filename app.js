const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
var Web3 = require("web3");

web3 = new Web3("http://localhost:8545");

const app = express();

coinbase = "0xBfAdD921c2F661B4DB351882b9D7838C0112d687";
var contractAddress = "0x9b5A86440dB5D4049F393E5e7F649348665c2506";
var contractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidate",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidatesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "getCandidate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];




Election = new web3.eth.Contract(contractAbi, contractAddress);
// Election = myAbi.new(
//   {
//     from: web3.eth.accounts[0],
//     data: "0x60806040523480156100115760006000fd5b505b61005a6040518060400160405280600b81526020017f43616e64696461746520310000000000000000000000000000000000000000008152602001506100a760201b60201c565b6100a16040518060400160405280600b81526020017f43616e64696461746520320000000000000000000000000000000000000000008152602001506100a760201b60201c565b5b6101f4565b60026000818150548092919060010191905090905550604051806060016040528060026000505481526020018281526020016000815260200150600160005060006002600050548152602001908152602001600020600050600082015181600001600050909055602082015181600101600050908051906020019061012d929190610144565b506040820151816002016000509090559050505b50565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061018557805160ff19168380011785556101b8565b828001600101855582156101b8579182015b828111156101b75782518260005090905591602001919060010190610197565b5b5090506101c591906101c9565b5090565b6101f191906101d3565b808211156101ed57600081815060009055506001016101d3565b5090565b90565b6107d1806102036000396000f3fe60806040523480156100115760006000fd5b50600436106100675760003560e01c80630121b93f1461006d5780632d35a8a21461009c5780633477ee2e146100ba57806335b8e820146101715780636c8381f814610228578063a3ec138d146102ac57610067565b60006000fd5b61009a600480360360208110156100845760006000fd5b8101908080359060200190929190505050610309565b005b6100a46104ec565b6040518082815260200191505060405180910390f35b6100e7600480360360208110156100d15760006000fd5b81019080803590602001909291905050506104f5565b6040518084815260200180602001838152602001828103825284818151815260200191508051906020019080838360005b838110156101345780820151818401525b602081019050610118565b50505050905090810190601f1680156101615780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b61019e600480360360208110156101885760006000fd5b81019080803590602001909291905050506105c3565b6040518084815260200180602001838152602001828103825284818151815260200191508051906020019080838360005b838110156101eb5780820151818401525b6020810190506101cf565b50505050905090810190601f1680156102185780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b6102306106d5565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102715780820151818401525b602081019050610255565b50505050905090810190601f16801561029e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102ef600480360360208110156102c35760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610776565b604051808215151515815260200191505060405180910390f35b600060005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515156103d1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f55736572206861766520766f746564206265666f72652121000000000000000081526020015060200191505060405180910390fd5b6000811180156103e657506002600050548111155b151561045d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f496e76616c69642063616e64696461746500000000000000000000000000000081526020015060200191505060405180910390fd5b6001600060005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506001600050600082815260200190815260200160002060005060020160008181505480929190600101919050909055505b50565b60026000505481565b6001600050602052806000526040600020600091509050806000016000505490806001016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105b05780601f10610585576101008083540402835291602001916105b0565b820191906000526020600020905b81548152906001019060200180831161059357829003601f168201915b5050505050908060020160005054905083565b600060606000600160005060008581526020019081526020016000206000506000016000505492508250600160005060008581526020019081526020016000206000506001016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106a05780601f10610675576101008083540402835291602001916106a0565b820191906000526020600020905b81548152906001019060200180831161068357829003601f168201915b5050505050915081506001600050600085815260200190815260200160002060005060020160005054905080505b9193909250565b60036000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561076e5780601f106107435761010080835404028352916020019161076e565b820191906000526020600020905b81548152906001019060200180831161075157829003601f168201915b505050505081565b600060005060205280600052604060002060009150909054906101000a900460ff168156fea2646970667358221220ac4d84bcc1f2eb9da7471c02df0b663194c03c8133863f8a614b6fb1cf905cd564736f6c63430006040033",
//     gas: '4700000'
//   }, function (e,contract) {
//     console.log(e, contract);
//     if (typeof contract.address !== 'undefined') {
//       console.log('Contract mined! address: ' + contract.address + 'transactionHash: ' + contract.transactionHAsh);
//     }
//   }
// )


// Passport Config
require('./config/passport')(passport);


// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));





// Express body parser
app.use(express.urlencoded({ extended: true }));


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());




// For static front end
app.use(express.static('front-end'));

// Routes

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/list', require('./routes/list'));





module.exports = app;

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server started on port ${PORT}`));
