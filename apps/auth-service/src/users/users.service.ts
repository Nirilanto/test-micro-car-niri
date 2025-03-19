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
    try {
      return await this.usersRepository.findOneBy({ email });
    } catch (error) {
      console.error(`Erreur lors de la recherche d'utilisateur par email: ${error.message}`);
      throw error;
    }
  }

  async findOneById(id: string): Promise<UserResponseDto | null> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        return null;
      }

      // Retirer explicitement le mot de passe de la réponse
      const { password, ...result } = user;
      return result as UserResponseDto;
    } catch (error) {
      console.error(`Erreur lors de la recherche d'utilisateur par ID: ${error.message}`);
      throw error;
    }
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
    console.log(`Validation de l'utilisateur: ${email}`);

    try {
      const user = await this.findOneByEmail(email);

      if (!user) {
        console.log(`Utilisateur non trouvé: ${email}`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log(`Mot de passe invalide pour: ${email}`);
        return null;
      }

      const { password: _, ...result } = user;
      return result as UserResponseDto;
    } catch (error) {
      console.error(`Erreur lors de la validation de l'utilisateur: ${error.message}`);
      throw error;
    }
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    user.isEmailVerified = true;
    await this.usersRepository.save(user);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }
}