import { TeslaVehicleManager } from './tesla-vehicle-manager';
import readline from 'readline';
import { getToken, getUsername, getPassword } from './config';
import { TeslaVehicleClient } from './tesla-vehicle';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
/**
 * Ask a question to the user, and get an answer. It can also enforce yes/no answers optionally.
 * @param str the question, to which a space is added before the user input.
 * @param yesNo if it's true we'll check that they answered yes or no, and will keep asking until
 * they respond with a yes-like or no-like answer.
 */
export const question = async function(str: string, yesNo?: boolean): Promise<string | boolean> {
	return new Promise((resolve) => {
		rl.question(`${str} `, (answer: any) => {
			if (!yesNo) {
				resolve(answer);
			} else if (/^\s*y(es)?\s*$/i.test(answer)) {
				resolve(true);
			} else if (/^\s*no?\s*$/i.test(answer)) {
				resolve(false);
			} else {
				resolve(question('What?', true));
			}
		});
	});
};
/**
 * Show a loading thing
 * @param promise a promise to wait to finish. propagates the promise.
 * @returns the promise
 */
export async function loader<T>(promise: Promise<T>): Promise<T> {
	process.on('unhandledRejection', (e) => {
		console.log(e);
		if (!done) console.log('something really went wrong.');
		done = true;
	});
	var i = 0;
	var numSeconds = 1;
	var done = false;
	const interval: NodeJS.Timeout = setInterval(function() {
		if (done) return clearInterval(interval);
		// Insert a gap every 5
		if (i++ % 5 === 0 && i > 1 && (i = 0)) {
			console.log(`${numSeconds++} sec`);
		}
		console.log('.');
	}, 200);
	const val: any = await promise;
	done = true;
	return val;
}
export const getTeslaVehicle = async () => {
	const client: TeslaVehicleClient = new TeslaVehicleManager();
	return (
		await client.login((await getToken()) || { email: await getUsername(), password: await getPassword() }), client
	);
};
