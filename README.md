# BOTTO Subgraph

Subgraph for indexing BOTTO and BOTTO-ETH stakes

## Development

### Start docker subgraph node

```
git clone -n git@github.com:graphprotocol/graph-node.git
cd graph-node
git checkout hosted-current
cd docker
./setup.sh
# set ethereum node to `goerli:http://host.docker.internal:9545` for development in graph-node docker-compose.yml
docker-compose up
```

### Start truffle development mode

```
npx truffle develop
truffle> migrate
```

### Run & deploy

```
npm install
npm run prepare:goerli
npm run codegen
npm run create-local
npm run deploy-local
```

### Run & deploy goerli

Update `config/goerli.json` with deployed contract addresses.

```
npm install
npm run prepare:goerli
npm run codegen
npm run deploy-goerli
```

### Run & deploy mainnet

Update `config/mainnet.json` with deployed contract addresses.

```
npm install
npm run prepare:mainnet
npm run codegen
npm run deploy-mainnet
```

### Call functions & emit events

```
npx truffle develop
accounts = await web3.eth.getAccounts()

# governance
botto = await BOTTO.deployed()
governance = await BottoGovernance.deployed()
await botto.approve(governance.address, "1000000")
await governance.stake("1000000")
await governance.unstake()

# mining
mining = await BottoLiquidityMining.deployed()
await botto.transfer(mining.address, "5000000000000")
await mining.deposit("5000000000000", (await web3.eth.getBlock("latest")).timestamp + 30, (await web3.eth.getBlock("latest")).timestamp + 1000)
bottoEth = await MockERC20.deployed()
await bottoEth.approve(mining.address, "2000000")
await mining.stake("2000000")
await mining.withdraw()
```

### Query graph

GraphQL UI: http://localhost:8000/subgraphs/name/botto-subgraph

```
# example query
{
  stakers {
    id
    bottoStakes { id, amount, start, end }
    bottoEthStakes { id, amount, start, end }
  }
}

```

### Tear down development

```
graph-node/docker> docker-compose down -v
# delete /data folder and rerun ./setup.sh if required to reset network details
```
