import { TeslaVehicleClient } from './tesla-vehicle';
import { OAuthClient } from './oAuthClient';

export enum TeslaVehicleCommand {
	autoConditioningStart,
	autoConditioningStop
	// chargeStandard
	// remoteStartDrive,
	// honkHorn,
	// flashLights,
	// speedLimitSetLimit, //
	// speedLimitActivate,
	// speedLimitDeactivate,
	// speedLimitClearPin,
	// setValetMode,
	// resetValetPin, //?
	// doorUnlock,
	// doorLock,
	// actuateTrunk,
	// sunRoofControl, //?
	// chargePortDoorOpen,
	// chargePortDoorClose,
	// chargeStart,
	// chargeStop,
	// chargeMaxRange, //
	// setChargeLimit //
}
/**
 * Represents a Tesla vehicle.
 */
export interface TeslaVehicleClient extends OAuthClient {
	/**
     * Get the current charge level.
     * @returns a promise with the battery level as an integer.
     */
	getBatteryLevels(): Promise<Array<number>>;
	/**
     * Wake up the vehicle.
     * @returns a promise.
     */
	wake(): Promise<void>;
	/**
	 * Issue a command to the vehicle.
	 */
	issue(command: TeslaVehicleCommand): Promise<void>;
}
export interface TeslaVehicleDetails {
	id: string;
	lastKnownState: string;
	name: string;
}
