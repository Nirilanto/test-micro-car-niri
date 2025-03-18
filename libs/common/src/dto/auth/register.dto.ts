// libs/common/src/dto/auth/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur. Doit contenir au moins 6 caractères avec une majuscule, une minuscule et un chiffre.',
    example: 'Password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe est trop faible',
  })
  password: string;
}