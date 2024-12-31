import bcrypt from 'bcryptjs';

class Bcrypt {
  private saltRounds: number;

  constructor() {
    this.saltRounds = +process.env.SALT_ROUNDS;
  }

  public hash(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }

  public hashSync(password: string) {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  public compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  public compareSync(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}

export default new Bcrypt();
