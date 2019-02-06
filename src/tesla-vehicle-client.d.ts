import { OAuthClient } from './oAuthClient';
/**
 * Represents a Tesla vehicle.
 */
export interface TeslaVehicleClient extends OAuthClient {
	/**
     * Get the current charge level
     * @returns a promise with the battery level as an integer.
     */
	getBatteryLevels(): Promise<Array<number>>;
}

export interface TeslaVehicle {
	id: string;
	state: string;
	name: string;
}
