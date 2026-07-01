import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import KioskLayout from '../layouts/KioskLayout/KioskLayout';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import { ROUTES } from '../config/routes';
import { PERMISSIONS } from '../config/permissions';
import { ROLES } from '../constants/roles';
import useAuthStore from '../store/useAuthStore';

import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import AdminDashboardPage from '../pages/Dashboard/AdminDashboard';
import UserManagementPage from '../pages/Users/UserList';
import RoleManagementPage from '../pages/Roles/RoleList';
import RolePrivilegesForm from '../pages/Roles/RolePrivilegesForm';
import ServiceCategories from '../pages/Masters/ServiceCategories';
import ServiceCategoryForm from '../pages/Masters/ServiceCategoryForm';
import ServiceItems from '../pages/Masters/ServiceItems';
import ServiceItemForm from '../pages/Masters/ServiceItemForm';
import StateList from '../pages/Masters/StateList';
import StateForm from '../pages/Masters/StateForm';
import BrandList from '../pages/Masters/BrandList';
import BrandForm from '../pages/Masters/BrandForm';
import DistrictList from '../pages/Masters/DistrictList';
import DistrictForm from '../pages/Masters/DistrictForm';
import ServiceCenterList from '../pages/Masters/ServiceCenterList';
import ServiceCenterForm from '../pages/Masters/ServiceCenterForm';
import ServiceCenterView from '../pages/Masters/ServiceCenterView';
import ModuleList from '../pages/Masters/ModuleList';
import ModuleForm from '../pages/Masters/ModuleForm';
import StatusList from '../pages/Masters/StatusList';
import StatusForm from '../pages/Masters/StatusForm';
import LocationList from '../pages/Locations/LocationList';
import LocationForm from '../pages/Locations/LocationForm';
import SystemSettingsPage from '../pages/SuperAdmin/CompanySettings';
import AuditLogsPage from '../pages/Admin/AuditLogs';
import AuditLogDetailsPage from '../pages/Admin/AuditLogDetails';
import UserForm from '../pages/Users/UserForm';
import UserView from '../pages/Users/UserView';
import LocationView from '../pages/Locations/LocationView';
import GateDashboardPage from '../pages/GateEntry/GateDashboardPage';
import GateEntryPage from '../pages/GateEntry/GateEntryPage';
import GateEntryDetails from '../pages/GateEntry/GateEntryDetails';
import PendingSyncPage from '../pages/GateEntry/PendingSyncPage';
import CrmDashboardPage from '../pages/Dashboard/CrmDashboard';
import CreateJobCardPage from '../pages/JobCards/JobCardCreate';
import PendingJobCardsPage from '../pages/JobCards/JobCardList';
import ApprovalFollowupPage from '../pages/Approvals/ApprovalQueue';
import DeliveryReadyPage from '../pages/Delivery/ReadyForDelivery';
import CrmAdditionalWorkPage from '../pages/AdditionalWork/CrmAdditionalWork';
import FloorDashboardPage from '../pages/WorkQueue/MechanicalQueue';
import MechanicalQueuePage from '../pages/WorkQueue/MechanicalQueue';
import AssignMechanicPage from '../pages/WorkQueue/AssignMechanicList';
import AdditionalWorkRequestPage from '../pages/AdditionalWork/AdditionalWorkList';
import MechanicWorkStatusPage from '../pages/WorkQueue/FloorWorkStatus';
import CreateRequest from '../pages/AdditionalWork/CreateRequest';
import BodyShopDashboardPage from '../pages/WorkQueue/BodyShopQueue';
import BodyShopQueuePage from '../pages/WorkQueue/BodyShopQueue';
import BodyShopJobDetailPage from '../pages/WorkQueue/BodyShopQueue';
import BodyShopAssignMechanicPage from '../pages/WorkQueue/AssignMechanicList';
import BodyShopAdditionalWorkPage from '../pages/AdditionalWork/BodyShopAdditionalWorkList';
import BodyShopCreateRequestPage from '../pages/AdditionalWork/BodyShopCreateRequest';
import BodyShopWorkStatusPage from '../pages/WorkQueue/BodyShopWorkStatus';
import WaterWashDashboardPage from '../pages/WorkQueue/WaterWashQueue';
import WaterWashQueuePage from '../pages/WorkQueue/WaterWashQueue';
import WaterWashAssignMemberPage from '../pages/WorkQueue/AssignMechanicList';
import WashJobDetailPage from '../pages/WorkQueue/WaterWashQueue';
import ManagerDashboardPage from '../pages/Dashboard/ManagerDashboard';
import ManagerJobCardPrototypePage from '../pages/JobCards/ManagerJobCardPrototype';
import DelayedJobsPage from '../pages/Dashboard/DelayedJobs';
import PendingApprovalsPage from '../pages/Approvals/ApprovalQueue';
import ManagerReportsPage from '../pages/Reports/ReportsPage';
import MdDashboardPage from '../pages/Dashboard/MDDashboard';
import ExecutiveOverviewPage from '../pages/Dashboard/ExecutiveOverview';
import PerformanceReportPage from '../pages/Reports/ReportsPage';
import ServiceKpiPage from '../pages/Dashboard/KPIDashboard';
import MdStageSchedules from '../pages/Schedules/StageSchedules';
import MdStageScheduleForm from '../pages/Schedules/StageScheduleForm';
import TvKioskPage from '../pages/Kiosk/KioskDisplay';
import CustomerListPage from '../pages/Customers/CustomerListPage';
import CustomerDetailPage from '../pages/Customers/CustomerDetailPage';
import CustomerForm from '../pages/Customers/CustomerForm';
import VehicleListPage from '../pages/Vehicles/VehicleList';
import VehicleDetailPage from '../pages/Vehicles/VehicleDetailPage';
import VehicleEditPage from '../pages/Vehicles/VehicleEditPage';
import JobCardListPage from '../pages/JobCards/JobCardList';
import JobCardDetailPage from '../pages/JobCards/JobCardDetailPage';
import ServiceHistoryPage from '../pages/Vehicles/VehicleHistory';
import ServiceHistoryJobCardPage from '../pages/Vehicles/ServiceHistoryJobCardPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import DeliveredVehicles from '../pages/Delivery/DeliveredVehicles';
import NotFound from '../pages/NotFound/NotFound';

