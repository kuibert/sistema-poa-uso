import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <h1>Sistema POA - Universidad de Sonsonate</h1>
        <p>Frontend en construcción...</p>
        <Routes>
          <Route path="/" element={<div>Inicio</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
