import User, { IUser } from "./auth.model";
import createError from "http-errors";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

export class AuthService {
  public async signup(data: IUser) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw createError(409, "User aleady exist");
    }

    const newUser = await User.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });

    return {
      user: newUser,
    };
  }

  public async login(data: IUser) {
    const existingUser = await User.findOne({ email: data.email });
    if (!existingUser) {
      throw createError(404, "Invalid credentials");
    }

    const comparePassword = await bcrypt.compare(
      data.password,
      existingUser.password,
    );
    if (!comparePassword) {
      return createError(401, "Invalid credentials");
    }

    const accessToken = this.generateToken(existingUser.id);

    return {
      user: existingUser,
      accessToken,
    };
  }

  private generateToken(userId: string) {
    const payload = { sub: userId };

    const accessToken = sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "2 days",
    });
    return accessToken;
  }
}
