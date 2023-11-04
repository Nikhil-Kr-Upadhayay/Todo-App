import { useRef } from 'react';
import Auth from './component/auth/Auth';
import ProtectedRoute from './component/protectedRoute/ProtectedRoute';
import TodoList from './component/todo/TodoList';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Auth />
        } />
        <Route path="/home" element={<TodoList />} />
      </Routes>
    </Router>
  );
}

export default App;
