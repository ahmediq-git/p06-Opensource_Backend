
# Prototype Details

The project is split into three parts:

### 1. Server
The server is the main component and must be running to allow for proper working of the other components. Two ways can be used to run the server:
#### A. Cargo
Cargo is a package manager for rust. The install process is documented here: https://doc.rust-lang.org/cargo/getting-started/installation.html . The command "cargo run" in the server directory is used to start the server.
#### B. Rust binaries
We have uploaded two executable binaries to the releases section of the repository. The binary suitable for your OS can be downloaded and after moving to the directory where it is,  the command "{binary_name}" will start the server. Currently the binary is limited to Linux and Mac systems due to limitations with the zlib library that is core to the embedded database we utilize.
#### C. Containerized Solution
A Containerized server instance avoids any external library management problems however the creation of a Containerized server is a difficult task and hence is projected to be completed in the future.

#### Note: Running the server is currently limited to Linux and MAC machines. WSL can be used to run on Windows machines.  

### 2. SDK
The SDK is available at https://www.npmjs.com/package/ezbase and can be installed using npm i ezbase for use in any project. 

### 3. Admin UI 
Running the admin UI requires the following steps: 
* i) npm install -g pnpm
* ii) pnpm install
* iii) pnpm run dev

#### Note: The "deployment" of our project revolves around an executable which we have tried to provide for the server since that is the more difficult component to run. A demo video has also been uploaded to show the prototype.


