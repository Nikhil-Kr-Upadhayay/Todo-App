import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './todo_list.css';
import todoImage from "./../../image/todo.png";
import { useNavigate } from 'react-router-dom';
import AddTodo from './AddTodo';
import { useDisclosure } from '@chakra-ui/react';

const TodoList = () => {
  // State variables
  const [tasks, setTasks] = useState([]); // Holds the list of tasks
  const [inputValue, setInputValue] = useState(''); // Holds the value of the input field
  const [filter, setFilter] = useState(localStorage.getItem('filter')); // Holds the current filter type
  const [isLoading, setIsLoading] = useState(false); // Indicates whether the data is being loaded
  const [editTaskId, setEditTaskId] = useState(null); // Holds the ID of the task being edited
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));
  const [error, setError] = useState('');
  const [sorting, setSorting] = useState(localStorage.getItem('sorting'));
  const [sortingType, setSortingType] = useState(localStorage.getItem('sortingType'));
  // const [filteredTask, setFilteredTask] = useEffect([]);


  // Fetch initial data
  useEffect(() => {
    fetchTodos();
    let setfilter = JSON.parse(localStorage.getItem('filter'));
    if (filter !== setfilter) setFilter(setfilter);
  }, [isOpen]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('loggedInUser')) == null) navigate('/');
  }, [])

  useEffect(() => {
    handleSortingFunction();
  }, [sorting, sortingType])


  const handleSortingFunction = () => {
    if (sorting === 'status' && sortingType === 'asc') {
      tasks.sort((a, b) => {
        // Sort in ascending order by "status" (false first, true last)
        if (a.completed === b.completed) {
          return 0;
        } else if (a.completed === false) {
          return -1;
        } else {
          return 1;
        }
      });
    } else if (sorting === 'status' && sortingType === 'desc') {
      tasks.sort((a, b) => {
        // Sort in descending order by "status" (true first, false last)
        if (a.completed === b.completed) {
          return 0;
        } else if (a.completed === false) {
          return 1; // Reverse the comparison for "false"
        } else {
          return -1; // Reverse the comparison for "true"
        }
      });
    } else if (sorting === 'dueDate' && sortingType === 'asc') {
      tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else {
      tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    }
  }

  // Fetch todos from an API
  const fetchTodos = async () => {
    const todos = JSON.parse(localStorage.getItem('allTasks'));

    if (todos && user) {
      let filterTask = todos.filter((item) => item.user == user.id);
      // if (filterTask && filter !== 'all') handleFilter();

      setTasks(filterTask);
      setIsLoading(false);
    }
  };

  const handleSorting = (args) => {
    localStorage.setItem('sorting', JSON.stringify(args));
    if (args === sorting && sortingType === 'asc') {
      setSortingType('desc');
      localStorage.setItem('sortingType', 'desc');
    } else if (args === sorting) {
      setSortingType('asc');
      localStorage.setItem('sortingType', 'asc');
    }
    if (args === 'none') {
      localStorage.setItem('sorting', null);
      localStorage.setItem('sortingType', null);
    }
    setSorting(args)
  }


  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleFilter = () => {
    if (filter === 'completed') {
      const completedTask = tasks.filter((item) => item.completed);
      setTasks(completedTask);
    } else if (filter === 'uncompleted') {
      const uncompletedTask = tasks.filter((item) => !item.completed);
      setTasks(uncompletedTask);
    }
  }


  useEffect(() => {
    handleFilter();
  }, [filter])


  // Handle checkbox change for a task
  const handleTaskCheckboxChange = (task) => {
    tasks.map((item) => {
      if (item.id === task.id) {
        item.completed = !item.completed
      }
    });
    localStorage.setItem('allTasks', JSON.stringify(tasks));
    fetchTodos();
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    const remainingTasks = tasks.filter((item) => item.id !== taskId);
    localStorage.setItem('allTasks', JSON.stringify(remainingTasks));
    toast.success('Task deleted successfully');
    fetchTodos();
  };

  // Edit a task
  const handleEditTask = (task) => {
    if (task && task.completed) {
      setError("already completed task can't be edit");
      return;
    }
    setEditTaskId(task);
    onOpen();
    setTimeout(() => {
      setError('');
    }, 4000);
  };


  // Mark all tasks as completed
  const handleCompleteAll = () => {
    tasks.forEach((item) => item.completed = true);
    localStorage.setItem('allTasks', JSON.stringify(tasks));
    fetchTodos();
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    const pendingTasks = tasks.filter((item) => !item.completed);
    localStorage.setItem('allTasks', JSON.stringify(pendingTasks));
    fetchTodos();
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    fetchTodos();
    localStorage.setItem('filter', JSON.stringify(filterType));
    setFilter(filterType);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const clicked = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  }

  // Render the todo list
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <span>{user?.current?.name.charAt(0)}</span>
        <button onClick={clicked} className='todoButton'>
          logout
        </button>
        <h2>
          <img src={todoImage} alt="todo-icon" /> Todo List
        </h2>
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task todoListInput"
            id="add"
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
          />
          <button className='todoButton' onClick={() => onOpen()}>
            Add
          </button>
          <AddTodo isOpen={isOpen} onClose={onClose} editTask={editTaskId} />
        </div>

        {error.length !== '' ? <span style={{ color: 'red' }}>{error}</span> : null}
        <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete comp tasks
          </p>
        </div>

        <ul id="list">
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox todoListInput"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task)}
              />
              <label htmlFor={`task-${task.id}`}>{task.task}</label>
              <span>{task.deadline.slice(0, 10)}</span>
              <div style={{ display: 'flex' }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                  className="edit"
                  alt='edit button icon'
                  data-id={task.id}
                  onClick={() => handleEditTask(task)}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                  className="delete"
                  alt='delete button icon'
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </li>

          ))}
        </ul>

        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              <p onClick={() => handleFilterChange('all')} style={{ cursor: 'pointer' }}>
                All
              </p>
              <p onClick={() => handleFilterChange('uncompleted')} style={{ cursor: 'pointer' }}>
                Uncompleted
              </p>
              <p onClick={() => handleFilterChange('completed')} style={{ cursor: 'pointer' }}>
                Completed
              </p>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropbtn">Sort</button>
            <div className="dropdown-content">
              <p onClick={() => handleSorting('none')} style={{ cursor: 'pointer' }}>
                None
              </p>
              <p onClick={() => handleSorting('status')} style={{ cursor: 'pointer' }}>
                Status
              </p>
              <p onClick={() => handleSorting('dueDate')} style={{ cursor: 'pointer' }}>
                Due Date
              </p>
            </div>
          </div>
        </div>
        <div className='counts'>

          <div className="completed-task">
            <p>
              Completed: <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
