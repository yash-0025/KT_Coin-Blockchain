// ! Creating a Block 
// 1. First we have to create a currency or coin for the network


const SHA256 = require("crypto-js/sha256");

class CryptoBlock {
    constructor(index, timestamp, data, precedingHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
        this.nonce = 0;
    }

    // Computing Hash using the SHA256 algorithm using the index ,preceding hash ,previous hash, and data 
    computeHash() {
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // WE need something like Proof of work consensus so it will not allow people from spamming transactions on the chain
    proofOfWork(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }
}

// Creating a Block chains 
// - Creating new blocks
// - Adding it to the chain

class CryptoChain {
    constructor() {
        // First block of the chain is called as genesis block
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 4
    }

    startGenesisBlock() {
        return new CryptoBlock(0, "21/02/2025", "Initial Block in the chain", "0");
    }

    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        // newBlock.hash = newBlock.computeHash();
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }

    // To maintain the integrity of the chain we have to check that the block are properly in sequenced and there is no tampering with the hashes
    checkChainIntegrity() {
        for (let i = 0; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }
            if (currentBlock.precedingHash !== precedingBlock.hash)
                return false;
        }
        return true;
    }
}



// Testing the chain
let ktcoin = new CryptoChain();
console.log("Mining");
ktcoin.addNewBlock(new CryptoBlock(1, "21/02/2025", { sender: "Yash Patel", recipient: "Krot", quantity: 50 }));
ktcoin.addNewBlock(new CryptoBlock(2, "21/02/2025", { sender: "Yash", recipient: "Krot", quantity: 500 }));
console.log(JSON.stringify(ktcoin, null, 4));