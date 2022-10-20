const Web3 = require('web3')
const fs = require('fs')
const ethers = require('ethers');
const crypto = require('crypto');
let count = 0
let saveCnt = 0

const createPair = () => {
    const privateKey = crypto.randomBytes(32).toString('hex');
    const wallet = new ethers.Wallet(privateKey);
    return {
        privateKey,
        walletAddress: wallet.address
    }
}

const checkStatus = (address, privateKey) => {
    const urls = ["Ethereum", "BSC"]
    urls.forEach(async (each, index) => {
        try {
            if (index == 0) {
                const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/eth/"))
                var balance = await web3.eth.getBalance(address)
                console.log('balance-ethereum', balance)
                if (balance > 0) {
                    saveCnt ++;
                    fs.writeFileSync("./" + index + "_" + balance + "_" + address + ".json", JSON.stringify({ address, privateKey, where: each }))
                }
                else
                    console.log(index, ++count, balance, address, privateKey, saveCnt)
            }
            if (index == 1) {
                const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"))
                var balance = await web3.eth.getBalance(address)
                console.log('balance-binance', balance)
                if (balance > 0) {
                    saveCnt ++;
                    fs.writeFileSync("./" + index + "_" + balance + "_" + address + ".json", JSON.stringify({ address, privateKey, where: each }))
                }
                else
                    console.log(index, ++count, balance, address, privateKey, saveCnt)
            }
        }
        catch (e) {
           // fs.writeFileSync("./error_" + index + "_" + address + ".json", JSON.stringify({ address, privateKey }))
        }
        // console.log(address, ",", privateKey)
    })
}

setInterval(async () => {
    const { privateKey, walletAddress} = createPair()
    checkStatus(walletAddress, privateKey)
}, 100)