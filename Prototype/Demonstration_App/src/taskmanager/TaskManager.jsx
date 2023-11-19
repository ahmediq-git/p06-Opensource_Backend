import { useState } from 'react'
import { GiHornedHelm } from 'react-icons/gi'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
import ezbase from 'ezbase'
const eb = new ezbase("http://127.0.0.1:3690");
eb.database.deleteCollection("tasks"); // as the auth has not been implemented, so deleting the pre-made collection
eb.database.createCollection("tasks");

export default function TaskManager() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')

  // add tasks
  const handleSubmit = (e) => {
    e.preventDefault()
    const response = eb.database.insertDoc("tasks", { "text": input, "completed": false })
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

  // delete tasks
  const deleteTask = async (id) => {
    try {
      // Delete the task from the database
      await eb.database.deleteDoc("tasks", id);

      // Update the state with the remaining tasks
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      console.log('Task deleted. ID: ' + id);
      const res = eb.database.getAllDocs("tasks")
        .then((tasks) => {
          console.log("Updated Tasks: " + JSON.stringify(tasks));
        });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getTaskById = (id) => {
    return tasks.find((task) => task.id === id);
  };

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
      console.log(foundTask);
      await eb.database.updateDoc("tasks", id, { "text": foundTask.input, "completed": foundTask.completed });
      const res = eb.database.getAllDocs("tasks")
        .then((tasks) => {
          console.log("Updated Tasks: " + JSON.stringify(tasks));
        });
    }
    catch (error) {
      console.error('Error updating task:', error);
    }
  }

  const date = new Date()
  // console.log(date)
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


  return (
    <div className='app'>
      <div className="container">
        <h1><GiHornedHelm /> Task Manager</h1>

        <div className="date">
          <p>{days[date.getDay()]}</p>
          <p>{date.getDate()},</p>
          <p>{months[date.getMonth()]}</p>
          <p>{date.getFullYear()}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-input">
            <AiOutlinePlus className='icon' />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Enter a task'
              type="text" />
          </div>
        </form>

        <div>
          {tasks.map(task => (
            <div className={`task-row ${task.completed ? 'completed' : ''}`} key={task.id} onDoubleClick={() => toggleComplete(task.id)} >
              <p>{task.text} </p>
              <AiOutlineClose onClick={() => deleteTask(task.id)} className='icon' />
            </div>
          ))}
        </div>

        <p className='length'>{(tasks < 1) ? 'You have no tasks' : `Tasks: ${tasks.length}`}</p>
      </div>
    </div>
  );
}
