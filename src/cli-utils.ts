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
	var done = false;
	(function showSpinner() {
		var i = 0;
		var numSeconds = 1;
		setInterval(function() {
			if (done) {
				return;
			}

			if (i++ % 5 === 0 && i > 1) {
				i = 0;
				console.log(`${numSeconds++} sec`);
			}
			console.log('.');
		}, 200);
	})();

	try {
		await client.wake();
		done = true;

		let promptString = 'What do you want to do?';

		const options = [ () => client.getBatteryLevels() ];
		const commands = Object.keys(TeslaVehicleCommand).map((command) => () => client.issue(Number(command)));

		while (true) {
			console.log('Welcome to the Telsa cli.\nYou can:');
			console.log(`1) See charge\n2) Start auto conditioning\n3) Stop auto conditioning\n4) Exit`);

			const answer = await question(promptString);
			promptString = '?';
			let answerNumber = Number(answer);
			if (answerNumber) {
				--answerNumber;
			}

			if (answerNumber < options.length) console.log(await options[answerNumber]());
			else if (answerNumber < options.length + Math.floor(commands.length / 2))
				await commands[answerNumber - options.length]();
			else return;
		}
	} catch (e) {
		console.log(e.toString());
	} finally {
		done = true;
	}
};
