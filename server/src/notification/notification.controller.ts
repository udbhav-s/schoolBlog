import { Controller, UseGuards, UseInterceptors, Get, Req, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { NotificationModel } from 'src/database/models/notification.model';

@ApiTags('notification')
@ApiBasicAuth()
@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({ summary: "Get all notifications for a user" })
  @Get('/all')
  async getAll(
    @Req() req
  ): Promise<NotificationModel[]> {
    return await this.notificationService.getByRecipient(req.user.id);
  }

  @ApiOperation({ summary: "Delete a notification" })
  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ) {
    return await this.notificationService.del(id, req.user.id);
  }

  @ApiOperation({ summary: "Delete all notifications for user" })
  @Delete('/all')
  async deleteAll(
    @Req() req
  ) {
    return await this.notificationService.deleteAllForRecipient(req.user.id);
  }
}
