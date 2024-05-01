---
sidebar_position: 1
---

# Initialization

EZbase allows developers to take control of the backend using simple API calls through the client-side SDK in addition to the Admin UI.  
To use the latest version of the EZbase Javascript SDK, simply run the following command in your project directory terminal:  
```bash
npm i ezbase-ts
```
Make sure that you initialise Ezbase once in your project. Initialise it with your server url and use it throughout your application. In the example below, we initialise Ezbase with the server url `http://localhost:3690` and the socket url `http://localhost:3691`.

```js
import ezbase from "ezbase-ts";

const eb = new ezbase(`http://localhost:3690`, `http://localhost:3691`);
export default eb
```