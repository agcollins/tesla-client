import axios, { AxiosInstance } from 'axios';
import { OAuthClient, OAuthLoginDetails } from './oAuthClient';

/**
 * Logs you in to your Tesla account.
 */
export class TeslaVehicleClient implements OAuthClient {
	static loginFragment = 'oauth/token?grant_type=password';
	static clientId = 'e4a9949fcfa04068f59abb5a658f2bac0a3428e4652315490b659d5ab3f35a9e';
	static clientSecret = 'c75f14bbadc8bee3a7594412c31416f8300256d7668ea7e6e7f06727bfb9d220';
	static grantType = 'password';

	private _axiosClient: AxiosInstance;

	constructor() {
		this._axiosClient = axios.create({
			baseURL: 'https://owner-api.teslamotors.com/',
			headers: {
				'User-Agent': 'sullenumbra@gmail.com'
			}
		});
	}

	async login(loginDetails: OAuthLoginDetails) {
		const { email, password } = loginDetails;
		const response = await this._axiosClient.post(TeslaVehicleClient.loginFragment, {
			grant_type: TeslaVehicleClient.grantType,
			client_id: TeslaVehicleClient.clientId,
			client_secret: TeslaVehicleClient.clientSecret,
			email,
			password
		});

		const token = response.data.access_token;

		if (!this._axiosClient.defaults.headers) {
			this._axiosClient.defaults.headers = {};
		}

		this._axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
	}
}
