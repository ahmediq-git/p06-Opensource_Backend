class AuthStore {
    #jwtToken='';

    // getting a JWT token
    get jwtToken() {
        return this.#jwtToken;
    }
    
    // helper function to extract the jwt Token from the http Request
    #extractCookieFromRequest(httpResponse){
        return httpResponse.headers['set-cookie'][0];
    }

    // saving the token to the store
    #persist(jwtToken) {
        this.#jwtToken = jwtToken||'';
    }

    // saves the Token to the store from the http Response
    saveTokenFromResponse(httpResponse){
        const jwtToken = this.#extractCookieFromRequest(httpResponse);
        this.#persist(jwtToken);
        // console.log(jwtToken);
    }
}

export default AuthStore;