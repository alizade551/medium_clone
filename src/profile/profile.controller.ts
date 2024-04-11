import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { ProfileResponseInterface } from './types/profileResponse';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User() currentUserId: number,
    @Param('profileUsername') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      profileUsername,
    );

    return this.profileService.buildProfileResponse(profile);
  }
}
