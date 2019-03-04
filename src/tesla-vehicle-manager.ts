import { TeslaVehicle, TeslaVehicleDetails, getAxiosInstance, TeslaVehicleCommand, TeslaOwner } from './tesla';
import { AxiosInstance } from 'axios';

export const command = TeslaVehicleCommand;

export async function getOwner(token: string): Promise<TeslaOwner> {
	const client = getAxiosInstance(token);
	const { data: { response: vehicleData } } = await client.get('');

	const vehicles: Promise<
		TeslaVehicle
	>[] = vehicleData.map(({ id_s, state, display_name }: { id_s: string; state: string; display_name: string }) =>
		TeslaVehicleImpl.create(client, {
			id: id_s,
			name: display_name,
			lastKnownState: state
		})
	);

	return {
		vehicles: await Promise.all(vehicles)
	};
}

/**
 * Logs you in to your Tesla account, and does things to your vehicles.
 */
export class TeslaVehicleImpl implements TeslaVehicle {
	private constructor(private _client: AxiosInstance, private _details: TeslaVehicleDetails) {}

	public static async create(client: AxiosInstance, detail: TeslaVehicleDetails): Promise<TeslaVehicle> {
		const vehicle = new TeslaVehicleImpl(client, detail);
		while (true)
			try {
				return await vehicle._wake();
			} finally {
			}
	}

	public async getBatteryLevel() {
		return (await this._client.get(`/${await this._getId()}/data_request/charge_state`)).data.response
			.battery_level;
	}

	public async issue(command: TeslaVehicleCommand): Promise<TeslaVehicle> {
		await this._client.post(`/${await this._getId()}/command/${TeslaVehicleCommand[command]}`);
		return this;
	}

	private async _wake(): Promise<TeslaVehicle> {
		await this._client.post(`/${await this._getId()}/wakeUp`);
		return this;
	}

	private async _getId() {
		return this._details.id;
	}
}
