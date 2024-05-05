import axios from 'axios'
import apiConfig from '@/config/changer'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (
        typeof body.send.amount === 'undefined'
        || typeof body.send.currency === 'undefined'
        || typeof body.send.network === 'undefined'
        || typeof body.receive.address === 'undefined'
        || typeof body.receive.currency === 'undefined'
        || typeof body.receive.network === 'undefined'
        || typeof body.receive.amount === 'undefined'
    ) {
        setResponseStatus(event, 400)
        return {
            error: 'Please, check all fields'
        }
    }

    const resp = await axios.postForm(apiConfig.base_url + '/exchange/createExchange.php', {
        coin_amount_from: body.send.amount,
        coin_amount_to: body.receive.amount,
        coin_from: body.send.currency,
        coin_network_from: body.send.network,
        coin_to: body.receive.currency,
        coin_network_to: body.receive.network,
        clientAdr: body.receive.address,
        // без этого не работаит(
        phoneNumber: '',
        sbpbank: 'sbpsber'
    }).catch(err => {
        setResponseStatus(event, 500)
        return {
            error: 'Internal server error'
        }
    })

    // @ts-ignore
    if (typeof resp?.data?.error === 'string') {
        setResponseStatus(event, 400)
        return {
            // @ts-ignore
            error: resp?.data?.error
        }
    }

    return {
        // @ts-ignore
        data: resp?.data
    }
})
