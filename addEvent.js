const Moralis = require('moralis-v1/node')
require('dotenv').config({
    path: '.env.local',
})
const contractAddresses = require('./constants/networkMapping.json')

const chainId = process.env.chainId || 31337
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER || ''
const appId = process.env.NEXT_PUBLIC_APP_ID || ''
const masterKey = process.env.masterKey || ''
const moralisChainId = chainId === '31337' ? '1337' : chainId

const contractAddress = contractAddresses[chainId]['nftMarketplace'][0]

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log('working with contract address', contractAddress)

    console.log(moralisChainId)

    const itemListedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: 'ItemListed(address,address,uint256,uint256)',
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'seller',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'nftAddress',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'price',
                    type: 'uint256',
                },
            ],
            name: 'ItemListed',
            type: 'event',
        },
        tableName: 'ItemListed',
    }

    const itemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: 'ItemBought(address, address, uint256, uint256)',
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'buyer',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'nftAddress',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'price',
                    type: 'uint256',
                },
            ],
            name: 'ItemBought',
            type: 'event',
        },
        tableName: 'ItemBought',
    }

    const itemCancelledOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: 'ItemCancelled(address,address,uint256)',
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'seller',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'nftAddress',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
            ],
            name: 'ItemCancelled',
            type: 'event',
        },
        tableName: 'ItemCancelled',
    }

    const listedRes = await Moralis.Cloud.run(
        'watchContractEvent',
        itemListedOptions,
        { useMasterKey: true }
    )
    const boughRes = await Moralis.Cloud.run(
        'watchContractEvent',
        itemBoughtOptions,
        { useMasterKey: true }
    )
    const cancelledRes = await Moralis.Cloud.run(
        'watchContractEvent',
        itemCancelledOptions,
        { useMasterKey: true }
    )

    console.log({ listedRes, boughRes, cancelledRes })
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
