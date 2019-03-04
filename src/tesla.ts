import { TeslaVehicle } from './tesla';
import axios, { AxiosRequestConfig } from 'axios';

export enum TeslaVehicleCommand {
	autoConditioningStart,
	autoConditioningStop,
	chargeStandard,
	remoteStartDrive,
	honkHorn,
	flashLights,
	speedLimitSetLimit, //
	speedLimitActivate,
	speedLimitDeactivate,
	speedLimitClearPin,
	setValetMode,
	resetValetPin, //?
	doorUnlock,
	doorLock,
	actuateTrunk,
	sunRoofControl, //?
	chargePortDoorOpen,
	chargePortDoorClose,
	chargeStart,
	chargeStop,
	chargeMaxRange, //
	setChargeLimit //
}
/**
 * Represents a Tesla vehicle.
 */
export interface TeslaVehicle {
	/**
     * Get the current charge level.
     * @returns a promise with the battery level as an integer.
     */
	getBatteryLevel(): Promise<number>;
	/**
	 * Issue a command to the vehicle.
	 */
	issue(command: TeslaVehicleCommand): Promise<TeslaVehicle>;
}

/** 
 * A Tesla owner. Has vehicles.
 * (or none, poor guy)
 */
export interface TeslaOwner {
	vehicles: TeslaVehicle[];
}

/**
 * Gets an Axios instance preconfigured to hit the Tesla apis, barring auth if you have no token.
 * @param token A token, if you have one
 */
export const getAxiosInstance = (token?: string) => {
	const instance = axios.create({
		baseURL: 'https://owner-api.teslamotors.com/',
		headers: {
			'User-Agent': 'sullenumbra@gmail.com'
		}
	});
	const toSnakeCase = (str: string) => str.replace(/([A-Z])/g, (match) => `_${match[0].toLowerCase()}`);

	instance.interceptors.request.use((requestConfig: AxiosRequestConfig) => {
		// convert the url from camel case to snake case
		if (requestConfig.url) {
			requestConfig.url = toSnakeCase(requestConfig.url);
		}
		// and then if there is request data, convert it all
		if (requestConfig.data) {
			const newObj: { [configDataKey: string]: { configDataValue: string } } = {};
			Object.getOwnPropertyNames(requestConfig.data).forEach((originalProperty) => {
				const snakeCasePropertyName = toSnakeCase(originalProperty).toString();
				newObj[snakeCasePropertyName] = requestConfig.data[originalProperty];
			});
			requestConfig.data = newObj;
		}
		return requestConfig;
	});

	// let numRetries = 1;
	// instance.interceptors.response.use(undefined, async (response: AxiosResponse) => {
	// 	if (response.request.res.socket._httpMessage.res.statusCode === 401) {
	// 		console.log(numRetries++);
	// 		const token = await getToken(true);
	// 		instance.defaults.headers = {
	// 			Authorization: `Bearer ${token}`
	// 		};
	// 		return instance(response.config);
	// 	}

	// 	throw response;
	// });

	if (token) {
		instance.defaults.headers = {
			Authorization: `Bearer ${token}`
		};

		instance.defaults.baseURL += 'api/1/vehicles';
	}

	return instance;
};
