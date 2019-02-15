jest.mock('axios');
jest.mock('./config', () => ({
	saveToken: jest.fn().mockResolvedValue('')
}));

import axios from 'axios';
import { TeslaVehicleManager } from './tesla-vehicle-manager';
import { OAuthLoginDetails } from './oAuthClient';

beforeEach(() => {
	(axios as any).mockClear();
});

describe('tesla oauth', () => {
	let testToken: string;
	let postMock: jest.MockInstance<any>;
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
				post: (postMock = jest.fn().mockResolvedValue({
					data: { access_token: (testToken = '1230912389127490asdf') },
					status: 200,
					statusText: 'success',
					headers: {},
					config: {}
				})),
				defaults: (axiosInstanceMockDefaults = {}),
				interceptors: {
					request: {
						use: jest.fn()
					},
					response: {
						use: jest.fn()
					}
				},
				baseUrl: ''
			});

			loginClient = new TeslaVehicleManager();

			jest.spyOn(loginClient, 'getVehicles').mockImplementation(() => [
				{
					id: '123',
					lastKnownState: '',
					name: ''
				}
			]);
		});

		it('should set the default Authorization header', async () => {
			const { oAuthDetails: { clientId, clientSecret } } = TeslaVehicleManager;
			await loginClient.login(loginDetails);

			expect(axiosInstanceMockDefaults.headers.Authorization).toEqual(`Bearer ${testToken}`);
			expect(postMock).toHaveBeenCalledWith(TeslaVehicleManager.fragments.login, {
				grantType: 'password',
				clientId,
				clientSecret,
				...loginDetails
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
				post: (postMock = jest.fn().mockRejectedValue(postError)),
				interceptors: {
					request: {
						use: jest.fn()
					},
					response: {
						use: jest.fn()
					}
				},
				defaults: {}
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
