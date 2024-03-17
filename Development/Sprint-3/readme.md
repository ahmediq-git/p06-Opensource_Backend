Project: Opensource Backend
Team: 06

- 24100305 Abdul Wahab
- 24100121 Faraz Mansur Ahmad
- 24100012 Muhammad Saad
- 24100296 Moiz Raza Amir
- 24100085 Ahmed Mozammil Iqbal

SPRINT-3 SUBMISSION GUIDELINES

1. Properly tested working system deployed on an online hosting platform.
2. Code with readable comments uploaded in “Development/Sprint-3” folder of your project’s Github repository.
3. 3-4 minutes video that explains the functionality of your system developed so far. This must be uploaded in “Sprint-3” folder of your project’s Github repository.
4. Updated architecture and data model must be uploaded in the respective folders on Github.
5. Test case execution report.
6. Update project schedule.
7. This "Readme" file should be uploaded in Sprint-3 folder.



------------------------------------------------------------------------------------------------

LIST OF REQUIREMENTS COMPLETED IN THE SPRINT

1. File Creation/Deletion/Downloading and Viewing.
2. Create/Delete Indices on a collection.
3. Embedded Documents within a document
4. Lambda functions on database with ability to schedule them in time.
5. Realtime Database, Frontend, Backend and SDK
6. Stress Test Page for user to apply load on server and check response time, error rate.
7. Foreign Keys in a document
8. Generate Schema diagram acording to collections and their records.
9. Implementation of design pattern singleton of the database to speed up the database and overcome any faults in the system
10. Settings
11. Auth applied on the frontend and server (WIP).
12. Logs page to view requests in real time, as well as view past requests, data transfer sizes.

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
11. User Logs
12. Information website with Documentation (for the usecases completed so far)
13.	Start a Server to serve all the requests
14. Create an Admin, Delete an Admin through the UI
15. File Creation/Deletion/Downloading and Viewing.
16. Create Indexes on a collection.

17. Embedded Documents within a document
18. Lambda functions on database with ability to schedule them in time.
19. Realtime Database, Frontend, Backend and SDK
20. Stress Test Page for user to check load on server
21. Foreign Keys in a document
22. Generate Schema diagram acording to collections and their records.
23. Implementation of design pattern singleton of the database to speed up the database and overcome any faults in the system
24. Settings.
25. Auth applied on the frontend and server (WIP).
26. Logs page to view requests in real time, as well as view past requests.


------------------------------------------------------------------------------------------------

HOW TO ACCESS THE SYSTEM

1. The documentation site can be visited on http://ezbase.vercel.app
2. The SDK can be downloaded on npm repository on https://www.npmjs.com/package/ezbase-ts
3. The steps to use our system
    - Go to the server repository in Sprint 3
    - run bun i or pnpm i and then bun/pnpm run dev
    - Go to sdk folder run npm i and then npm run build
    - Go to frontend folder run pnpm i and then pnpm run dev

    In the next sprint the UI will be bundled with the server and when the server starts, the UI will also start on a separate port
* A deployment does exist at https://ezbase-frontend.vercel.app/ , However the backend is deployed on Koyeb which provides ephemeral disk storage
and may result in varying performance. Additionally realtime stuff is not possible due to the nature of the deployment platform and hence the 
page is not present on the deployed site. Also refrain from stress testing too much as heavy traffic may incur hosting costs. For file related
stuff please see the demo video as file storage on an actual deployed server is expensive.


------------------------------------------------------------------------------------------------



ADDITIONAL INFORMATION
