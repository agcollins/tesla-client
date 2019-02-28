import { TeslaVehicle, TeslaVehicleDetails, getAxiosInstance, TeslaVehicleCommand } from './tesla-vehicle';
import { AxiosInstance } from 'axios';

export const command = TeslaVehicleCommand;

/**
 * Logs you in to your Tesla account, and does things to your vehicles.
 */
export class TeslaVehicleManager implements TeslaVehicle {
	private _axiosClient: AxiosInstance;
	private _vehicleCache: Array<TeslaVehicleDetails> = [];

	static async getVehicle(token: string): Promise<TeslaVehicle> {
		do {
			try {
				return await new TeslaVehicleManager(token)._wakeVehicle();
			} catch (e) {}
		} while (true);
	}

	private constructor(token: string) {
		this._axiosClient = getAxiosInstance(token);
	}

	public async getBatteryLevel() {
		return (await this._axiosClient.get(`/${await this._getId()}/data_request/charge_state`)).data.response
			.battery_level;
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

	public async issue(command: TeslaVehicleCommand): Promise<void> {
		await this._axiosClient.post(`/${await this._getId()}/command/${TeslaVehicleCommand[command]}`);
	}

	private async _wakeVehicle(): Promise<TeslaVehicle> {
		await this._axiosClient.post(`/${await this._getId()}/wakeUp`);
		return this;
	}

	private async _getId() {
		return (await this.getVehicles())[0].id;
	}
}
