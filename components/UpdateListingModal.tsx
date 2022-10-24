import { ContractTransaction, ethers } from 'ethers'
import React, { useState } from 'react'
import { useWeb3Contract } from 'react-moralis'
import { Input, Modal, useNotification } from 'web3uikit'
import { NFTMarketplace } from '../constants'

interface IProps {
    nftAddress: string
    tokenId: number
    isVisible: boolean
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
    price: string
    marketplaceAddress: string
    reFetch: any
}

const UpdateListingModal: React.FC<IProps> = ({
    nftAddress,
    tokenId,
    isVisible,
    setIsVisible,
    price,
    marketplaceAddress,
    reFetch,
}) => {
    const [newPrice, setNewPrice] = useState(price)

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: NFTMarketplace,
        contractAddress: marketplaceAddress,
        functionName: 'updateListing',
        params: {
            _nftAddress: nftAddress,
            _tokenId: tokenId,
            _newPrice: ethers.utils.parseEther(newPrice),
        },
    })
    const dispatch = useNotification()

    async function handleSuccess(results: ContractTransaction) {
        await results.wait(2)
        dispatch({
            position: 'topR',
            type: 'success',
            message: `#${tokenId} listing has been updated`,
            title: 'Update Listing',
        })
        await reFetch({
            onSuccess: (results: any) => console.log(results),
        })
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={() => {
                setIsVisible(false)
            }}
            onCloseButtonPressed={() => {
                setIsVisible(false)
            }}
            onOk={async () => {
                setIsVisible(false)
                price !== newPrice &&
                    (await updateListing({
                        onError(error) {
                            console.error(error)
                        },
                        onSuccess: (results) => {
                            console.log(results)
                            handleSuccess(results as ContractTransaction)
                        },
                    }))
            }}
            isCentered
            title={`#${tokenId}`}
        >
            <Input
                label="Update listing price in L1 currency (ETH)"
                name="New listing price"
                type="number"
                style={{ marginBottom: '1rem' }}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
            ></Input>
        </Modal>
    )
}

export default UpdateListingModal
