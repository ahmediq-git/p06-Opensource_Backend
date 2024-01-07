---
sidebar_position: 6
---

# Start Developing

Below we have developed a simple task manager app that utilizes the EZbase SDK to handle the backend.  
The Github repository for the app can be found in this [link](https://github.com/Zossima-F/task-manager-app).  
The link to the demonstartion of the app can be found on [YouTube](https://www.youtube.com/watch?v=NdL1LtEFIhg&ab_channel=Saad).  
For the purpose of this tutorial, we would only be working in the **App.js** file.

### Imports

First of all, we would be making some imports necessary for React, React Icons, and the EZbase SDK:
```js
import React, { useState } from 'react'
import { GiHornedHelm } from 'react-icons/gi'
import { GiChecklist } from "react-icons/gi";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
```

### Initialization

The backbone of any backend is the server and the database. Let's set up the connection with the EZbase server and initialze our collection named 'Tasks':

```js
const eb = new ezbase("http://0.0.0.0:3690");
eb.db.createCollection("tasks");
```

For this app, we would be using certain **react hooks** i.e., useState to manage states of some of our functional components. 

```js
function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  ...
```

### Add Tasks


Next up, we would first want to be able to add tasks to our collection 'Tasks', which we would accomplish using the **insertDoc** method:

```js
...
// add tasks
  const handleSubmit = (e) => {
    e.preventDefault()
    const response = eb.db.insertDoc("tasks", { "text": input, "completed": false })
      .then((id) => {
        const addTask = {
          id: id,
          text: input,
          completed: false
        }
        setTasks([...tasks, addTask])
        setInput('')
        console.log('task added. ID: ' + addTask.id)

      });

  }
  ...
```
Note that we have added a document with two fields, namely **text** (which describes the task) and **completed** (which keeps track whether the task has been completed or not). On the successful addition of the task, we are updating the current tasks using the setTasks hook, setting the task ID to the document ID, and validating the addition using a simple console.log (*Remember that insertDoc returns the ID of the added document on success).*

### Delete Tasks

```js
...
  // delete tasks
  const deleteTask = async (id) => {
    try {
      // Delete the task from the db
      await eb.db.deleteDoc("tasks", id);

      // Update the state with the remaining tasks
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      console.log('Task deleted. ID: ' + id);
      const res = eb.db.getAllDocs("tasks")
        .then((tasks) => {
          console.log("Updated Tasks: " + JSON.stringify(tasks));
        });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  ...
```
Also note that we are making use of the **getAllDocs** method to validate the deletion of the respective task.

### Toggle Task Completion

To toggle the task has complete or incomplete, we would first make a helper function to acquire the ID of the task we want to toggle:

```js
const getTaskById = (id) => {
    return tasks.find((task) => task.id === id);
  };
```
Next, we will use the **updateDoc** method to set the **completed** field of the respective document to true or false, depending on its previous state.

```js
...
// toggle completed task
  const toggleComplete = async (id) => {

    setTasks(
      tasks.map(task => (
        task.id === id ? { ...task, completed: !task.completed } : task
      ))
    )
    try {
      const foundTask = getTaskById(id);
      foundTask.completed = !foundTask.completed;
      await eb.db.updateDoc("tasks", id, { "text": foundTask.input, "completed": foundTask.completed });
      const res = eb.db.getAllDocs("tasks")
        .then((tasks) => {
          console.log("Updated Tasks: " + JSON.stringify(tasks));
        });
    }
    catch (error) {
      console.error('Error updating task:', error);
    }
  }
  ...
```
Again, we are making use of the **getAllDocs** method to validate the toggle of the respective task.
The rest of the code takes care of some basic styling and showcasing the Task Manager.
And we are done! See how ***easy*** that was? Keep following the EZbase development as we add more features for your ***ease*** *(Okay I'll stop now)*.