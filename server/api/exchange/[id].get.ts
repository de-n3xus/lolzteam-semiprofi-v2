import axios from 'axios'
import apiConfig from '@/config/changer'

export default defineEventHandler(async (event) => {
    // 413b242bf1

    const resp = await axios.postForm(apiConfig.base_url + '/exchange/getexchangedata.php', {
        exchangeId: getRouterParam(event, 'id')
    }).catch(err => {
        setResponseStatus(event, 500)
        return {
            error: 'Internal server error'
        }
    })

    // @ts-ignore
    if (resp?.data?.data?.uniq_id === undefined) {
        setResponseStatus(event, 404)
        return {
            error: 'Exchange not found'
        }
    }

    return {
        // @ts-ignore
        data: resp?.data?.data
    }
})
