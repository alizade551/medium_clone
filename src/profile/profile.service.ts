import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProfileType } from './types/profile.type';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Equal, Repository } from 'typeorm';
import { ProfileResponseInterface } from './types/profileResponse';
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}
  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: Equal(profileUsername) },
    });

    if (!user) {
      throw new NotFoundException('Profile does not exist');
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: Equal(currentUserId),
        followingId: Equal(user.id),
      },
    });

    return { ...user, following: Boolean(follow) };
  }

  async followProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!user) {
      throw new NotFoundException('Profile does not exist');
    }

    if (currentUserId === user.id) {
      throw new BadRequestException('Follower and Following cant be equal');
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: Equal(currentUserId),
        followingId: Equal(user.id),
      },
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };
  }

  async unFollowProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!user) {
      throw new NotFoundException('Profile does not exist');
    }

    if (currentUserId === user.id) {
      throw new BadRequestException('Follower and Following cant be equal');
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: Equal(currentUserId),
        followingId: Equal(user.id),
      },
    });

    if (follow) {
      await this.followRepository.delete({
        followerId: Equal(currentUserId),
        followingId: Equal(user.id),
      });
    }

    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }
}
