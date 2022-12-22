# ConnectFour Game Project

This project implements Connect Four game with a web3 interface to play.
The back-end via a smart contract is written in Solidity/EVM. As for
implementing the web3 interface front-end, we used web3.js and ethjs.
To run the application server, you need to run the following commands from your project root directory: 
```shell
npm install web3 ethjs express
node run scripts/app.js
```
A server will be run on default port 8080.
______

To run the tests for the contract, you can use the following command:
```shell
npm install --save-dev @nomicfoundation/hardhat-chai-matcher
npm install --save-dev @nomicfoundation/hardhat-network-helpers
npm install --save-dev hardhat
npm install --save-dev chai
npm install --save-dev mocha
npm install --save-dev @nomiclabs/hardhat-waffle
npx hardhat test ./test/ConnectFourTest.js
```
