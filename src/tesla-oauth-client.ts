import { OAuthLoginDetails, OAuthClient } from './oauth-client';
import { getAxiosInstance } from './tesla';

export const fragments = {
	login: 'oauth/token?grant_type=password',
	refresh: 'oauth/token?grant_type=refresh_token'
};

export const oAuthDetails = {
	clientId: '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384',
	clientSecret: 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3'
};

/**
 * A Tesla OAuth client.
 */
export class TeslaOAuthClient implements OAuthClient {
	async login(loginDetails: OAuthLoginDetails) {
		const axiosInstance = getAxiosInstance();
		const loginResponse = await axiosInstance.post(fragments.login, {
			...loginDetails,
			...oAuthDetails,
			grantType: 'password'
		});
		return loginResponse.data.access_token;
	}
}
