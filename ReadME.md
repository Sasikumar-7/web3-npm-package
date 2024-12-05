
# Web3 Simplifier

`web3-simplifier` is a simple utility package that simplifies interactions with the Ethereum blockchain using the popular `web3.js` library. It provides a set of easy-to-use methods for common blockchain tasks such as querying balances, sending transactions, interacting with smart contracts, and more.

## Installation

You can install the `web3-simplifier` package via `npm`:

```bash
npm install web3-simplifier
```

```js
const Web3Utils = require('web3-simplifier');

const web3Utils = new Web3Utils('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const balance = await web3Utils.getBalance('0x1234...abcd');
console.log(balance); // e.g., "1.0"


const chainId = await web3Utils.getChainId();
console.log(chainId); // e.g., 1


const currentBlock = await web3Utils.getCurrentBlock();
console.log(currentBlock); // e.g., 1234567


const gasPrice = await web3Utils.getGasPrice();
console.log(gasPrice); // e.g., "20000000000" (20 Gwei)


const txCount = await web3Utils.getBlockTransactionCount(12345); // 12345 is block number
console.log(txCount); // e.g., 10


const blockDetails = await web3Utils.getBlock(12345);  // 12345 is block number
console.log(blockDetails);


const txDetails = await web3Utils.getTransaction('0x1234...abcd'); // transaction hash
console.log(txDetails);


const pendingTxs = await web3Utils.getPendingTransactions();
console.log(pendingTxs);


const txFromBlock = await web3Utils.getTransactionFromBlock(12345, 0); // 12345 is block number , 0 is index
console.log(txFromBlock);

// index means block transactions list index number if block contains 100 transaction index is 5 then return  5th transaction details 

const receipt = await web3Utils.getTransactionReceipt('0x1234...abcd');  // transaction hash
console.log(receipt);

// this return the logs and other details of transaction

const txCount = await web3Utils.getTransactionCount('0x1234...abcd'); // user address
console.log(txCount); // e.g., 5

// this return the nounce of the address that means addres transaction count 

const newAddress = await web3Utils.createAddress();
console.log(newAddress);

var transferData = {
            from_address: "From Address",
            to_address: "To Address",
            privatekey: "From Address Private Key",
            amount: "Transfer Amount in String Format like 0.01 or 1",
            gas: "gas Amount to Spend like 21000 for basic Transaction need"
        }

const transferData = {
    from_address: '0x1234...abcd',
    to_address: '0x5678...efgh',
    privatekey: '0xabcdef...',
    amount: '1',
    gas: '21000'
};

const transferReceipt = await web3Utils.transferAmount(transferData);
console.log(transferReceipt);

const decodedLog = await web3Utils.decodeLogsParameter('uint256', '0x1234...abcd'); //uint256 is type, topic
console.log(decodedLog);
// type must be uint256 or string or address 

const result = await web3Utils.contractCall(Abi, '0xContractAddress', 'balanceOf', ['0x1234...abcd']); // abi, contract address, function name, params
console.log(result);
// parameters in Array format what are the inputs are given. if no parameters are given then give the empty array.


const tokenBalance = await web3Utils.getContractBalance(Abi, '0xTokenContractAddress', '0x1234...abcd'); // abi, contract address, user address
console.log(tokenBalance);

const txReceipt = await web3Utils.contractSend(Abi, '0xContractAddress', 'approve', '0x1234...abcd', '0xPrivateKey', ['0x5678...efgh', '1000000000000000000']);
                                                // abi, contract address, function name, from address, privatekey, params
console.log(txReceipt);



```