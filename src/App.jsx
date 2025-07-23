import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import DetailView from './DetailView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/details/:city" element={<DetailView />} />
    </Routes>
  );
}

export default App;
