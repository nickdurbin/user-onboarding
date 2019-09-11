import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div>
      <Route path='/' component={Form} />
    </div>
  );
}

export default App;