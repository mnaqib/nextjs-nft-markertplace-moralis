import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { Card, useNotification } from 'web3uikit'
import { NFTMarketplace, networkMapping, basicNFT } from '../constants'
import { ContractTransaction, ethers } from 'ethers'
import UpdateListingModal from './UpdateListingModal'

interface IProps {
    price: number
    nftAddress: string
    tokenId: number
    seller: string
    marketplaceAddress: string
    reFetch: any
}

const shortenAddress = (str: string) => {
    if (str.length === 0) return str

    return str.substring(0, 6) + '...' + str.substring(str.length - 3)
}

const NFTBox: React.FC<IProps> = ({
    nftAddress,
    price,
    seller,
    tokenId,
    marketplaceAddress,
    reFetch,
}) => {
    const { isWeb3Enabled, chainId, account } = useMoralis()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: basicNFT,
        contractAddress: nftAddress,
        functionName: 'TOKEN_URI',
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: NFTMarketplace,
        contractAddress: marketplaceAddress,
        functionName: 'buyItem',
        msgValue: price,
        params: {
            _nftAddress: nftAddress,
            _tokenId: tokenId,
        },
    })

    const dispatch = useNotification()

    const [imageURI, setImageURI] = useState('')
    const [tokenDescription, setTokenDescription] = useState('')
    const [tokenName, setTokenName] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    async function updateUI() {
        const tokenURI = (await getTokenURI()) as string

        if (tokenURI) {
            const url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
            console.log(url)

            const tokenUriRes = await fetch(url).then(async (response) =>
                response.json()
            )
            const { image, name, description } = tokenUriRes

            setImageURI(image)
            setTokenDescription(description)
            setTokenName(name)
        }
    }

    async function buy(tx: ContractTransaction) {
        await tx.wait(2)
        await reFetch()

        dispatch({
            position: 'topR',
            type: 'success',
            title: 'Item Bought',
            message: `#${tokenId} has been successfully bought`,
        })
    }

    const isOwnedby = account === seller || seller === undefined

    return (
        <div>
            {imageURI && (
                <>
                    <UpdateListingModal
                        {...{
                            nftAddress,
                            tokenId,
                            isVisible,
                            setIsVisible,
                            price: ethers.utils.formatEther(price),
                            marketplaceAddress,
                            reFetch,
                        }}
                    />
                    <Card
                        description={tokenDescription}
                        title={tokenName}
                        onClick={async () =>
                            isOwnedby
                                ? setIsVisible(true)
                                : await buyItem({
                                      onError(error) {
                                          console.error(error)
                                      },
                                      onSuccess: (tx) =>
                                          buy(tx as ContractTransaction),
                                  })
                        }
                    >
                        <div className="flex flex-col items-end">
                            <div className="w-full">#{tokenId}</div>
                            <div className="font-semibold text-sm w-full">
                                owned by:{' '}
                                {isOwnedby
                                    ? 'You'
                                    : shortenAddress(seller || '')}
                            </div>
                            <Image
                                loader={() => imageURI}
                                src={imageURI}
                                alt="nft"
                                height={200}
                                width={200}
                            ></Image>
                            <div className="font-bold">
                                {ethers.utils.formatEther(price)} ETH
                            </div>
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}

export default NFTBox
