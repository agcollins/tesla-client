/**
 * An OAuth client.
 */
export interface OAuthClient {
	/**
   * log in. Returns a bearer token.
   * @param loginDetails the username / password or a string if you have a token already
   */
	login(loginDetails: OAuthLoginDetails | string): Promise<void>;
}

/**
 * The details required to log in and receive an OAuth token.
 */
export interface OAuthLoginDetails {
	/**
   * Your Tesla.com email.
   */
	email: string;
	/**
   * Your Tesla.com password.
   */
	password: string;
}
