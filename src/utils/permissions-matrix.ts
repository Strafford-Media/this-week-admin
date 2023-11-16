import { Permissions } from '@dudadev/partner-api/dist/types/lib/accounts/types'

export const permissionsMatrix = {
  STATS_TAB: [],
  BLOG: [],
  E_COMMERCE: [],
  SITE_COMMENTS: [],
  LIMITED_EDITING: [],
  BACKUPS: ['LIMITED_EDITING'],
  RESET: ['LIMITED_EDITING'],
  USE_APP: ['LIMITED_EDITING'],
  CLIENT_MANAGE_FREE_APPS: ['LIMITED_EDITING'],
  CONTENT_LIBRARY: ['LIMITED_EDITING'],
  EDIT: [],
  SEO: ['EDIT'],
  CUSTOM_DOMAIN: ['EDIT'],
  REPUBLISH: ['EDIT'],
  INSITE: ['EDIT'],
  ADD_FLEX: ['EDIT'],
  PUSH_NOTIFICATIONS: ['EDIT'],
  DEV_MODE: ['EDIT'],
  PUBLISH: ['LIMITED_EDITING', 'REPUBLISH'],
  EDIT_CONNECTED_DATA: [],
  MANAGE_CONNECTED_DATA: ['EDIT', 'EDIT_CONNECTED_DATA', 'CONTENT_LIBRARY'],
}

export type SelectedPermissions = Partial<Record<Permissions, boolean>>

const createSelections = (permissions: Permissions[]) => {
  return permissions?.reduce<SelectedPermissions>((blob, perm) => ({ ...blob, [perm]: true }), {}) ?? {}
}

export const validatePermissions = (permissions: Permissions[] = []) => {
  const selections = createSelections(permissions)

  for (const permission of permissions) {
    if (!validatePermission(permission, selections)) {
      return false
    }
  }

  return true
}

export const validatePermission = (permission: Permissions, selected: SelectedPermissions) => {
  return permissionsMatrix[permission] && permissionsMatrix[permission].every((dependency) => selected[dependency])
}

export const hasDudaPermission = (
  requiredPermissions: Permissions[],
  type: 'OR' | 'AND',
  userPermissions: Permissions[]
) => {
  const userMap = createSelections(userPermissions)

  switch (type) {
    case 'AND':
      return requiredPermissions.every((p) => userMap[p])
    case 'OR':
      return requiredPermissions.some((p) => userMap[p])
    default:
      return false
  }
}
