import bcrypt from "bcrypt";

export class Password {
  private static readonly SALT_ROUND = 10;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUND);
  }

  static async compare(
    password: string,
    hashedPassword: string
  ): Promise<Boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
