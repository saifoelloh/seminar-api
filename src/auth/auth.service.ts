import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  generateToken(userId: string) {
    const privateKeyPath = __dirname + '/../../private.key';
    const privateKey: jwt.Secret = fs.readFileSync(privateKeyPath);
    const token = jwt.sign({ id: userId }, privateKey, {
      algorithm: 'ES512',
      expiresIn: '1h',
    });

    return token;
  }

  validateToken(token: string) {
    try {
      const publicKeyPath = __dirname + '/../../public.key';
      const publicKey: jwt.Secret = fs.readFileSync(publicKeyPath);
      const isValidToken = jwt.verify(token, publicKey, {
        algorithms: ['ES512'],
      });

      return isValidToken;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
