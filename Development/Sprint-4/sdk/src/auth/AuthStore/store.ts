class AuthStore {
    #jwtToken: string = '';

    // Getting a JWT token
    get jwtToken(): string {
        return this.#jwtToken;
    }

    // Helper function to extract the JWT Token from the HTTP response
    #extractCookieFromRequest(httpResponse: any): string {
        return httpResponse.headers['set-cookie'][0];
    }

    // Saving the token to the store
    #persist(jwtToken: string): void {
        this.#jwtToken = jwtToken || '';
    }

    // Saves the token to the store from the HTTP response
    saveTokenFromResponse(httpResponse: any): void {
        const jwtToken: string = this.#extractCookieFromRequest(httpResponse);
        this.#persist(jwtToken);
        // console.log(jwtToken);
    }
}

export default AuthStore;
