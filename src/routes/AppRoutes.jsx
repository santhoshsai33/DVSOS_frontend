import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

// Layouts
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import KioskLayout from '../layouts/KioskLayout/KioskLayout';

// Pages
import Login from '../pages/Auth/Login';
import ManagerDashboard from '../pages/Dashboard/ManagerDashboard';
import NotFound from '../pages/NotFound/NotFound';
import KioskDisplay from '../pages/Kiosk/KioskDisplay';
import GateEntryList from '../pages/GateEntry/GateEntryList';
import GateEntryForm from '../pages/GateEntry/GateEntryForm';
import JobCardCreate from '../pages/JobCards/JobCardCreate';
import JobCardList from '../pages/JobCards/JobCardList';
import MechanicalQueue from '../pages/WorkQueue/MechanicalQueue';
import BodyShopQueue from '../pages/WorkQueue/BodyShopQueue';
import WaterWashQueue from '../pages/WorkQueue/WaterWashQueue';
import ApprovalQueue from '../pages/Approvals/ApprovalQueue';
import ReportsPage from '../pages/Reports/ReportsPage';
import UserList from '../pages/Users/UserList';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Public Kiosk Route */}
      <Route element={<KioskLayout />}>
        <Route path="/kiosk" element={<KioskDisplay />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/" element={<ManagerDashboard />} />
        <Route path="/gate-entry" element={<GateEntryList />} />
        <Route path="/gate-entry/new" element={<GateEntryForm />} />
        <Route path="/job-cards" element={<JobCardList />} />
        <Route path="/job-cards/create" element={<JobCardCreate />} />
        <Route path="/work-queue/mechanical" element={<MechanicalQueue />} />
        <Route path="/work-queue/body-shop" element={<BodyShopQueue />} />
        <Route path="/work-queue/water-wash" element={<WaterWashQueue />} />
        <Route path="/approvals" element={<ApprovalQueue />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/users" element={<UserList />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
