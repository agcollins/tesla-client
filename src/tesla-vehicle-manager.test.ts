jest.mock('axios');

import axios, { AxiosResponse } from 'axios';
import { TeslaVehicleManager } from './tesla-vehicle-manager';
import { OAuthLoginDetails } from './oAuthClient';

beforeEach(() => {
	(axios as any).mockClear();
});

describe('tesla oauth', () => {
	let testToken: string;
	let loginPostMock: any;
	let axiosInstanceMockDefaults: any;
	let loginClient: TeslaVehicleManager;
	let loginDetails: OAuthLoginDetails;

	beforeEach(() => {
		loginDetails = {
			email: 'sullenumbra@gmail.com',
			password: '1234'
		};
	});

	describe('login success', () => {
		beforeEach(() => {
			axios.create = jest.fn().mockReturnValue({
				post: (loginPostMock = jest.fn().mockResolvedValue({
					data: { access_token: (testToken = '1230912389127490asdf') },
					status: 200,
					statusText: 'success',
					headers: {},
					config: {}
				})),
				defaults: (axiosInstanceMockDefaults = {})
			});

			loginClient = new TeslaVehicleManager();
		});

		it('should set the default Authorization header', async () => {
			const { oAuthDetails: { grantType, clientId, clientSecret } } = TeslaVehicleManager;

			await loginClient.login(loginDetails);

			expect(axiosInstanceMockDefaults.headers.Authorization).toEqual(`Bearer ${testToken}`);
			expect(loginPostMock).toHaveBeenCalledWith(TeslaVehicleManager.fragments.login, {
				grant_type: grantType,
				email: loginDetails.email,
				password: loginDetails.password,
				client_id: clientId,
				client_secret: clientSecret
			});
		});

		it('should set the default Authorization header if the header object already exists', async () => {
			axiosInstanceMockDefaults.headers = {};

			await loginClient.login(loginDetails);

			expect(axiosInstanceMockDefaults.headers.Authorization).toEqual(`Bearer ${testToken}`);
		});
	});

	describe('login failure', () => {
		let postError: Error;

		beforeEach(() => {
			postError = new Error('rejected!');
			axios.create = jest.fn().mockReturnValue({
				post: (loginPostMock = jest.fn().mockRejectedValue(postError))
			});

			loginClient = new TeslaVehicleManager();
		});

		it('should throw', async () => {
			try {
				await loginClient.login(loginDetails);
			} catch (error) {
				expect(error).toEqual(postError);
			}
		});
	});
});
