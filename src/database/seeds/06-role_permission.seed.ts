import { Seeder, Factory } from 'typeorm-seeding';
import { Connection, getConnection } from 'typeorm';
import Permissions from '../../constant/permissions-seed.constant';

export default class CreateRolePermission implements Seeder {
  private rolePermission = [];

  private permission: Permissions = new Permissions()

  private Excute(): void {
    this.permission.role_permissions.forEach(role_permission => {
      for (let i = 0; i < this.permission.roles.length; i += 1) {
        if (role_permission.role === this.permission.roles[i].name) {
          role_permission.permissions.forEach(permission => {
            for (let j = 0; j < this.permission.modules.length; j += 1) {
              if (this.permission.modules[j].name === permission.module) {
                permission.methods.forEach(method => {
                  for (let k = 0; k < this.permission.methods.length; k += 1) {
                    if (method.name === this.permission.methods[k].name)
                      this.rolePermission.push({ rolesId: i + 1, permissionsId: (j * this.permission.methods.length) + k + 1 });
                  }
                });
              }
            }
          });
        }
      }
    });
  }

  public async run(factory: Factory): Promise<any> {
    const connection: Connection = getConnection();

    this.Excute();
    await connection
      .createQueryBuilder()
      .insert()
      .into('role_permission')
      .values(this.rolePermission)
      .execute();
  }
}
