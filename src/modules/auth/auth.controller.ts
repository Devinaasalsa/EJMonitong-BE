import { Body, Controller, Post, Response } from '@nestjs/common';
import { User } from '@prisma/client';
import { JWT_EXPIRY_SECONDS } from '../../shared/constants/global.constants';
import { AuthService } from './auth.service';
import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO } from './dto/auth.dto';
import { response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() user: LoginUserDTO,
    @Response() res,
  ): Promise<AuthResponseDTO> {
    const loginData = await this.authService.login(user);

    res.cookie('accessToken', loginData.accessToken, {
      expires: new Date(new Date().getTime() + JWT_EXPIRY_SECONDS * 1000),
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });

    return res.status(200).send(loginData);
  }

  // @Post('register')
  // async register(@Body() user: RegisterUserDTO): Promise<User> {
  //   return this.authService.register(user);
  // }

  @Post('logout')
  logout(@Response() res):any {
    res.clearCookie('accessToken');
    response.status(200).send({ 
      success: true ,
      message: "User has been logged out."
    });
  }
}