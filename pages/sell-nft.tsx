import React, { useState } from 'react'
import type { NextPage } from 'next'
import { Form, useNotification } from 'web3uikit'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { NFTMarketplace, networkMapping, basicNFT } from '../constants'
import { ContractTransaction, ethers } from 'ethers'
import { useRouter } from 'next/router'

const SellNFT: NextPage = () => {
    const router = useRouter()
    const [tokenId, setTokenId] = useState('')

    const { chainId } = useMoralis()
    const chain = chainId ? parseInt(chainId).toString() : 31337

    const NFTMarketplaceAddress = (networkMapping as any)[chain][
        'nftMarketplace'
    ][0]

    const { runContractFunction: approve } = useWeb3Contract({})
    const { runContractFunction: listItem } = useWeb3Contract({})

    const dispatch = useNotification()

    async function itemListed(tx: ContractTransaction) {
        await tx.wait(2)
        dispatch({
            position: 'topR',
            type: 'success',
            title: 'NFT Listed',
            message: `#${tokenId} NFT has been lsited`,
        })
        setTimeout(() => router.push('/'), 200)
    }

    return (
        <div className="flex items-center justify-center">
            <Form
                title="List NFT for Sale"
                id="1"
                buttonConfig={{
                    theme: 'primary',
                }}
                data={[
                    {
                        name: 'NFT Address',
                        type: 'text',
                        value: '',
                        key: 'nftAddress',
                        inputWidth: '48rem',
                    },
                    {
                        name: 'Token ID',
                        type: 'number',
                        value: '',
                        key: 'tokenId',
                        inputWidth: '48rem',
                    },
                    {
                        name: 'Price (in ETH)',
                        type: 'number',
                        value: '',
                        key: 'price',
                        inputWidth: '48rem',
                    },
                ]}
                onSubmit={async (form) => {
                    const { data } = form

                    const inputs: any = data.reduce(
                        (input: any, item) => ({
                            ...input,
                            [item.key!]: item.inputResult,
                        }),
                        {}
                    )

                    console.log(inputs)

                    setTokenId(inputs['tokenId'])

                    await approve({
                        onError(error) {
                            console.error(error)
                        },
                        onSuccess(results) {
                            console.log(results)
                        },
                        params: {
                            abi: basicNFT,
                            contractAddress: inputs['nftAddress'],
                            functionName: 'approve',
                            params: {
                                to: NFTMarketplaceAddress,
                                tokenId: inputs['tokenId'],
                            },
                        },
                    })

                    await listItem({
                        onError(error) {
                            console.error(error)
                        },
                        onSuccess(results) {
                            itemListed(results as ContractTransaction)
                        },
                        params: {
                            abi: NFTMarketplace,
                            contractAddress: NFTMarketplaceAddress,
                            functionName: 'listItem',
                            params: {
                                _nftAddress: inputs['nftAddress'],
                                _tokenId: inputs['tokenId'],
                                _price: ethers.utils.parseEther(
                                    inputs['price']
                                ),
                            },
                        },
                    })
                }}
            />
        </div>
    )
}

export default SellNFT
