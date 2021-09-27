import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dot";
import { UserRepository } from "./users.repository";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  @InjectRepository(UserRepository)
  private usersRepository: UserRepository;
  private jwtService: JwtService;

  constructor(userRepository: UserRepository, jwtService: JwtService) {
    this.usersRepository = userRepository;
    this.jwtService = jwtService;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ username });
    const passwordsCompared = await bcrypt.compare(password, user.password);

    if (user && passwordsCompared) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException("Please check your login credentials");
    }
  }
}
