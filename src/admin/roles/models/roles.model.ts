export type CreateRoleDto = {
  name: string;
  permissions?: string[];
  users?: string[];
}

export type UpdateRoleDto = {
  name?: string;
  permissions?: string[];
  users?: string[];
}