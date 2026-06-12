import useAuthStore from '../store/useAuthStore';
import { MANAGEMENT_ROLES } from '../constants/roles';

/**
 * usePermissions — role-based permission checks
 */
export const usePermissions = () => {
  const { role } = useAuthStore();

  const hasRole = (allowedRoles) => {
    if (!role) return false;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(role);
  };

  const isManagement = () => hasRole(MANAGEMENT_ROLES);

  const canApprove = () => hasRole(['MANAGER', 'MD', 'SUPER_ADMIN', 'CRM_TEAM']);

  const canManageUsers = () => hasRole(['MANAGER', 'MD', 'SUPER_ADMIN']);

  const canViewReports = () => hasRole(['MANAGER', 'MD', 'SUPER_ADMIN']);

  const canAccessMasters = () => hasRole(['SUPER_ADMIN']);

  const canAssignWork = () => hasRole(['FLOOR_SUPERVISOR', 'BODY_SHOP_SUPERVISOR', 'MANAGER', 'SUPER_ADMIN']);

  return {
    role,
    hasRole,
    isManagement,
    canApprove,
    canManageUsers,
    canViewReports,
    canAccessMasters,
    canAssignWork,
  };
};
