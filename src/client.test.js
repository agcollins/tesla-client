jest.mock('axios')

const axios = require('axios')
const { TeslaOAuthClient } = require('./client')

beforeEach(() => {
    axios.mockClear()
})

describe('tesla oauth', () => {
    let loginClient, loginDetails
    const testToken = '1230912389127490asdf'

    beforeEach(() => {
        axios.create = jest.fn().mockReturnValue({ post: jest.fn(), defaults: {} })

        loginClient = new TeslaOAuthClient()
        loginDetails = {
            email: 'sullenumbra@gmail.com',
            password: '1234'
        }
    })

    describe('getting a token', () => {
        it('should call the client by POSTing with the correct request body', async () => {
            const postMock = axios.create.mock.results[0].value.post;
            postMock.mockResolvedValue({
                data: { access_token: testToken }
            })

            const actualToken = await loginClient.login(loginDetails)

            expect(actualToken).toEqual(testToken)
            expect(postMock).toHaveBeenCalledWith(
                TeslaOAuthClient.loginFragment, {
                    grant_type: TeslaOAuthClient.grantType,
                    email: loginDetails.email,
                    password: loginDetails.password,
                    client_id: TeslaOAuthClient.clientId,
                    client_secret: TeslaOAuthClient.clientSecret
                }
            )
        })

        it('should throw if the POST call fails', async () => {
            const postError = new Error('rejected!')
            axios.create.mock.results[0].value.post.mockRejectedValue(postError)
            loginClient = new TeslaOAuthClient()

            try {
                await loginClient.login(loginDetails)
            } catch (error) {
                expect(error).toEqual(postError)
            }
        })
    })
})