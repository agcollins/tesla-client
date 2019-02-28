import { TeslaOAuthClient } from './teslaOAuthClient';
import { question } from './cli-utils';
import fs from 'fs';

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
export async function getToken(forcePrompt = false): Promise<string> {
	if (!forcePrompt) {
		if (process.env.TESLA_TOKEN) return process.env.TESLA_TOKEN;
		const diskToken = await readTokenFromDisk();
		if (diskToken) return diskToken;
		if (await question('Do you have a token?', true)) return await question('What is it?').toString();
	}
	return new TeslaOAuthClient().login({ email: await getUsername(), password: await getPassword() });
}
export async function saveToken(token: string): Promise<string> {
	return new Promise((resolve, reject) =>
		fs.writeFile(tokenFileName, token, (err: NodeJS.ErrnoException) => {
			if (!err) resolve(token);
			else reject(new Error(err.message));
		})
	);
}
