import axios, { AxiosInstance } from 'axios'
import { OAuthClient, OAuthLoginDetails } from './client.d'

/**
 * Logs you in to your Tesla account.
 */
export class TeslaOAuthClient implements OAuthClient {
    static baseURL = 'https://owner-api.teslamotors.com/'
    static loginFragment = '/oauth/token?grant_type=password'
    static clientId = 'e4a9949fcfa04068f59abb5a658f2bac0a3428e4652315490b659d5ab3f35a9e'
    static clientSecret = 'c75f14bbadc8bee3a7594412c31416f8300256d7668ea7e6e7f06727bfb9d220'
    static grantType = 'password'
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
        const { email, password } = loginDetails
        const response = await this._axiosClient.post(TeslaOAuthClient.loginFragment, {
            grant_type: TeslaOAuthClient.grantType,
            client_id: TeslaOAuthClient.clientId,
            client_secret: TeslaOAuthClient.clientSecret,
            email,
            password
        })

        return response.data.access_token
    }
}