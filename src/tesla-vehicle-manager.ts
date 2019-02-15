import { TeslaVehicleCommand } from './tesla-vehicle';
import { TeslaVehicleClient, TeslaVehicleDetails } from './tesla-vehicle';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { OAuthLoginDetails } from './oAuthClient';
import { saveToken } from './config';

/**
 * Logs you in to your Tesla account, and does things to your vehicles.
 */
export class TeslaVehicleManager implements TeslaVehicleClient {
	static fragments = {
		login: 'oauth/token?grant_type=password',
		refresh: 'oauth/token?grant_type=refresh_token'
	};

	static oAuthDetails = {
		clientId: '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384',
		clientSecret: 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3'
	};

	private _axiosClient: AxiosInstance;
	private _vehicleCache: Array<TeslaVehicleDetails> = [];

	constructor() {
		this._axiosClient = this._getAxiosInstance();
	}

	_getAxiosInstance() {
		const instance = axios.create({
			baseURL: 'https://owner-api.teslamotors.com/',
			headers: {
				'User-Agent': 'sullenumbra@gmail.com'
			}
		});

		instance.interceptors.request.use((requestConfig: AxiosRequestConfig) => {
			// convert the url from camel case to snake case
			if (requestConfig.url) {
				requestConfig.url = requestConfig.url.replace(/([A-Z])/g, (match) => `_${match[0].toLowerCase()}`);
			}

			// and then if there is request data, convert it all
			if (requestConfig.data) {
				const newObj: { [configDataKey: string]: { configDataValue: string } } = {};

				Object.getOwnPropertyNames(requestConfig.data).forEach((property) => {
					const snakeCaseProperty = property.replace(/([A-Z])/g, (match) => `_${match[0].toLowerCase()}`);
					newObj[snakeCaseProperty.toString()] = requestConfig.data[property];
				});

				requestConfig.data = newObj;
			}

			return requestConfig;
		});

		return instance;
	}

	async getBatteryLevels() {
		return Promise.all((await this.getVehicles()).map(({ id }) => this._getBatteryLevel(id)));
	}

	async getVehicles(): Promise<Array<TeslaVehicleDetails>> {
		if (!this._vehicleCache.length) {
			const { data: { response: vehicles } } = await this._axiosClient.get('');

			this._vehicleCache = vehicles.map(
				({ id_s, state, display_name }: { id_s: string; state: string; display_name: string }) => {
					return {
						id: id_s,
						state,
						name: display_name
					};
				}
			);
		}

		return this._vehicleCache;
	}

	async _refreshToken(token: string) {}

	async login(loginDetails: string | OAuthLoginDetails) {
		let savedToken: string;
		if (typeof loginDetails === 'string') {
			savedToken = loginDetails;
		} else {
			const { fragments: { login } } = TeslaVehicleManager;

			const { data: { access_token: token } } = await this._axiosClient.post(login, {
				...loginDetails,
				...TeslaVehicleManager.oAuthDetails,
				grantType: 'password'
			});

			savedToken = token;
		}

		if (!this._axiosClient.defaults.headers) {
			this._axiosClient.defaults.headers = {};
		}

		this._axiosClient.defaults.headers.Authorization = `Bearer ${savedToken}`;
		await saveToken(savedToken);
		this._axiosClient.defaults.baseURL += 'api/1/vehicles';

		const [ { id } ] = await this.getVehicles();

		this._axiosClient.defaults.baseURL += `/${id}/`;

		// const refreshTokenAxiosInstance = this._getAxiosInstance();
		// setInterval(async () => {
		// 	console.log('Refreshing.');

		// 	try {
		// 		const { data: { access_token: accessToken } } = await refreshTokenAxiosInstance.post(
		// 			TeslaVehicleManager.fragments.refresh,
		// 			{
		// 				...TeslaVehicleManager.oAuthDetails,
		// 				refreshToken: savedToken,
		// 				grantType: 'refresh_token'
		// 			}
		// 		);

		// 		savedToken = accessToken;
		// 		this._axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
		// 	} catch (e) {
		// 		console.log(e);
		// 	}
		// }, 6 * 1000);
	}

	async _getBatteryLevel(id: string) {
		const response = await this._axiosClient.get('data_request/charge_state');
		return response.data.response.battery_level;
	}

	async wake(): Promise<void> {
		await this._axiosClient.post('wakeUp', undefined, {
			timeout: 20000
		});
	}

	async issue(command: TeslaVehicleCommand) {
		await this._axiosClient.post(`command/${TeslaVehicleCommand[command]}`);
	}
}
