import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { IConfiguration } from 'src/shared/interfaces/config.interface';
import { IFacebookUser } from 'src/shared/interfaces/facebook.interface';

@Injectable()
export class ServerConfigService {
  constructor(
    private readonly httpService: HttpService
  ) {}

  async getServerConfig(): Promise<IConfiguration> {
    const facebookUser = await this.getFacebookUser();

    const serverConfig: IConfiguration = { facebookUser }
    return serverConfig;
  }

  private async getFacebookUser(): Promise<IFacebookUser> {
    const fbUserId = process.env.FB_USER_ID;
    const accessToken = '835097325034034|QpIS1kwIGS2kEHwpjiTRBvBTFQY';
    const url = `http://graph.facebook.com/${fbUserId}?access_token=${accessToken}&fields=name,email,picture.width(200).height(200)`;
    try {
      return await firstValueFrom(
        this.httpService.get(url).pipe(
          map((resp) => resp.data as IFacebookUser)
        ));
    } catch {
      return
    }
  }
}
