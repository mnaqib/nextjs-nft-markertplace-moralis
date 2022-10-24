import React from 'react'

const Loader: React.FC = () => {
    return (
        <div className="overflow-hidden flex items-center justify-center fixed z-50 inset-0 outline-none focus:outline-none backdrop-blur-sm text-sm">
            <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin inline-block w-16 h-16 border-8 bg-transparent rounded-full text-[#C4C4C4]">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default Loader
