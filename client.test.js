jest.mock('axios')

const axios = require('axios')
const { TeslaOAuthClient } = require('./client')

beforeEach(() => {
    axios.mockClear()
})

describe('tesla oauth', () => {
    let loginClient, loginDetails

    beforeEach(() => {
        loginDetails = {
            email: 'sullenumbra@gmail.com',
            clientSecret: 'asdf',
            clientId: 'hjkl',
            password: '1234'
        }
    })

    describe('getting a token', () => {
        it('should call the client by POSTing with the correct request body', async () => {
            const accessToken = 'something'
            const axiosInstanceMock = {
                post: jest.fn(() => Promise.resolve({
                    data: { access_token: accessToken }
                }))
            }
            axios.create = jest.fn(() => (axiosInstanceMock))

            loginClient = new TeslaOAuthClient()

            const actualToken = await loginClient.login(loginDetails)

            expect(actualToken).toEqual(accessToken)
            expect(axiosInstanceMock.post).toHaveBeenCalledWith(
                TeslaOAuthClient.loginFragment, {
                    grant_type: 'password',
                    email: loginDetails.email,
                    password: loginDetails.password,
                    client_id: loginDetails.clientId,
                    client_secret: loginDetails.clientSecret
                }
            )
        })

        it('should throw if the POST call fails', async () => {
            const postError = new Error('rejected!')
            const axiosInstanceMock = { post: jest.fn(() => Promise.reject(postError)) }
            axios.create = jest.fn(() => axiosInstanceMock)
            loginClient = new TeslaOAuthClient()

            try {
                await loginClient.login(loginDetails)
            } catch (error) {
                expect(error).toEqual(postError)
            }
        })
    })
})