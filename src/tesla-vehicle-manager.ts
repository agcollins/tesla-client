import { TeslaVehicle, getAxiosInstance, TeslaVehicleCommand, TeslaOwner } from './tesla';
import { AxiosInstance } from 'axios';

export const command = TeslaVehicleCommand;

/**
 * Tesla vehicle details
 */
interface TeslaVehicleDetails {
	id: string;
	lastKnownState: string;
	name: string;
}

/**
 * Returns a Tesla owner given its token
 * @param token The owner's login token
 * @returns the owner as a promise
 */
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
 * A Tesla vehicle.
 */
class TeslaVehicleImpl implements TeslaVehicle {
	private constructor(private _client: AxiosInstance, private _details: TeslaVehicleDetails) {}

	/**
	 * Create a Tesla vehicle which has been woken up.
	 * @param client axios client
	 * @param detail the vehicle's details
	 */
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
