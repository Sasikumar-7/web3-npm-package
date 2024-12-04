```js
const {getBalance, getChainId} = require('web3-simplifier')

var balance = await getBalance("rpcurl", "address")

var chainId = await getChainId("rpcurl")

var currentBlock = await getCurrentBlock("rpcurl")

var gasPrice = await getGasPrice("rpcurl")

var blockTransactionCount = await getBlockTransactionCount("rpcurl","blockNumber")

var blockDetails = await getBlock("rpcurl", "blockNumber")

var transactionDetails = await getTransaction("rpcurl", "hash")

var pendingTransactionDetails = await getPendingTransactions("rpcurl")

var transactionsFromBlock = await getTransactionFromBlock("rpcurl","blockNumber","index")
// index means block transactions list index number if block contains 100 transaction index is 5 then return  5th transaction details 

var transactionReceipt = await getTransactionReceipt("rpcurl","hash")
// this return the logs and other details of transaction

var transactionCount = await getTransactionCount("rpcurl", "address")
// this return the nounce of the address that means addres transaction count 

var createAddress = await createAddress("rpcurl")


var payload = {
            rpcurl: "rpcurl",
            from_address: "From Address",
            to_address: "To Address",
            privatekey: "From Address Private Key",
            amount: "Transfer Amount in String Format like 0.01 or 1",
            gas: "gas Amount to Spend like 21000 for basic Transaction need"
        }
var transferAmount = await transferAmount(payload)
```