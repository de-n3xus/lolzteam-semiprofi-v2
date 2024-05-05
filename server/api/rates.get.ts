import axios, {AxiosResponse} from "axios";
import apiConfig from "@/config/changer"

export default defineEventHandler(async (event) => {
    const resp = await axios.get(apiConfig.base_url + '/info/rates.json', {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    }).catch(err => {
        console.error(err)
        return {
            error: true
        }
    })

    return {
        error: false,
        // @ts-ignore
        data: resp?.data
    }
})