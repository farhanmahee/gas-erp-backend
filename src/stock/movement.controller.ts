import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MovementTrackerService } from './movement-tracker.service';
import { User } from '../entity/User';
import { CreateMovementDto } from './dto/movement.dto';

@Controller('movements')
@UseGuards(JwtAuthGuard)
export class MovementController {
  constructor(private readonly movementService: MovementTrackerService) {}

  @Post()
  async recordMovement(
    @Body() movement: CreateMovementDto,
    @Param('user') user: User,
  ) {
    return this.movementService.recordMovement(
      movement.cylinderId,
      movement.sourceLocationId,
      movement.destinationLocationId,
      movement.movementType,
      user,
      movement.price,
      movement.remarks,
    );
  }

  @Get('cylinder/:cylinderId')
  async getCylinderHistory(@Param('cylinderId') cylinderId: number) {
    return this.movementService.getMovementHistory(cylinderId);
  }
}
