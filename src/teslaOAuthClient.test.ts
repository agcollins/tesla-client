// import { TeslaOAuthClient, oAuthDetails, fragments } from './teslaOAuthClient';
// import { OAuthLoginDetails } from './oAuthClient.d';
// import { instance } from './__mocks__/tesla-vehicle';

// jest.mock('./tesla-vehicle');

// describe('tesla oauth client', () => {
// 	let testToken: string;
// 	let loginDetails: OAuthLoginDetails;

// 	beforeEach(() => {
// 		testToken = 'asdf1234asdf';
// 		loginDetails = {
// 			email: 'sullenumbra@gmail.com',
// 			password: '1234'
// 		};
// 	});

// 	describe('login success', () => {
// 		beforeEach(() => instance.post.mockResolvedValueOnce({ data: { access_token: testToken } }));

// 		it('should return the token', async () => {
// 			expect(await new TeslaOAuthClient().login(loginDetails)).toEqual(testToken);
// 		});

// 		it('should call post with the right stuff', async () => {
// 			await new TeslaOAuthClient().login(loginDetails);

// 			expect(instance.post).toHaveBeenCalledWith(fragments.login, {
// 				...loginDetails,
// 				...oAuthDetails,
// 				grantType: 'password'
// 			});
// 		});
// 	});

// 	describe('login failure', () => {
// 		let postError: Error;

// 		beforeEach(() => instance.post.mockRejectedValueOnce((postError = new Error('this didnt work'))));

// 		it('should throw', async () => {
// 			try {
// 				await new TeslaOAuthClient().login(loginDetails);
// 			} catch (error) {
// 				expect(error).toEqual(postError);
// 			}
// 		});
// 	});
// });
