import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SalonPage from './pages/SalonPage';
import Admin from './pages/Admin';
import AdminUsuarios from './pages/AdminUsuarios';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pagina-de-inicio" element={<Home />} />
          <Route path="/pagina-de-autoridades" element={<Home />} />
          <Route path="/salon/:id" element={<SalonPage />} />
          <Route path="/admin" element={<Admin />}>
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
