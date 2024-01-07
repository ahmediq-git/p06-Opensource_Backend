Project: Opensource Backend in Rust
Team: 06

- 24100305 Abdul Wahab
- 24100121 Faraz Mansur Ahmad
- 24100012 Muhammad Saad
- 24100296 Moiz Raza Amir
- 24100085 Ahmed Mozammil Iqbal

SPRINT-1 SUBMISSION GUIDELINES

1. Properly tested working system deployed on an online hosting platform.
2. Code with readable comments uploaded in “Development/Sprint-1” folder of your project’s Github repository.
3. 3-4 minutes video that explains the functionality of your system developed so far. This must be uploaded in “Sprint-1” folder of your project’s Github repository.
4. Updated architecture and data model must be uploaded in the respective folders on Github.
5. Test case execution report. 
6. Update project schedule.  
7. This "Readme" file should be uploaded in Sprint-1 folder. 



------------------------------------------------------------------------------------------------

LIST OF REQUIREMENTS COMPLETED IN THE SPRINT

1. Create a user with username and password through API and UI
2. Log in/out user
3. User Logs (Partially)
4. Information website with Documentation (for the usecases completed so far)
5. Create an Admin, Delete an Admin through the UI (Partially)

------------------------------------------------------------------------------------------------


LIST OF REQUIREMENTS COMPLETED SO FAR

1.	Create a record through the API and UI
2.	Update a record through the API and UI
3.	Delete a record through the API and UI
4.	Read a record through the API and UI
5.  Read a list of records through the API and UI
6.	Create a collection through the API and UI
7.	Delete a collection through the API and UI
8.  Create and remove an index on a collection through the UI
9.  Create a user with username and password through API and UI
10. Log in/out user
11. User Logs (Partially)
12. Information website with Documentation (for the usecases completed so far)
13.	Start a Server to serve all the requests
14. Create an Admin, Delete an Admin through the UI (Partially)




------------------------------------------------------------------------------------------------

HOW TO ACCESS THE SYSTEM

1. The documentation site can be visited on ezbase.vercel.app
2. The SDK can be downloaded on npm repository on https://www.npmjs.com/package/ezbase
3. The server will be downloadable from the documentation site in the upcoming sprints (we have had issues with making an executable for windows. Linux and mac executables are done), however for it can be run be following the steps below:
    - Go to the server repository in Sprint 1
    - Execute cargo run on the terminal to start the server
4. The UI can also be locally accessed and run by following the steps below:
    - In frontend directory, execute pnpm i
    - Then execute pnpm run dev on the terminal to start the UI

    In the upcoming sprints the UI will be bundled with the server and when the server starts, the UI will also start on a separate port




------------------------------------------------------------------------------------------------



ADDITIONAL INFORMATION

1. The tests for the SDK are in the Testing folder. The automatic tests for sdk use Jest and are in sdk-automatic-tests. For development we use skd-manual-development tests
2. The test reports can be viewed at a glance on p06_TestingReport in this same folder.
3. The SDK Test Case Report can be viewed on sdk-test-report.html clearly 
4. The tests for the server are in the apis folder. Use cargo -- --test-threads=1 to run. The test report is also in the server folder.
5. Due to the nature of our project, and the backend language Rust, we are still working on making executables for the server and bundling the UI with it. It will be complete in the upcoming sprints.
