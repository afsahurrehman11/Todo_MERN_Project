import { useState, useEffect } from 'react';
import api from '../utils/axios'; // Use the configured axios instance

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: '',
  });
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view tasks');
        return;
      }

      const response = await api.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedTasks = response.data.map((task) => ({
        ...task,
        completed: false, // Add a `completed` property to each task
      }));
      setTasks(updatedTasks);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Error fetching tasks');
    }
  };

  const handleCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add tasks');
        return;
      }

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, newTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditingTask(null);
      } else {
        await api.post('/tasks', newTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setNewTask({ name: '', description: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      setError(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to delete tasks');
        return;
      }

      await api.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.response?.data?.message || 'Error deleting task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate.split('T')[0],
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '20px',
        gap: '20px',
      }}
    >
      {/* Add Task Form */}
      <div
        style={{
          flex: '0.5',
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Details"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setNewTask({ name: '', description: '', dueDate: '' });
              }}
              style={{ padding: '10px 20px' }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Task List */}
      <div
        style={{
          flex: '2',
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <h2>Task List</h2>
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              marginBottom: '20px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleCheckboxChange(task._id)}
                style={{ marginRight: '10px' }}
              />
              <h3 style={{ margin: 0 }}>{task.name}</h3>
            </div>
            <p>{task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <div>
              <button
                onClick={() => handleEdit(task)}
                style={{ padding: '5px 10px', marginRight: '10px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                style={{ padding: '5px 10px' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
