import { Password } from "./auth";

describe("Password Utility", () => {
  it("should hash a password and successfuly compare it", async () => {
    const plainPassword = "mySecretPassword456";
    const hashedPassword = await Password.hash(plainPassword);

    expect(hashedPassword).not.toBe(plainPassword);

    const isMatch = await Password.compare(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should return false when password is false", async () => {
    const plainPassword = "mySecretPassword456";
    const wrongPassword = "wrongPassword";

    const hashedPassword = await Password.hash(plainPassword);
    const isMatch = await Password.compare(wrongPassword, hashedPassword);

    expect(isMatch).toBe(false);
  });
});
