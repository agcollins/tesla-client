import axios, { AxiosInstance } from 'axios';
import { OAuthClient, OAuthLoginDetails } from './oAuthClient';
import { TeslaVehicle } from './tesla-vehicle';

/**
 * Logs you in to your Tesla account, and does things to your vehicles.
 */
export class TeslaVehicleClient implements OAuthClient, TeslaVehicle {
	static fragments = {
		login: 'oauth/token?grant_type=password',
		getBatteryLevel: (id: string | number) => `vehicles/${id}/data_request/charge_state`,
		getVehicles: `vehicles`,
		wake: (id: string | number) => `vehicles/${id}/commands/wake`
	};

	static oAuthDetails = {
		clientId: 'e4a9949fcfa04068f59abb5a658f2bac0a3428e4652315490b659d5ab3f35a9e',
		clientSecret: 'c75f14bbadc8bee3a7594412c31416f8300256d7668ea7e6e7f06727bfb9d220',
		grantType: 'password'
	};

	private _axiosClient: AxiosInstance;
	private _loggedIn = false;

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
		const { oAuthDetails: { grantType, clientId, clientSecret } } = TeslaVehicleClient;
		const response = await this._axiosClient.post(TeslaVehicleClient.fragments.login, {
			grant_type: grantType,
			client_id: clientId,
			client_secret: clientSecret,
			email,
			password
		});

		const token = response.data.access_token;

		if (!this._axiosClient.defaults.headers) {
			this._axiosClient.defaults.headers = {};
		}

		this._axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
		this._loggedIn = true;

		this._axiosClient.defaults.baseURL += 'api/1/';
	}

	async getBatteryLevel() {
		const [ { id } ] = await this.getVehicles();
		const { data: { response: { battery_level } } } = await this._axiosClient.get(
			TeslaVehicleClient.fragments.getBatteryLevel(id)
		);

		return battery_level;
	}

	async getVehicles(): Promise<Array<{ id: string; state: string; name: string }>> {
		const { data: { response: vehicles } } = await this._axiosClient.get(TeslaVehicleClient.fragments.getVehicles);

		return vehicles.map(({ id_s, state, display_name }: { id_s: string; state: string; display_name: string }) => {
			return {
				id: id_s,
				state,
				name: display_name
			};
		});
	}

	async _wake(): Promise<void> {
		const [ { id } ] = await this.getVehicles();

		await this._axiosClient.post(TeslaVehicleClient.fragments.wake(id));
	}
}
