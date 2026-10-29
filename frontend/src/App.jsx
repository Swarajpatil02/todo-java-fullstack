import { useEffect, useMemo, useState } from 'react';
import { Check, Circle, ClipboardList, Clock3, Edit3, ListTodo, Plus, Search, Trash2, X } from 'lucide-react';

const API = 'http://localhost:8081/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function request(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const data = await response.json();
        message = data.message || data.detail || data.error || message;
      } catch { /* response may have no JSON body */ }
      throw new Error(message);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await request(API);
      setTasks(data);
      setError('');
    } catch (e) {
      setError('Could not connect to the Java backend. Start Spring Boot and MySQL, then refresh.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesFilter = filter === 'all' || (filter === 'completed' ? task.completed : !task.completed);
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || task.title.toLowerCase().includes(term) || (task.description || '').toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  }), [tasks, filter, search]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setEditing(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError('');
    try {
      const body = JSON.stringify({ title: title.trim(), description: description.trim() });
      if (editing) {
        await request(`${API}/${editing.id}`, { method: 'PUT', body });
      } else {
        await request(API, { method: 'POST', body });
      }
      resetForm();
      await loadTasks();
    } catch (e) {
      setError(e.message || 'Could not save task.');
    } finally {
      setBusy(false);
    }
  }

  function startEdit(task) {
    setEditing(task);
    setTitle(task.title);
    setDescription(task.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function toggleTask(task) {
    try {
      const updated = await request(`${API}/${task.id}/toggle`, { method: 'PATCH' });
      setTasks(current => current.map(item => item.id === updated.id ? updated : item));
    } catch (e) { setError(e.message); }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await request(`${API}/${task.id}`, { method: 'DELETE' });
      setTasks(current => current.filter(item => item.id !== task.id));
      if (editing?.id === task.id) resetForm();
    } catch (e) { setError(e.message); }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="TaskFlow home">
          <span className="brand-mark"><ListTodo size={22} /></span>
          <span>taskflow<span className="brand-dot">.</span></span>
        </a>
        <span className="topbar-label"><span className="status-dot" /> Your day, organized</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> SMALL STEPS, BIG PROGRESS</div>
        <h1>Make room for<br /><span>what matters.</span></h1>
        <p className="hero-copy">A little focus goes a long way. Capture your tasks, keep your momentum, and make today count.</p>
      </section>

      <section className="stats-grid" aria-label="Task summary">
        <article className="stat-card">
          <span className="stat-icon lavender"><ClipboardList size={19} /></span>
          <div><span className="stat-label">Total tasks</span><strong>{tasks.length}</strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon peach"><Clock3 size={19} /></span>
          <div><span className="stat-label">To do</span><strong>{pendingCount}</strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon mint"><Check size={19} /></span>
          <div><span className="stat-label">Completed</span><strong>{completedCount}</strong></div>
        </article>
      </section>

      <section className="content-grid">
        <aside className="composer-card">
          <div className="section-heading">
            <span className="heading-icon"><Plus size={18} /></span>
            <div><h2>{editing ? 'Edit task' : 'Add a task'}</h2><p>{editing ? 'Make a quick update' : 'What would you like to get done?'}</p></div>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="task-title">Task name <span>*</span></label>
            <input id="task-title" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Finish project report" required />
            <label htmlFor="task-description">Details <small>OPTIONAL</small></label>
            <textarea id="task-description" value={description} onChange={e => setDescription(e.target.value)} maxLength={1000} rows={4} placeholder="Add a few details to help you get started..." />
            <button className="primary-btn" type="submit" disabled={busy || !title.trim()}>
              {editing ? <Check size={17} /> : <Plus size={17} />}
              {busy ? 'Saving...' : editing ? 'Save changes' : 'Add to my list'}
            </button>
            {editing && <button className="cancel-btn" type="button" onClick={resetForm}><X size={16} /> Cancel editing</button>}
          </form>
          <div className="tip"><span>✦</span><p><strong>A gentle reminder</strong><br />You don't have to do it all at once. One task at a time.</p></div>
        </aside>

        <section className="tasks-panel">
          <div className="tasks-header">
            <div><div className="panel-kicker">YOUR WORKSPACE</div><h2>My tasks <span className="count-pill">{tasks.length}</span></h2></div>
          </div>
          <div className="search-box"><Search size={17} /><input aria-label="Search tasks" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your tasks..." />{search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={15} /></button>}</div>
          <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
            {[['all', 'All tasks'], ['pending', 'To do'], ['completed', 'Completed']].map(([value, label]) => (
              <button key={value} role="tab" aria-selected={filter === value} className={filter === value ? 'filter active' : 'filter'} onClick={() => setFilter(value)}>{label}<span>{value === 'all' ? tasks.length : value === 'pending' ? pendingCount : completedCount}</span></button>
            ))}
          </div>

          {error && <div className="error-banner" role="alert">{error}<button onClick={() => setError('')} aria-label="Dismiss error"><X size={15} /></button></div>}

          <div className="task-list">
            {loading ? <div className="empty-state"><div className="empty-art"><Clock3 size={28} /></div><h3>Loading your tasks...</h3><p>Just a moment.</p></div>
            : visibleTasks.length === 0 ? <div className="empty-state"><div className="empty-art"><ListTodo size={28} /></div><h3>{search ? 'No matching tasks' : filter === 'completed' ? 'Nothing completed yet' : filter === 'pending' ? 'You’re all caught up!' : 'A fresh start'}</h3><p>{search ? 'Try another search term.' : filter === 'all' ? 'Add your first task to start building momentum.' : 'Your list will update as you go.'}</p></div>
            : visibleTasks.map(task => (
              <article className={`task-item ${task.completed ? 'is-complete' : ''}`} key={task.id}>
                <button className={`check-button ${task.completed ? 'checked' : ''}`} onClick={() => toggleTask(task)} aria-label={task.completed ? `Mark ${task.title} as pending` : `Complete ${task.title}`}>
                  {task.completed ? <Check size={16} /> : <Circle size={20} />}
                </button>
                <div className="task-copy"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}<span className="task-date">{task.completed ? '✓ Completed' : '• In progress'}</span></div>
                <div className="task-actions"><button onClick={() => startEdit(task)} aria-label={`Edit ${task.title}`} title="Edit"><Edit3 size={16} /></button><button className="delete-action" onClick={() => deleteTask(task)} aria-label={`Delete ${task.title}`} title="Delete"><Trash2 size={16} /></button></div>
              </article>
            ))}
          </div>
          <div className="list-footer"><span><span className="footer-dot" /> Saved to your database</span><span>{completedCount} of {tasks.length} done</span></div>
        </section>
      </section>
      <footer className="footer"><span>taskflow<span className="brand-dot">.</span></span><span>Built for calmer, more focused days.</span></footer>
    </main>
  );
}
