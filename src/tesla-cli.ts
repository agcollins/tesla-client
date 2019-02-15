import { TeslaVehicleCommand } from './tesla-vehicle';
import { question, loader, getTeslaVehicle } from './cli-utils';

export const cli = async function() {
	console.log('Booting up...');
	const client = await getTeslaVehicle();
	await loader(client.wake());
	const both: any[] = [
		() => loader(client.getBatteryLevels()),
		...(Object.keys(TeslaVehicleCommand).map((command) => () => loader(client.issue(Number(command)))) as any[])
	];
	while (true) {
		console.log('Welcome to the Telsa cli.\nYou can:');
		console.log(`1) See charge\n2) Start auto conditioning\n3) Stop auto conditioning\n4) Exit`);
		const answerNumber = Number(await question('?')) - 1;
		if (answerNumber >= both.length) return;
		console.log(await both[answerNumber]());
	}
};

cli().then(() => process.exit());
