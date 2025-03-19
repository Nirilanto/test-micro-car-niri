import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto, UserResponseDto } from '@app/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(registerDto: RegisterDto): Promise<UserResponseDto> {
    const { email, password } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    // Sauvegarder dans la base de données
    await this.usersRepository.save(user);

    // Retourner la réponse sans le mot de passe
    const { password: _, ...result } = user;
    return result as UserResponseDto;
  }

  async validateUser(email: string, password: string): Promise<UserResponseDto | null> {

    console.log(" MIPASS ATO LEGAAAA!!!!!!");
    let user;
    try {
      user = await this.findOneByEmail(email);
      console.log(' REPONNNNNNNNNNNNNN ITO NY TEN ERRROOORRA ', user);
    } catch (error) {
      console.log(' ITO NY TEN ERRROOORRA ', error);

    }

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result as UserResponseDto;
    }

    return null;
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    user.isEmailVerified = true;
    await this.usersRepository.save(user);
  }
}