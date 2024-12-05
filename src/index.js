const web3 = require("web3");
const Abi = require('./erc20.json');

class Web3Utils {
    constructor(rpcurl) {
        this.web3Instance = new web3(rpcurl);
    }

    async getBalance(address) {
        try {
            const bal = await this.web3Instance.eth.getBalance(address);
            const balance = this.web3Instance.utils.fromWei(bal, "ether");
            return balance;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getChainId() {
        try {
            const chainId = await this.web3Instance.eth.getChainId();
            return chainId;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCurrentBlock() {
        try {
            const block = await this.web3Instance.eth.getBlockNumber();
            return block;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getGasPrice() {
        try {
            const gasPrice = await this.web3Instance.eth.getGasPrice();
            return gasPrice;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getBlockTransactionCount(blockNumber) {
        try {
            const count = await this.web3Instance.eth.getBlockTransactionCount(blockNumber);
            return count;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getBlock(blockNumber) {
        try {
            const block = await this.web3Instance.eth.getBlock(blockNumber);
            return block;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getTransaction(hash) {
        try {
            const transaction = await this.web3Instance.eth.getTransaction(hash);
            return transaction;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getPendingTransactions() {
        try {
            const transactions = await this.web3Instance.eth.getPendingTransactions();
            return transactions;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getTransactionFromBlock(blockNumber, index) {
        try {
            const transaction = await this.web3Instance.eth.getTransactionFromBlock(blockNumber, index);
            return transaction;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getTransactionReceipt(hash) {
        try {
            const receipt = await this.web3Instance.eth.getTransactionReceipt(hash);
            return receipt;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getTransactionCount(address) {
        try {
            const count = await this.web3Instance.eth.getTransactionCount(address);
            return count;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createAddress() {
        try {
            const address = await this.web3Instance.eth.accounts.create();
            return address;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async transferAmount(data) {
        try {
            if (!data.from_address || !data.to_address || !data.privatekey || !data.amount || !data.gas) {
                return "All fields are required";
            }
            const value = await this.web3Instance.utils.toWei(data.amount, 'ether');
            const signedTransaction = await this.web3Instance.eth.accounts.signTransaction(
                {
                    from: data.from_address,
                    to: data.to_address,
                    value,
                    gas: data?.gas
                },
                data.privatekey
            );
            const receipt = await this.web3Instance.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            return { signedTransaction, transaction_receipt: receipt };
        } catch (error) {
            return error.message;
        }
    }

    async decodeLogsParameter(type, topic) {
        try {
            const logs = await this.web3Instance.eth.abi.decodeParameter(type, topic);
            return logs;
        } catch (error) {
            return error.message;
        }
    }

    async contractCall(Abi, address, functionName, params) {
        try {
            if (!Abi || !address || !functionName) {
                return "All fields are required";
            }
            const contractInstance = new this.web3Instance.eth.Contract(Abi, address);
            const result = await contractInstance.methods[functionName](...params).call();
            return result;
        } catch (error) {
            return error.message;
        }
    }

    async getContractBalance(Abi, ContractAddress, address) {
        try {
            const contractInstance = new this.web3Instance.eth.Contract(Abi, ContractAddress);
            const result = await contractInstance.methods.balanceOf(address).call();
            const decimal = await contractInstance.methods.decimals().call();
            const balance = result / (10 ** decimal);
            return balance;
        } catch (error) {
            return error.message;
        }
    }

    async contractSend(Abi, address, functionName, fromAddress, privatekey, params) {
        if (!Abi || !address || !functionName || !fromAddress || !privatekey) {
            return "All fields are required";
        }
        try {
            const contract = new this.web3Instance.eth.Contract(Abi, address);
            const gasAmount = await contract.methods[functionName](...params).estimateGas({ from: fromAddress });
            const txObject = {
                from: fromAddress,
                nonce: await this.web3Instance.eth.getTransactionCount(fromAddress),
                to: address,
                gas: gasAmount,
                value: "0x0",
                data: contract.methods[functionName](...params).encodeABI(),
            };
            const signedTransaction = await this.web3Instance.eth.accounts.signTransaction(txObject, privatekey);
            const txHash = await this.web3Instance.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            return {
                signTransaction: signedTransaction,
                transactionHash: txHash
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = Web3Utils;
