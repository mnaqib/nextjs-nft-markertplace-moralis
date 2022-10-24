import React from 'react'
import { ConnectButton } from 'web3uikit'
import Link from 'next/link'

const Header: React.FC = () => {
    return (
        <nav className="bg-gray-50">
            <h1 className="text-2xl font-bold text-center pt-2 text-blue-400">
                NFT Marketplace
            </h1>
            <div className="flex justify-between items-center px-8 py-2 font-semibold text-lg text-blue-400">
                <div className="flex gap-6">
                    <Link href="/">
                        <a className="hover:border-b hover:border-black hover:scale-105">
                            NFT Marketplace
                        </a>
                    </Link>
                    <Link href="/sell-nft">
                        <a className="hover:border-b hover:border-black hover:scale-105">
                            Sell NFT
                        </a>
                    </Link>
                </div>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

export default Header
