const web3 = require("web3");
const Abi = require('./erc20.json')

const getBalance = async (rpcurl, address) => {
    try {
        const web3Instance = new web3(rpcurl);
        const bal = await web3Instance.eth.getBalance(address);
        const balance = web3Instance.utils.fromWei(bal, "ether");
        return balance
    } catch (error) {
        throw error.message
    }
}

const getChainId = async (rpcurl) => {
    try {
        const web3Instance = new web3(rpcurl);
        const chainId = await web3Instance.eth.getChainId();
        return chainId
    } catch (error) {
        throw error.message
    }
}

const getCurrentBlock = async (rpcurl) => {
    try {
        const web3Instance = new web3(rpcurl);
        const block = await web3Instance.eth.getBlockNumber();
        return block
    } catch (error) {
        throw error.message
    }
}

const getGasPrice = async (rpcurl) => {
    try {
        const web3Instance = new web3(rpcurl);
        const gasPrice = await web3Instance.eth.getGasPrice();
        return gasPrice
    } catch (error) {
        throw error.message
    }
}

const getBlockTransactionCount = async (rpcurl, blockNumber) => {
    try {
        const web3Instance = new web3(rpcurl);
        const count = await web3Instance.eth.getBlockTransactionCount(blockNumber);
        return count
    } catch (error) {
        throw error.message
    }
}

const getBlock = async (rpcurl, blockNumber) => {
    try {
        const web3Instance = new web3(rpcurl);
        const block = await web3Instance.eth.getBlock(blockNumber);
        return block
    } catch (error) {
        throw error.message
    }
}

const getTransaction = async (rpcurl, hash) => {
    try {
        const web3Instance = new web3(rpcurl);
        const transaction = await web3Instance.eth.getTransaction(hash);
        return transaction
    } catch (error) {
        throw error.message
    }
}

const getPendingTransactions = async (rpcurl) => {
    try {
        const web3Instance = new web3(rpcurl);
        const transactions = await web3Instance.eth.getPendingTransactions();
        return transactions
    } catch (error) {
        throw error.message
    }
}

const getTransactionFromBlock = async (rpcurl, blockNumber, index) => {
    try {
        const web3Instance = new web3(rpcurl);
        const transactions = await web3Instance.eth.getTransactionFromBlock(blockNumber, index);
        return transactions
    } catch (error) {
        throw error.message
    }
}

const getTransactionReceipt = async (rpcurl, hash) => {
    try {
        const web3Instance = new web3(rpcurl);
        const receipt = await web3Instance.eth.getTransactionReceipt(hash);
        return receipt
    } catch (error) {
        throw error.message
    }
}

const getTransactionCount = async (rpcurl, address) => {
    try {
        const web3Instance = new web3(rpcurl);
        const count = await web3Instance.eth.getTransactionCount(address);
        return count
    } catch (error) {
        throw error.message
    }
}

const createAddress = async (rpcurl) => {
    try {
        const web3Instance = new web3(rpcurl);
        const address = await web3Instance.eth.accounts.create();
        return address
    } catch (error) {
        throw error.message
    }
}

const transferAmount = async (data) => {
    try {
        if (!data.rpcurl || !data.from_address || !data.to_address || !data.privatekey || !data.amount || !data.gas) {
            return "All fields are required"
        }
        const web3Instance = new web3(data.rpcurl)
        const datas = {}
        const value = await web3Instance.utils.toWei(data.amount, 'ether')
        await web3Instance.eth.accounts.signTransaction(
            {
                from: data.from_address,
                to: data.to_address,
                value,
                gas: data?.gas
            },
            data.privatekey,
            (error, receipt) => {
                if (error) {
                    return error.message
                } else {
                    datas.signedtransaction = receipt
                }
            }
        )
        if (datas.signedtransaction !== undefined) {
            await web3Instance.eth.sendSignedTransaction(
                datas.signedtransaction.rawTransaction,
                (error, receipt) => {
                    if (error) {
                        return error.message
                    } else {
                        datas.transaction_receipt = receipt
                    }
                }
            )
        }
        if (datas.signedtransaction && datas.transaction_receipt) {
            return datas
        }
    } catch (error) {
        return error.message
    }
}

const decodeLogsParameter = async (rpcurl, type, topic) => {
    try {
        const web3Instance = new web3(rpcurl)
        const logs = await web3Instance.eth.abi.decodeParameter(type, topic)
        return logs
    } catch (error) {
        return error.message
    }
}

const contractCall = async (rpcurl, Abi, address, functionName, params) => {
    try {
        const web3Instance = new web3(rpcurl)
        const contractInstance = new web3Instance.eth.Contract(Abi, address)
        const result = await contractInstance.methods[functionName](...params).call()
        return result
    } catch (error) {
        return error.message
    }
}

const getContractBalance = async (rpcurl, Abi, ContractAddress, address) => {
    try {
        const web3Instance = new web3(rpcurl)
        const contractInstance = new web3Instance.eth.Contract(Abi, ContractAddress)
        const result = await contractInstance.methods.balanceOf(address).call()
        const decimal = await contractInstance.methods.decimals().call()
        const balance = result / (10 ** decimal)
        return balance
    } catch (error) {
        return error.message
    }
}

module.exports = { getBalance, getChainId, getCurrentBlock, getGasPrice, getBlockTransactionCount, getBlock, getTransaction, getPendingTransactions, getTransactionFromBlock, getTransactionReceipt, getTransactionCount, createAddress, transferAmount, decodeLogsParameter, contractCall, getContractBalance }



