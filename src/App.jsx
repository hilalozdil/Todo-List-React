import { useState } from 'react';
import './App.css'

const stored = JSON.parse(localStorage.data || '{}');

export default function App() {

  const [todos, setTodos] = useState(stored.todos || []);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(stored.theme || 'light');
  const [completed, setCompleted] = useState(stored.completed || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  document.body.className = theme;


  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const todo = formObj.todo.trim();

    if (!todo) {
      setError('Bu todo boş eklenemez !');
      return;
    }

    const newTodos = [...todos, todo];
    setTodos(newTodos);
    setError('');
    localStorage.data = JSON.stringify({ todos: newTodos, theme, completed });
    e.target.reset();

    const input = document.querySelector('input[name="todo"]');
    if (input) input.focus();
  }

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;

    localStorage.data = JSON.stringify(
      {
        todos,
        theme: newTheme,
        completed
      });
  }

  function handleDelete(index) {
    const newTodos = todos.filter(((_, i) => i !== index));
    const newCompleted = completed.filter(((_, i) => i !== index));
    setTodos(newTodos);
    setCompleted(newCompleted);

    localStorage.data = JSON.stringify({ todos: newTodos, theme, completed: newCompleted });
  }

  function handleCompleted(index) {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];

    setCompleted(newCompleted);
    localStorage.data = JSON.stringify({ todos, theme, completed: newCompleted });
  }

  function handleEdit(index) {
    setEditingIndex(index);
    setEditValue(todos[index]);
  }

  function handleEditChange(e) {
    setEditValue(e.target.value);
  }

  function handleEditSave() {
    if (!editValue.trim()) return;
    const newTodos = [...todos];
    newTodos[editingIndex] = editValue.trim();
    setTodos(newTodos);
    localStorage.data = JSON.stringify({ todos: newTodos, theme, completed });
    setEditingIndex(null);
    setEditValue('');
  }

  function handleEditCancel() {
    setEditingIndex(null);
    setEditValue('');
  }

  return (
    <>

      <div className="container">
        <button onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Moda Geç' : 'Light Moda Geç'}
        </button>
        <br />
        <div className="card">
          <h1>To Do List</h1>
          <form onSubmit={handleSubmit} autoComplete='off'>
            <input type="text" name='todo' placeholder='Todo Giriniz' />
            <button>Ekle</button>
          </form>

          {error && <p className='error-message'>{error}</p>}
          <ul>
            {todos.map((todo, i) => (
              <li key={i}>
                {editingIndex === i ? (
                  <>
                    <input type="text"
                      value={editValue}
                      onChange={handleEditChange}
                      autoFocus
                    />
                    <button onClick={handleEditSave}>Kaydet</button>
                    <button onClick={handleEditCancel}>İptal</button></>
                ) : (
                  <span
                    className={completed[i] ? 'completed' : ''}
                    onClick={() => handleEdit(i)}
                  >
                    {todo}
                  </span>
                )}
                {editingIndex !== i && (
                  <div>
                    <button className='complete-btn' onClick={() => handleCompleted(i)}>✅</button>
                    <button className='delete-btn' onClick={() => handleDelete(i)}>❌</button>
                  </div>
                )}
              </li>
            ))}
          </ul >
        </div>
      </div>
    </>
  )
}
