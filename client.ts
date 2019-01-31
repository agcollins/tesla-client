import axios, { AxiosInstance } from 'axios'
import { OAuthClient, OAuthLoginDetails } from './client.d'

/**
 * Logs you in to your Tesla account.
 */
export class TeslaOAuthClient implements OAuthClient {
    static baseURL = 'https://owner-api.teslamotors.com/'
    static loginFragment = '/oauth/token?grant_type=password'
    private _axiosClient: AxiosInstance

    constructor() {
        this._axiosClient = axios.create({
            baseURL: TeslaOAuthClient.baseURL,
            headers: {
                'User-Agent': 'sullenumbra@gmail.com'
            }
        })
    }
    
    async login(loginDetails: OAuthLoginDetails) {
        const { clientId, clientSecret, email, password } = loginDetails
        const response = await this._axiosClient.post(TeslaOAuthClient.loginFragment, {
            grant_type: 'password',
            client_id: clientId,
            client_secret: clientSecret,
            email,
            password
        })

        return response.data.access_token
    }
}