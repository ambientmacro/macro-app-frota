import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import Header from "./components/Header";
import ProtectedRoute from "./pages/protected/ProtectedRoute";

// Páginas públicas
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";

// Páginas públicas autenticadas (cliente/motorista)
import DashboardClientePublico from "./pages/public/DashboardClientePublico";
import MinhasSolicitacoes from "./pages/public/MinhasSolicitacoes";

import LancarCheckList from "./pages/public/LancarCheckList";
import HistoricoChecklist from "./pages/public/HistoricoChecklist";
import VisualizarChecklist from "./pages/public/VisualizarChecklist";

// Páginas privadas (admin)
import Dashboard from "./pages/client/Dashboard";
import EmpresasAdmin from "./pages/admin/EmpresasAdmin";
import NovoEquipamento from "./pages/admin/NovoEquipamento";
import NovoCheckList from "./pages/admin/NovoCheckList";
import RelacionarEquipamentoChecklist from "./pages/admin/RelacionarEquipamentoChecklist";
import LegendasAdmin from "./pages/admin/LegendasAdmin";
import FuncionariosAdmin from "./pages/admin/FuncionariosAdmin";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>

          {/* ROTAS PÚBLICAS */}
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/login" element={<><Header /><Login /></>} />

          {/* ROTAS PÚBLICAS AUTENTICADAS (CLIENTE / MOTORISTA) */}
          <Route element={<PublicLayout />}>
            <Route path="/dashboard-cliente-publico" element={<DashboardClientePublico />} />
            <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />

            {/* Motorista */}
            <Route path="/lancar-checklist" element={<LancarCheckList />} />
            <Route path="/historico-checklist" element={<HistoricoChecklist />} />
            <Route path="/visualizar-checklist/:id" element={<VisualizarChecklist />} />
          </Route>

          {/* ROTAS PRIVADAS (ADMIN) */}
          <Route
            element={
              <ProtectedRoute>
                <PrivateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin */}
            <Route path="/admin/empresas" element={<EmpresasAdmin />} />
            <Route path="/admin/novo-equipamento" element={<NovoEquipamento />} />
            <Route path="/admin/novo-checklist" element={<NovoCheckList />} />
            <Route path="/admin/relacionar-checklist" element={<RelacionarEquipamentoChecklist />} />
            <Route path="/admin/funcionarios" element={<FuncionariosAdmin />} />
            <Route path="/legendas" element={<LegendasAdmin />} />
          </Route>

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
