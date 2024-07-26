import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Refresh_Token } from 'src/modules/auth/schemas/refresh_token.schema';

@Injectable()
export class RefreshTokenService {
  logger: Logger = new Logger(RefreshTokenService.name);
  constructor(
    @InjectModel(Refresh_Token.name) private refreshTokenModel: Model<Refresh_Token>,
  ) { }
  
  findOne(accountId: string, refreshToken: string) {
    this.logger.log('Finding refresh token.');
    let accountIdObj = new mongoose.Types.ObjectId(accountId);
    return this.refreshTokenModel.findOne({ accountId: accountIdObj, token: refreshToken });
  }

  create(accountId: mongoose.Types.ObjectId, token: string, expiresAt: Date) {
    this.logger.log('Creating refresh token.');
    const refreshToken = new Refresh_Token(accountId, token, expiresAt);
    const newRefreshToken = new this.refreshTokenModel(refreshToken);
    return newRefreshToken.save();
  }

  findOneAndUpdate(accountId: mongoose.Types.ObjectId, token: string, expiresAt: Date) {
    this.logger.log('Updating refresh token.');
    return this.refreshTokenModel.findOneAndUpdate(
      { accountId },
      { token, expiresAt },
      { new: true, upsert: true }
    );
  }

  findOneAndRemove(accountId: mongoose.Types.ObjectId) {
    this.logger.log('Deleting refresh token.');
    return this.refreshTokenModel.findOneAndDelete({ accountId })
  }
}
