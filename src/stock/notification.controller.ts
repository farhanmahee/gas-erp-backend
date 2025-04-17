import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationConfigService } from './notification-config.service';
import {
  NotificationConfig,
  NotificationType,
  RecipientConfig,
} from './types/notification.types';
import {
  NotificationConfigDto,
  UpdateNotificationConfigDto,
  RecipientConfigDto,
  UpdateRecipientDto,
} from './dto/notification-config.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly configService: NotificationConfigService) {}

  @Get('config/:type')
  getNotificationConfig(
    @Param('type') type: NotificationType,
  ): NotificationConfig {
    return this.configService.getNotificationConfig(type);
  }

  @Get('recipients/:type')
  getRecipients(@Param('type') type: NotificationType): RecipientConfig[] {
    return this.configService.getRecipients(type);
  }

  @Put('config/:type')
  updateNotificationConfig(
    @Param('type') type: NotificationType,
    @Body(new ValidationPipe({ whitelist: true }))
    config: UpdateNotificationConfigDto,
  ): void {
    this.configService.updateNotificationConfig(type, config);
  }

  @Post('recipients/:type')
  addRecipient(
    @Param('type') type: NotificationType,
    @Body(new ValidationPipe({ whitelist: true }))
    recipient: RecipientConfigDto,
  ): void {
    this.configService.addRecipient(type, recipient);
  }

  @Put('recipients/:type/:email')
  updateRecipient(
    @Param('type') type: NotificationType,
    @Param('email') email: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updates: UpdateRecipientDto,
  ): void {
    this.configService.updateRecipient(type, email, updates);
  }

  @Delete('recipients/:type/:email')
  removeRecipient(
    @Param('type') type: NotificationType,
    @Param('email') email: string,
  ): void {
    this.configService.removeRecipient(type, email);
  }
}
