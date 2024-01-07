import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690")

test("Sign Up Test", async () => {
    expect.assertions(1);

    await expect(eb.auth.signUp("auth_test_signup@gmail.com", "12345678")).resolves.not.toThrow();
});


test("Sign in Test", async () => {
    expect.assertions(1);

    await expect(eb.auth.signIn("auth_test_signup@gmail.com", "12345678")).resolves.not.toThrow();
});


test("Sign out Test", async () => {
    // Use expect.assertions() to ensure that a certain number of assertions are called
    expect.assertions(1);

    await expect(eb.auth.signOut()).resolves.not.toThrow();
});
