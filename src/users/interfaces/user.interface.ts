import { Role } from '../../auth/roles/role.enum';

export interface User {
  id?: string;
  username?: string;
  password?: string;
  roles?: Role[];
}
