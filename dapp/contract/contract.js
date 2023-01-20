const Web3 = require("web3")
const abi = require("./abi.json")

const web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/7a7bcc28f3af4b11a4a7b75368e21ab9"))
const contract = new web3.eth.Contract(abi, "0xf84D0747081edB56404C8082b80021b009EFe510")



module.exports = {
    contract: contract,
    web3: web3
}
