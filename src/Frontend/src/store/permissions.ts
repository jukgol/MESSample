import type { UserInfo } from '../api/data-contracts';

export const PERMISSIONS = {
  masterDataView: 'Permissions.MasterData.View',
  masterDataEdit: 'Permissions.MasterData.Edit',
  inventoryView: 'Permissions.Inventory.View',
  inventoryEdit: 'Permissions.Inventory.Edit',
  processView: 'Permissions.Process.View',
  processExecute: 'Permissions.Process.Execute',
  qcView: 'Permissions.QC.View',
  qcExecute: 'Permissions.QC.Execute',
} as const;

interface AccessRule {
  allowedPermissions?: string[];
  allowedRoles?: string[];
}

const ROLE_PERMISSION_FALLBACKS: Record<string, string[]> = {
  admin: ['*'],
  operator: [PERMISSIONS.processView, PERMISSIONS.processExecute],
  qc: [PERMISSIONS.qcView, PERMISSIONS.qcExecute],
  viewer: [PERMISSIONS.processView, PERMISSIONS.qcView, PERMISSIONS.masterDataView, PERMISSIONS.inventoryView],
};

const normalize = (value?: string | null) => value?.trim().toLowerCase() || '';

export const hasAccess = (user: UserInfo | null, rule: AccessRule = {}) => {
  const userWithLegacyKeys = user as (UserInfo & {
    RoleCode?: string | null;
    Permissions?: string[] | null;
  }) | null;
  const roleCode = normalize(user?.roleCode || userWithLegacyKeys?.RoleCode || 'VIEWER');
  const userPermissions = user?.permissions || userWithLegacyKeys?.Permissions || [];
  const permissions = (userPermissions.length > 0
    ? userPermissions
    : ROLE_PERMISSION_FALLBACKS[roleCode] || []
  ).map(normalize);
  const allowedPermissions = rule.allowedPermissions?.map(normalize) || [];
  const allowedRoles = rule.allowedRoles?.map(normalize) || [];

  if (roleCode === 'admin' || permissions.includes('*')) {
    return true;
  }

  if (allowedPermissions.length > 0) {
    return allowedPermissions.some((permission) => permissions.includes(permission));
  }

  if (allowedRoles.length > 0) {
    return allowedRoles.includes(roleCode);
  }

  return true;
};
