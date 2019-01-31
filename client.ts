/**
 * An authenticator.
 */
interface Authenticator {
    /**
     * log in. Returns a bearer token.
     * @param username 
     * @param password 
     * @param clientId 
     * @param clientSecret 
     */
    login(username: String, password: String, clientId: String, clientSecret: String): String;
} 

/**
 * Logs you in to your Tesla account.
 */
class TeslaAuthenticator implements Authenticator {
    login(userName, password, clientId, clientString) { 
        const token = "5";

        

        return token;
    }
}