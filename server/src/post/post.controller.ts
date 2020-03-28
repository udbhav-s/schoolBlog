import { 
  Controller,
  UseGuards,
  Get,
  UsePipes, 
  ValidationPipe, 
  Body, 
  Request, 
  Param, 
  ParseIntPipe, 
  Post, 
  Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostCreateDto } from './dto/postCreate.dto';
import { PostModel } from '../database/models/post.model';

@ApiTags("post")
@UseGuards(AuthenticatedGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  
  @UsePipes(ValidationPipe)
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

  @UsePipes(ValidationPipe)
  @Post("/create")
  async create(@Body() data: PostCreateDto, @Request() req): Promise<PostModel> {
    let body = { userId: req.user.id, ...data } as PostCreateDto;
    return await this.postService.create(body);
  }

  @UsePipes(ValidationPipe)
  @Post("/update/:id")
  async update(@Body() data: PostCreateDto, @Param('id') id: number): Promise<PostModel> {
    return await this.postService.update(id, data);
  }
}
