import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { UserRepository } from "./users.repository";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @InjectRepository(UserRepository)
  private usersRepository: UserRepository;

  constructor(usersRepository: UserRepository) {
    super({
      secretOrKey: "topSecret42",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.usersRepository = usersRepository;
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
