import { Controller, UseGuards, Get, UsePipes, ValidationPipe, Body, Request, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostModel } from '../database/models/post.model';

@ApiTags("post")
@UseGuards(AuthenticatedGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  
  @UsePipes(new ValidationPipe())
  @Get("/all")
  async getAll(
    @Body() opts: PostGetOptionsDto,
    @Request() req
  ): Promise<PostModel[]> {
    let options = { userId: req.user.id, ...opts} as PostGetOptionsDto;
    return await this.postService.getAll(options);
  }

  @UsePipes(ParseIntPipe)
  @Get("/user/:id")
  async getByUser(@Param('id') id: number): Promise<PostModel[]> {
    return await this.postService.getByUser(id);
  }
  
  @UsePipes(ParseIntPipe)
  @Get("/:id")
  async getById(@Param('id') id: number): Promise<PostModel> {
    return await this.postService.getById(id);
  } 
}
