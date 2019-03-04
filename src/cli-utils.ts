import { TeslaOAuthClient } from './tesla-oauth-client';
import readline from 'readline';
import fs from 'fs';

/**
 * Prompt the user for a token, saves, and returns it. Otherwise, asks the user for email and password, then saves the token.
 * 
 * @returns the token as a promise
 */
export async function getToken(): Promise<string> {
	if (process.env.TESLA_TOKEN) return process.env.TESLA_TOKEN;
	const diskToken = await readTokenFromDisk();
	if (diskToken) return diskToken;

	let token;
	if (await question('Do you have a token?', true)) {
		token = (await question('What is it?')).toString();
	} else {
		token = await new TeslaOAuthClient().login({ email: await getUsername(), password: await getPassword() });
	}

	return await saveToken(token);
}

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
	// process.on('unhandledRejection', (e) => {
	// 	console.log(e);
	// 	if (!done) console.log('something really went wrong.');
	// 	done = true;
	// });
	// var i = 0;
	// var numSeconds = 1;
	// var done = false;
	// const interval: NodeJS.Timeout = setInterval(function() {
	// 	if (done) return clearInterval(interval);
	// 	// Insert a gap every 5
	// 	if (i++ % 5 === 0 && i > 1 && (i = 0)) {
	// 		console.log(`${numSeconds++} sec`);
	// 	}
	// 	console.log('.');
	// }, 200);
	// const val: any = await promise;
	// done = true;
	return promise;
}

const tokenFileName = '.tt';

const readTokenFromDisk = async (): Promise<string | undefined> =>
	new Promise((resolve) => {
		fs.readFile(tokenFileName, (err: NodeJS.ErrnoException, data: Buffer) => {
			if (!err) resolve(data.toString());
			else resolve();
		});
	});
async function getUsername(): Promise<string> {
	if (process.env.TESLA_USERNAME) {
		return process.env.TESLA_USERNAME;
	}
	return (await question('What is your username?')).toString();
}
async function getPassword(): Promise<string> {
	if (process.env.TESLA_PASSWORD) {
		return process.env.TESLA_PASSWORD;
	}
	return (await question('What is your password?')).toString();
}
async function saveToken(token: string): Promise<string> {
	return new Promise((resolve, reject) =>
		fs.writeFile(tokenFileName, token, (err: NodeJS.ErrnoException) => {
			if (!err) resolve(token);
			else reject(new Error(err.message));
		})
	);
}
