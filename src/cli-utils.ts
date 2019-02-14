import { TeslaVehicleClient, TeslaVehicleCommand } from './tesla-vehicle';
import readline from 'readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/**
 * Ask a question to the user, and get an answer. It can also check for yes/no answers optionally.
 * @param str the question, to which a space is added before the user input.
 * @param yesNo if it's true we'll check that they answered yes or no, and return a Promise of boolean or
 * undefined if they didn't answer a yes-y or no-y answer.
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

export const doCli = async function(client: TeslaVehicleClient) {
	// console.clear();
	let done = false;
	(function showSpinner() {
		setInterval(function() {
			if (done) {
				return;
			}
			console.log('..');
		}, 10);
	})();

	await client.wake();

	done = true;

	let promptString = 'What do you want to do?';
	while (true) {
		// console.clear();
		console.log('Welcome to the Telsa cli.\nYou can:');
		console.log(`1) See charge\n2) Start auto conditioning\n3) Stop auto conditioning\n4) Exit`);

		const answer = await question(promptString);
		promptString = '?';

		try {
			switch (answer) {
				case '1': {
					const [ level ] = await client.getBatteryLevels();

					console.log(`Your vehicle is ${JSON.stringify(level)}% charged`);
					break;
				}

				case '2': {
					await client.issue(TeslaVehicleCommand.autoConditioningStart);
					break;
				}

				case '3': {
					await client.issue(TeslaVehicleCommand.autoConditioningStop);

					break;
				}

				case '4': {
					return console.log('Come back soon.');
				}

				default: {
					console.log('Woops!');
				}
			}
		} catch (e) {
			console.log(e.toString());
		}
	}
};
