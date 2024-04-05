class AuthStore {
    token: string = '';
    user_id: string = '';
    STORAGE_KEY_TOKEN = 'authToken';
    STORAGE_KEY_ID = 'userId';


    // Saving the token to the store
    #persist(token: string, id:string): void {
        this.token = token || '';
        this.user_id = id || '';
        localStorage.setItem(this.STORAGE_KEY_TOKEN, this.token);
        localStorage.setItem(this.STORAGE_KEY_ID, this.user_id);
    }

    // Saves the token to the store from the HTTP response
    saveTokenFromResponse(data: any): void {
        console.log("data from server",data)
        const token: string =  data.token;
        const id: string = data.user._id;

        this.#persist(token,id);
        // console.log(jwtToken);
    }

    removeToken(): void {
        this.token = '';
        this.user_id = '';
        localStorage.removeItem(this.STORAGE_KEY_TOKEN);
        localStorage.removeItem(this.STORAGE_KEY_ID);
    }

    isAuthenticated(): boolean {
        
        if (this.token !== '') return true;

        return false;
    }
}

export default AuthStore;
