import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { WebhooksService } from './webhooks.service'
import { PaginatedWebhookResponse, Webhook, WebhookDTO } from './webhooks.interface'
import { PrivateApiGuard } from '../middlewares/private-api.guard'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PaginatedResponse } from '../common/models'

@ApiBearerAuth()
@Controller('webhooks')
@UseGuards(PrivateApiGuard)
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiResponse({
    status: 200,
    description:
      'The webhooks have been successfully retrieved. Requires private API key in Bearer token.',
    type: PaginatedWebhookResponse,
  })
  async getWebhooks(): Promise<PaginatedWebhookResponse> {
    const result = await this.webhooksService.getWebhooks()
    return {
      results: result,
      limit: 0,
      offset: 0,
      total: result.length,
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a webhook' })
  @ApiResponse({
    status: 200,
    description:
      'The webhook has been successfully created. Requires private API key in Bearer token.',
    type: Webhook,
  })
  async createWebhook(@Body() webhookDTO: WebhookDTO) {
    return this.webhooksService.createWebhook(webhookDTO)
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a webhook' })
  @ApiResponse({
    status: 200,
    description:
      'The webhook has been successfully deleted. Requires private API key in Bearer token.',
  })
  async deleteWebhook(@Param('uuid') uuid: string) {
    return this.webhooksService.deleteWebhook(uuid)
  }
}