const roleHome = {
  [ROLES.GATE_SECURITY]: ROUTES.GATE_DASHBOARD,
  [ROLES.CRM_TEAM]: ROUTES.CRM_DASHBOARD,
  [ROLES.FLOOR_SUPERVISOR]: ROUTES.FLOOR_DASHBOARD,
  [ROLES.BODY_SHOP_SUPERVISOR]: ROUTES.BODY_SHOP_QUEUE,
  [ROLES.WATER_WASH_TEAM]: ROUTES.WATER_WASH_DASHBOARD,
  [ROLES.MANAGER]: ROUTES.MANAGER_DASHBOARD,
  [ROLES.MD]: ROUTES.MD_DASHBOARD,
  [ROLES.SUPER_ADMIN]: ROUTES.ADMIN_DASHBOARD,
};

function RootRedirect() {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Navigate to={roleHome[role] || ROUTES.PROFILE} replace />;
}

function LegacyMasterEditRedirect({ basePath }) {
  const { slug } = useParams();
  return <Navigate to={`/${basePath}/edit/${slug}`} replace />;
}

function LegacyRolePrivilegesEditRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/roles/privileges/edit/${slug}`} replace />;
}

function LegacyUserEditRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/users/edit/${slug}`} replace />;
}

function LegacyLocationEditRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/locations/edit/${slug}`} replace />;
}

function LegacyCustomerEditRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/customers/edit/${slug}`} replace />;
}

function LegacyJobCardEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/job-cards/edit/${id}`} replace />;
}

function LegacyJobCardViewRedirect() {
  const { id } = useParams();
  return <Navigate to={`/job-cards/view/${id}`} replace />;
}


export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword /> },
    ],
  },
  {
    element: <KioskLayout />,
    children: [
      { path: 'kiosk/tv', element: <TvKioskPage /> },
      { path: 'display', element: <Navigate to={ROUTES.KIOSK_TV} replace /> },
      { path: 'kiosk', element: <Navigate to={ROUTES.KIOSK_TV} replace /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <RootRedirect /> },
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_ADMIN} />,
            children: [
              { path: 'admin-dashboard', element: <AdminDashboardPage /> },
              { path: 'roles', element: <RoleManagementPage /> },
              { path: 'roles/privileges', element: <RolePrivilegesForm /> },
              { path: 'roles/privileges/edit/:slug', element: <RolePrivilegesForm /> },
              { path: 'roles/privileges/:slug/edit', element: <LegacyRolePrivilegesEditRedirect /> },
              { path: 'master-categories', element: <ServiceCategories /> },
              { path: 'master-categories/new', element: <ServiceCategoryForm /> },
              { path: 'master-categories/edit/:slug', element: <ServiceCategoryForm /> },
              { path: 'master-categories/:slug/edit', element: <LegacyMasterEditRedirect basePath="master-categories" /> },
              { path: 'master-items', element: <ServiceItems /> },
              { path: 'master-items/new', element: <ServiceItemForm /> },
              { path: 'master-items/edit/:slug', element: <ServiceItemForm /> },
              { path: 'master-items/:slug/edit', element: <LegacyMasterEditRedirect basePath="master-items" /> },
              { path: 'master-states', element: <StateList /> },
              { path: 'master-states/new', element: <StateForm /> },
              { path: 'master-states/edit/:slug', element: <StateForm /> },
              { path: 'master-states/:slug/edit', element: <LegacyMasterEditRedirect basePath="master-states" /> },
              { path: 'master-brands', element: <BrandList /> },
              { path: 'master-brands/new', element: <BrandForm /> },
              { path: 'master-brands/edit/:slug', element: <BrandForm /> },
              { path: 'master-brands/:slug/edit', element: <LegacyMasterEditRedirect basePath="master-brands" /> },
              { path: 'master-districts', element: <DistrictList /> },
              { path: 'master-districts/new', element: <DistrictForm /> },
              { path: 'master-districts/edit/:slug', element: <DistrictForm /> },
              { path: 'master-districts/:slug/edit', element: <LegacyMasterEditRedirect basePath="master-districts" /> },
              { path: 'service-centers', element: <ServiceCenterList /> },
              { path: 'service-centers/new', element: <ServiceCenterForm /> },
              { path: 'service-centers/:id/edit', element: <ServiceCenterForm /> },
              { path: 'service-centers/:id', element: <ServiceCenterView /> },
              { path: 'modules', element: <ModuleList /> },
              { path: 'modules/new', element: <ModuleForm /> },
              { path: 'modules/edit/:slug', element: <ModuleForm /> },
              { path: 'modules/:slug/edit', element: <LegacyMasterEditRedirect basePath="modules" /> },
              { path: 'master-statuses', element: <StatusList /> },
              { path: 'master-statuses/new', element: <StatusForm /> },
              { path: 'master-statuses/edit/:slug', element: <StatusForm /> },
              { path: 'master-statuses/:slug/edit', element: <LegacyMasterEditRedirect basePath="master-statuses" /> },
              { path: 'locations', element: <LocationList /> },
              { path: 'locations/new', element: <LocationForm /> },
              { path: 'locations/edit/:slug', element: <LocationForm /> },
              { path: 'locations/view/:slug', element: <LocationView /> },
              { path: 'locations/:slug/edit', element: <LegacyLocationEditRedirect /> },
              { path: 'locations/:slug', element: <LocationView /> },
              { path: 'system-settings', element: <SystemSettingsPage /> },
              { path: 'audit-logs', element: <AuditLogsPage /> },
              { path: 'audit-logs/:id', element: <AuditLogDetailsPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_GATE} />,
            children: [
              { path: 'gate-dashboard', element: <GateDashboardPage /> },
              { path: 'gate-entry', element: <GateEntryPage /> },
              { path: 'gate-entry/view/:slug', element: <GateEntryDetails /> },
              { path: 'pending-sync', element: <PendingSyncPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_CRM} />,
            children: [
              { path: 'crm-dashboard', element: <CrmDashboardPage /> },
              // job-cards/create is mapped in the COMMON routes below, so we remove the CRM duplicate
              { path: 'job-cards/pending', element: <PendingJobCardsPage /> },
              { path: 'approval-followup', element: <ApprovalFollowupPage /> },
              { path: 'delivery-ready', element: <DeliveryReadyPage /> },
              { path: 'crm-additional-work', element: <CrmAdditionalWorkPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_FLOOR} />,
            children: [
              { path: 'floor-dashboard', element: <FloorDashboardPage /> },
              { path: 'mechanical-queue', element: <MechanicalQueuePage /> },
              { path: 'assign-mechanic', element: <AssignMechanicPage /> },
              { path: 'additional-work', element: <AdditionalWorkRequestPage /> },
              { path: 'additional-work/new', element: <CreateRequest /> },
              { path: 'work-status', element: <MechanicWorkStatusPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_BODY_SHOP} />,
            children: [
              { path: 'body-shop-dashboard', element: <Navigate to={ROUTES.BODY_SHOP_QUEUE} replace /> },
              { path: 'body-shop-queue', element: <BodyShopQueuePage /> },
              { path: 'body-shop-jobs/:id', element: <BodyShopJobDetailPage /> },
              { path: 'body-shop-assign-mechanic', element: <BodyShopAssignMechanicPage /> },
              { path: 'body-shop-additional-work', element: <BodyShopAdditionalWorkPage /> },
              { path: 'body-shop-additional-work/new', element: <BodyShopCreateRequestPage /> },
              { path: 'body-shop-work-status', element: <BodyShopWorkStatusPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_WATER_WASH} />,
            children: [
              { path: 'water-wash-dashboard', element: <WaterWashDashboardPage /> },
              { path: 'water-wash-queue', element: <WaterWashQueuePage /> },
              { path: 'water-wash-assign-member', element: <WaterWashAssignMemberPage /> },
              { path: 'water-wash-jobs/:id', element: <WashJobDetailPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_MANAGEMENT} />,
            children: [
              { path: 'manager-dashboard', element: <ManagerDashboardPage /> },
              { path: 'operations', element: <Navigate to={ROUTES.MANAGER_DASHBOARD} replace /> },
              { path: 'delayed-jobs', element: <DelayedJobsPage /> },
              { path: 'pending-approvals', element: <PendingApprovalsPage /> },
              { path: 'reports', element: <ManagerReportsPage /> },
              { path: 'manager-job-cards/:id', element: <ManagerJobCardPrototypePage /> },
              { path: 'users', element: <UserManagementPage /> },
              { path: 'users/new', element: <UserForm /> },
              { path: 'users/edit/:slug', element: <UserForm /> },
              { path: 'users/view/:slug', element: <UserView /> },
              { path: 'users/:slug/edit', element: <LegacyUserEditRedirect /> },
              { path: 'users/:slug', element: <UserView /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_EXECUTIVE} />,
            children: [
              { path: 'md-dashboard', element: <MdDashboardPage /> },
              { path: 'executive-overview', element: <ExecutiveOverviewPage /> },
              { path: 'performance-report', element: <PerformanceReportPage /> },
              { path: 'service-kpi', element: <ServiceKpiPage /> },
              { path: 'md-stage-schedules', element: <MdStageSchedules /> },
              { path: 'md-stage-schedules/new', element: <MdStageScheduleForm /> },
              { path: 'md-stage-schedules/:id/edit', element: <MdStageScheduleForm /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_COMMON} />,
            children: [
              { path: 'customers', element: <CustomerListPage title="Customers" /> },
              { path: 'customers/new', element: <CustomerForm /> },
              { path: 'customers/edit/:slug', element: <CustomerForm /> },
              { path: 'customers/view/:slug', element: <CustomerDetailPage title="Customer Detail" /> },
              { path: 'customers/:slug/edit', element: <LegacyCustomerEditRedirect /> },
              { path: 'customers/:slug', element: <CustomerDetailPage title="Customer Detail" /> },
              { path: 'vehicles', element: <VehicleListPage /> },
              { path: 'vehicles/:id', element: <VehicleDetailPage /> },
              { path: 'vehicles/:id/edit', element: <VehicleEditPage /> },
              { path: 'vehicles/:id/history', element: <ServiceHistoryPage /> },
              { path: 'job-cards', element: <JobCardListPage /> },
              { path: 'job-cards/create', element: <CreateJobCardPage /> },
              { path: 'job-cards/edit/:slug', element: <CreateJobCardPage /> },
              { path: 'job-cards/view/:slug', element: <JobCardDetailPage title="Job Card Detail" /> },
              { path: 'job-cards/:id', element: <LegacyJobCardViewRedirect /> },
              { path: 'job-cards/:id/edit', element: <LegacyJobCardEditRedirect /> },
              { path: 'service-history', element: <ServiceHistoryPage /> },
              { path: 'service-history/job-cards/:jobCardId', element: <ServiceHistoryJobCardPage /> },
              { path: 'notifications', element: <NotificationsPage title="Notifications" /> },
              { path: 'profile', element: <ProfilePage title="Profile" /> },
              { path: 'settings', element: <SettingsPage /> },
            ],
          },

          { path: 'dashboard', element: <Navigate to={ROUTES.MANAGER_DASHBOARD} replace /> },
          { path: 'work-queue/mechanical', element: <Navigate to={ROUTES.FLOOR_MECHANICAL_QUEUE} replace /> },
          { path: 'work-queue/body-shop', element: <Navigate to={ROUTES.BODY_SHOP_QUEUE} replace /> },
          { path: 'body-shop/dashboard', element: <Navigate to={ROUTES.BODY_SHOP_QUEUE} replace /> },
          { path: 'work-queue/water-wash', element: <Navigate to={ROUTES.WATER_WASH_QUEUE} replace /> },
          { path: 'water-wash/dashboard', element: <Navigate to={ROUTES.WATER_WASH_DASHBOARD} replace /> },
          { path: 'approvals', element: <Navigate to={ROUTES.MANAGER_PENDING_APPROVALS} replace /> },
          { path: 'kpi-dashboard', element: <Navigate to={ROUTES.MD_SERVICE_KPI} replace /> },
          { path: 'executive-dashboard', element: <Navigate to={ROUTES.MD_EXECUTIVE_OVERVIEW} replace /> },
          { path: 'delivery/ready', element: <Navigate to={ROUTES.CRM_DELIVERY_READY} replace /> },
          { path: 'delivery/delivered', element: <DeliveredVehicles /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
