import { InsertEvent, EventSubscriber, EntitySubscriberInterface } from 'typeorm';
import { User } from '../user.entity';
import Bcrypt from '../../plugins/bcrypt.plugin';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {

  /**
     * Indicates that this subscriber only listen to Post events.
     */
  listenTo(): any {
    return User;
  }

  /**
     * Called before post insertion.
     */
  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    // const userRepository = User.getRepository();
    // const dbCurrentUser = await userRepository.findOne(this.id);
    // if (this.password && this.password !== dbCurrentUser.password)
    const { password } = event.entity;
    event.entity.password = await Bcrypt.hash(password);
  }

  async beforeUpdate(event: InsertEvent<User>): Promise<void> {
    console.log('BEFORE UPDATE', event.entity);
    if(event.entity !== undefined) {
      if (event.entity.password) {
        event.entity.password = await Bcrypt.hash(event.entity.password);
      }
    }
  }
}
