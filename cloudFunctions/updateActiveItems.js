Moralis.Cloud.afterSave('ItemListed', async (req) => {
    const confirmed = req.object.get('confirmed')
    const logger = Moralis.Cloud.getLogger()
    logger.info('Looking for confirmed Tx')

    if (confirmed) {
        logger.info('Found item')
        const ActiveItem = Moralis.Object.extend('ActiveItem')

        const query = new Moralis.Query(ActiveItem)

        query.equalTo('marketplaceAddress', req.object.get('address'))
        query.equalTo('nftAddress', req.object.get('nftAddress'))
        query.equalTo('tokenId', req.object.get('tokenId'))
        query.equalTo('seller', req.object.get('seller'))

        const alreadyListed = await query.first()

        if (alreadyListed) {
            logger.info(`Deleting already listed....`)

            await alreadyListed.destroy()

            logger.info(
                `Deleted with TokenId: ${req.object.get(
                    'tokenId'
                )} at Address: ${req.object.get('address')}`
            )
        }

        const activeItem = new ActiveItem()

        activeItem.set('marketplaceAddress', req.object.get('address'))
        activeItem.set('nftAddress', req.object.get('nftAddress'))
        activeItem.set('price', req.object.get('price'))
        activeItem.set('tokenId', req.object.get('tokenId'))
        activeItem.set('seller', req.object.get('seller'))

        logger.info(
            `Adding Address: ${req.object.get(
                'address'
            )} \n TokenId: ${req.object.get('tokenId')}`
        )

        logger.info('saving...')
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave('ItemCancelled', async (req) => {
    const confirmed = req.object.get('confirmed')
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${req.object}`)

    if (confirmed) {
        const ActiveItem = Moralis.Object.extend('ActiveItem')
        const query = new Moralis.Query(ActiveItem)

        query.equalTo('marketplaceAddress', req.object.get('address'))
        query.equalTo('nftAddress', req.object.get('nftAddress'))
        query.equalTo('tokenId', req.object.get('tokenId'))

        logger.info(`Marketplace | Query: ${query}`)

        const canceledItem = await query.first()
        logger.info(`Marketplace | CanceledItem: ${canceledItem}`)

        if (canceledItem) {
            logger.info(
                `Deleting TokenId: ${req.object.get(
                    'tokenId'
                )} at Address: ${req.object.get('address')}`
            )
            await canceledItem.destroy()
        } else {
            logger.info(
                `No item found with Address: ${req.object.get(
                    'address'
                )} \n TokenId: ${req.object.get('tokenId')} `
            )
        }
    }
})

Moralis.Cloud.afterSave('ItemBought', async (req) => {
    const confirmed = req.object.get('confirmed')
    const logger = Moralis.Cloud.getLogger()

    logger.info(`Marketplace | Object: ${req.object}`)

    if (confirmed) {
        const ActiveItem = Moralis.Object.extend('ActiveItem')

        const query = new Moralis.Query(ActiveItem)

        query.equalTo('marketplaceAddress', req.object.get('address'))
        query.equalTo('nftAddress', req.object.get('nftAddress'))
        query.equalTo('tokenId', req.object.get('tokenId'))

        logger.info(`Marketplace | Query: ${query}`)

        const boughtItem = await query.first()

        if (boughtItem) {
            logger.info(
                `Deleting TokenId: ${req.object.get(
                    'tokenId'
                )} at Address: ${req.object.get('address')}`
            )
            await boughtItem.destroy()
        } else {
            logger.info(
                `No item found with Address: ${req.object.get(
                    'address'
                )} \n TokenId: ${req.object.get('tokenId')} `
            )
        }
    }
})
