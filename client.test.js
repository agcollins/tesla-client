jest.mock('axios')

const axios = require('axios')
const { TeslaOAuthClient } = require('./client')

const axiosInstanceMock = {
    post: jest.fn()
}

axios.create = jest.fn(() => (axiosInstanceMock))

beforeEach(() => {
    axios.mockClear()
    axios.create.mockClear();
})

describe('tesla authentication', () => {
    let loginClient, loginDetails

    beforeEach(() => {
        loginClient = new TeslaOAuthClient()
        loginDetails = {
            email: 'sullenumbra@gmail.com',
            clientSecret: 'asdf',
            clientId: 'hjkl',
            password: '1234'
        }
    })

    describe('getting a token', () => {
        it('should call the client by POSTing with the correct request body', () => {
            loginClient.login(loginDetails)

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
    })
})