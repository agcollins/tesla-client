import { getOwner } from './tesla-vehicle-manager';
import { TeslaVehicleCommand, TeslaVehicle } from './tesla';
import { question, loader, getToken } from './cli-utils';

function getCommands(vehicle: TeslaVehicle) {
	return [
		() => loader(vehicle.getBatteryLevel()),
		...(Object.keys(TeslaVehicleCommand)
			.filter((lol) => parseInt(lol) >= 0)
			.map((command) => () => loader(vehicle.issue(Number(command)))) as any[])
	];
}

export const cli = async function() {
	console.log('Booting up...');
	const { vehicles: [ vehicle ] } = await getOwner(await getToken());
	const commands = getCommands(vehicle);
	let answerNumber = -1;

	let num = 0;
	const commandString = [ 'getCharge', ...Object.keys(TeslaVehicleCommand).filter((lol) => isNaN(parseInt(lol, 10))) ]
		.map((str) => `${++num}) ${str}`)
		.join('\n');

	console.log('Welcome to the Telsa cli.\nYou can:');
	console.log(`${commandString}\n${++num}) Exit`);

	do {
		answerNumber = Number(await question('?')) - 1;
		if ((!answerNumber && answerNumber !== 0) || answerNumber < 0 || answerNumber >= commands.length)
			return console.log('bye');
		let i = 0;
		while (true) {
			try {
				console.log((await commands[answerNumber]()) || 'success');
				break;
			} catch (e) {
				// if (++i > 10) break;
				console.log(e);
				console.log(++i);
			}
		}
	} while (true);
};

cli().then(() => process.exit());
