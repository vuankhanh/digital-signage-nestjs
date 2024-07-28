import { Body, ConflictException, Controller, HttpCode, HttpStatus, Logger, Post, UnauthorizedException, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { AccountService } from '../../shared/services/account.service';
import { Account } from './schemas/account.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('auth')
export class AuthController {
  logger: Logger = new Logger(AuthController.name);
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService
  ) { }

  @Post('signup')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FormatResponseInterceptor)
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      this.logger.log('Creating user.');
      const query = { username: signUpDto.username };
      const isExist = await this.accountService.findOne(query);
      if (isExist) {
        throw new ConflictException('User Already Exist');
      }

      const signUp = new Account(
        signUpDto.username,
        signUpDto.password,
        signUpDto.firstName,
        signUpDto.lastName,
        signUpDto.role,
        signUpDto.email
      );
      const account = await this.accountService.create(signUp);

      const accessToken = this.authService.createAccessToken(account);
      const refreshToken = await this.authService.createRefreshToken(account);
      return { accessToken, refreshToken }
    } catch (error) {
      this.logger.error('Something went wrong in signup:', error);
      throw error;
    }
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FormatResponseInterceptor)
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      this.logger.log('Signing in user.');
      const { username, password } = signInDto;
      const account = await this.accountService.validateAccount(username, password);
      if (!account) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const accessToken = this.authService.createAccessToken(account);
      const refreshToken = await this.authService.createRefreshToken(account);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Something went wrong in signin:', error);
      throw error;
    }
  }

  @Post('refresh_token')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FormatResponseInterceptor)
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {
    try {
      this.logger.log('Refreshing token.');
      const accessToken = await this.authService.verifyRefreshToken(refreshToken);
      return { accessToken }
    } catch (error) {
      this.logger.error('Something went wrong in refreshToken:', error);
      throw error;
    }
  }

  @Post('config')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(FormatResponseInterceptor)
  config() {
    const config = {
      serverTime: Date.now()
    }

    return config;
  }
}