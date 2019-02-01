/**
 * An authenticator.
 */
export interface OAuthClient {
    /**
     * log in. Returns a bearer token.
     * @param loginDetails
     */
    login(loginDetails: OAuthLoginDetails): Promise<String>
} 

/**
 * Commands that a client may send to a Tesla car.
 */
export interface TeslaCommand {
    wakeUp(vehicleId: String): Promise<Boolean>
}

/**
 * The details required to receive an oauth token.
 */
export interface OAuthLoginDetails {
    /**
     * Your Tesla.com email.
     */
    email: String
    /**
     * Your Tesla.com password.
     */
    password: String
}
