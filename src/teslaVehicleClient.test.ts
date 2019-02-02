jest.mock('axios');

import axios from 'axios';
import { TeslaVehicleClient } from './teslaVehicleClient';
import { OAuthLoginDetails } from './oAuthClient';

beforeEach(() => {
	(axios as any).mockClear();
});

describe('tesla oauth', () => {
	describe('login', () => {
		const testToken = '1230912389127490asdf';

		let loginPostMock: any;
		let axiosInstanceMockDefaults: any;
		let loginClient: TeslaVehicleClient;
		let loginDetails: OAuthLoginDetails;

		beforeEach(() => {
			axios.create = jest
				.fn()
				.mockReturnValue({ post: (loginPostMock = jest.fn()), defaults: (axiosInstanceMockDefaults = {}) });

			loginClient = new TeslaVehicleClient();
			loginDetails = {
				email: 'sullenumbra@gmail.com',
				password: '1234'
			};
		});

		it('should set the default Authorization header if the POST call resolves', async () => {
			loginPostMock.mockResolvedValue({
				data: { access_token: testToken }
			});

			await loginClient.login(loginDetails);

			expect(axiosInstanceMockDefaults.headers.Authorization).toEqual(`Bearer ${testToken}`);
			expect(loginPostMock).toHaveBeenCalledWith(TeslaVehicleClient.loginFragment, {
				grant_type: TeslaVehicleClient.grantType,
				email: loginDetails.email,
				password: loginDetails.password,
				client_id: TeslaVehicleClient.clientId,
				client_secret: TeslaVehicleClient.clientSecret
			});
		});

		it('should throw if the POST call rejects', async () => {
			const postError = new Error('rejected!');
			loginPostMock.mockRejectedValue(postError);

			loginClient = new TeslaVehicleClient();

			try {
				await loginClient.login(loginDetails);
			} catch (error) {
				expect(error).toEqual(postError);
			}
		});
	});
});
