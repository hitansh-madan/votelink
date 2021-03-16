# Votelink - DApp
DApp for Votelink, a blockchain based e-voting system
## How to run
1. run `npm install`
2. Install truffle suite
3. Create a firebase project and paste the config object into `src/js/firebaseInit.js`
4. Create a private chain(geth dev/clique/ganache/gQuorum etc.) or use a public testnet.
5. Get metamask(or Mist browser etc.)
6. run `truffle migrate`
7. run `npm run dev` to start up lite-server at localhost:3000
