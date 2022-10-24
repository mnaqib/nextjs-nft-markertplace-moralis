import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useMoralis, useMoralisQuery } from 'react-moralis'
import Loader from '../components/Loader'
import NFTBox from '../components/NFTBox'

const Home: NextPage = () => {
    const { isWeb3Enabled } = useMoralis()

    const {
        data: listedNfts,
        isFetching,
        fetch: reFetch,
    } = useMoralisQuery('ActiveItem', (query) =>
        query.limit(10).descending('tokenId')
    )

    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(isFetching)
    }, [isFetching])

    return (
        <div className="flex flex-col px-8">
            {isWeb3Enabled ? (
                <>
                    <div className="text-2xl font-semibold my-2">
                        Recently Listed
                    </div>
                    <div className="flex flex-wrap px-2 mt-2 gap-8">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            listedNfts.map((nft, idx) => {
                                // console.log(nft.attributes)
                                const {
                                    price,
                                    nftAddress,
                                    tokenId,
                                    marketplaceAddress,
                                    seller,
                                } = nft.attributes

                                return (
                                    <NFTBox
                                        key={idx}
                                        {...{
                                            price,
                                            nftAddress,
                                            tokenId,
                                            marketplaceAddress,
                                            seller,
                                            reFetch,
                                        }}
                                    />
                                )
                            })
                        )}
                    </div>
                </>
            ) : (
                <div className="text-3xl font-bold my-2 text-red-500 flex items-center justify-center mt-32">
                    Web3 not enabled!
                </div>
            )}
        </div>
    )
}

export default Home
