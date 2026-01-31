import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/src/store/store'
import { TodoPage, PostsPage } from '@/src/pages'
import './App.css'

const Navigation = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }): string => {
    const baseClass = 'nav-link'

    if (isActive) {
      return `${baseClass} nav-link-active`
    }

    return baseClass
  }

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-brand">
          <span className="nav-logo">📝</span>
          <span className="nav-title">Task Manager</span>
        </div>

        <div className="nav-links">
          <NavLink to="/" className={getLinkClass}>
            Todos
          </NavLink>
          <NavLink to="/posts" className={getLinkClass}>
            Posts
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<TodoPage />} />
              <Route path="/posts" element={<PostsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App