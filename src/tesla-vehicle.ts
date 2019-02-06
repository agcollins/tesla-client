/**
 * Represents a Tesla vehicle.
 */
export interface TeslaVehicle {
	/**
     * Get the current charge level
     */
	getBatteryLevel(): Promise<number>;
}
