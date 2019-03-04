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

export interface TeslaVehicleDetails {
	id: string;
	lastKnownState: string;
	name: string;
}

export interface TeslaOwner {
	vehicles: TeslaVehicle[];
}

// this should be somewhere else, probably
export const getAxiosInstance = (token?: string) => {
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
