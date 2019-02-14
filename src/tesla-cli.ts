import { doCli } from './cli-utils';
import { TeslaVehicleManager } from './tesla-vehicle-manager';
import { getUsername, getPassword, getToken } from './config';

export const cli = async function() {
	const client = new TeslaVehicleManager();
	const token = await getToken();

	if (token) {
		await client.login(token);
	} else {
		await client.login({ email: await getUsername(), password: await getPassword() });
	}

	// console.clear();
	console.log('Booting up...');

	// while (true) {
	// for (let i = 0; i < 10; ++i) {
	await doCli(client);
	// }

	// const answer = await question("Sorry. We couldn't connect to your car. Want to try again?", true);
	// if (answer === false) {
	// 	return console.log('Bye.');
	// }
	// }
};

cli().then(() => process.exit());
