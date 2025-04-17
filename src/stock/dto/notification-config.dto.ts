import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../types/notification.types';
import { Role } from '../../auth/role.enum';

export class RecipientConfigDto {
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsArray()
  @IsEnum(NotificationType, { each: true })
  notificationTypes: NotificationType[];
}

export class UpdateRecipientDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsArray()
  @IsEnum(NotificationType, { each: true })
  notificationTypes?: NotificationType[];
}

export class NotificationConfigDto {
  @IsBoolean()
  enabled: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientConfigDto)
  recipients: RecipientConfigDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  throttleInterval?: number;
}

export class UpdateNotificationConfigDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientConfigDto)
  recipients?: RecipientConfigDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  throttleInterval?: number;
}
