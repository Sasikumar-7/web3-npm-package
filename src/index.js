const web3 = require("web3");
const solc = require('solc')
const fs = require("fs");
const path = require('path')

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
            const value = await this.web3Instance.utils.toWei(data.amount, 'ether');

            // Get the current nonce for the sender address
            const nonce = await this.web3Instance.eth.getTransactionCount(data.from_address, 'latest');

            // Estimate the gas for the transaction
            const gasLimit = await this.web3Instance.eth.estimateGas({
                from: data.from_address,
                to: data.to_address,
                value: value,
                gas: data.gas
            });

            const signedTransaction = await this.web3Instance.eth.accounts.signTransaction(
                {
                    from: data.from_address,
                    to: data.to_address,
                    value: value,
                    gas: gasLimit, // Use the dynamically estimated gas
                    gasPrice: await this.web3Instance.eth.getGasPrice(), // Get the current gas price
                    nonce: nonce, // Use the correct nonce
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

    /**
     * Deploys a smart contract from a .sol file.
     * @param {String} contractPath - Path to the Solidity (.sol) contract file.
     * @param {String} fromAddress - The address from which to deploy the contract.
     * @param {String} privateKey - The private key of the `fromAddress` to sign the transaction.
     * @param {Array} constructorArgs - The constructor arguments (if any) to pass during deployment.
     * @returns {Object} - Contains the contract address and transaction receipt.
     */


    async loadSolc(version) {
        return new Promise((resolve, reject) => {
            solc.loadRemoteVersion(version, (err, solcInstance) => {
                if (err) {
                    reject(err);  // Reject the promise if there's an error
                } else {
                    resolve(solcInstance);  // Resolve with solc if successful
                }
            });
        });
    };
    async deployContractFromFile(version, fileContent, filename, functionName, fromAddress, privateKey, constructorArgs = []) {
        try {
            return new Promise(async (resolve, reject) => {
                process.stdout.write("start compling...");
                const solcwrap = await this.loadSolc(version);

                // Define the input structure for the compiler
                const input = {
                    language: 'Solidity',
                    sources: {
                        [filename]: {
                            content: fileContent
                        }
                    },
                    settings: {
                        outputSelection: {
                            '*': {
                                '*': ['evm.bytecode', 'evm.deployedBytecode', 'abi']
                            }
                        }
                    }
                };

                // Compile the Solidity code
                const compiledContract = JSON.parse(solcwrap.compile(JSON.stringify(input)));

                var ABI = compiledContract.contracts[filename][functionName].abi;
                var bytecode = compiledContract.contracts[filename][functionName].evm.bytecode.object;
                if (ABI && bytecode) {
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0); // Move cursor to the beginning of the line
                    console.log("Compiled!");
                    process.stdout.write("start deploying...");
                    // Create contract instance
                    const contract = new this.web3Instance.eth.Contract(ABI);

                    // Estimate the gas required to deploy the contract
                    const gasEstimate = await contract.deploy({
                        data: bytecode,
                        arguments: constructorArgs
                    }).estimateGas({ from: fromAddress });

                    // Create the transaction object for contract deployment
                    const txObject = {
                        from: fromAddress,
                        gas: gasEstimate,
                        data: contract.deploy({
                            data: bytecode,
                            arguments: constructorArgs
                        }).encodeABI()
                    };
                    // Sign the transaction using the private key
                    const signedTx = await this.web3Instance.eth.accounts.signTransaction(txObject, privateKey);

                    // Send the signed transaction and get the transaction hash
                    const txHash = await this.web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction);

                    // Return the contract address and the transaction receipt
                    if (txHash) {
                        process.stdout.clearLine();
                        process.stdout.cursorTo(0); // Move cursor to the beginning of the line
                        console.log("Compiled!");
                        resolve({
                            contractAddress: txHash.contractAddress,
                            transactionReceipt: txHash
                        })
                    }

                } else {
                    reject("ABI or Bytecode not found")
                }
            });
        } catch (error) {
            throw new Error(`Error deploying contract: ${error.message}`);
        }
    }
}

module.exports = Web3Utils;
