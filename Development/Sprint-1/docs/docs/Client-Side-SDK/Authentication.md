---
sidebar_position: 3
---

# Authentication

### User Sign-Up
To sign up a new user.
```js
import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
eb.auth.signUp("username@email.com", "password")
```

### User Sign-In
To sign in an existing user.
```js
import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
eb.auth.signIn("username@email.com", "password")
```

### User Sign-Out
To sign out an existing user.
```js
import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
eb.auth.signOut()
```

