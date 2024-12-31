import { InsertEvent, EventSubscriber, EntitySubscriberInterface } from 'typeorm';
import { UserPermission } from '../user-permission.entity';

@EventSubscriber()
export class UserPermissionSubscriber implements EntitySubscriberInterface<UserPermission> {

  /**
     * Indicates that this subscriber only listen to Post events.
     */
  listenTo(): any {
    return UserPermission;
  }

  /**
     * Called before post insertion.
     */
  async beforeInsert(event: InsertEvent<UserPermission>): Promise<void> {
  }

  async beforeUpdate(event: InsertEvent<UserPermission>): Promise<void> {

  }
}
