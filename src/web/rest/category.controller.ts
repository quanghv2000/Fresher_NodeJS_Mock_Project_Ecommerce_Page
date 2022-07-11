import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { CategoryDTO } from '../../service/dto/category.dto';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from '../../service/category.service';

@Controller('api/category')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
// @UseGuards(AuthGuard, RolesGuard)
// @ApiBearerAuth()
@ApiUseTags('category-resource')
export class CategoryController {
    logger = new Logger('CategoryController');

    constructor(private readonly categoryService: CategoryService) {}

    @Get('/get-all')
    // @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of categories' })
    @ApiResponse({
        status: 200,
        description: 'List all categories',
        type: CategoryDTO,
    })
    async getAllCategories(@Req() req: Request): Promise<CategoryDTO[]> {
        const categories = await this.categoryService.findAll();

        return categories;
    }

    @Get('/get-by-id/:id')
    // @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of categories' })
    @ApiResponse({
        status: 200,
        description: 'List all categories',
        type: CategoryDTO,
    })
    async getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<CategoryDTO> {
        const categoryFound = await this.categoryService.findById(id);

        if (!categoryFound) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        return categoryFound;
    }

    @Post('/create')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create category' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CategoryDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createCategory(@Req() req: Request, @Body() categoryDTO: CategoryDTO): Promise<CategoryDTO> {
        const userReq = req.user?.login;
        categoryDTO.createdBy = userReq;
        const categoryCreated = await this.categoryService.save(categoryDTO);

        return categoryCreated;
    }

    @Put('/update')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update category' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CategoryDTO,
    })
    async updateCategory(@Req() req: Request, @Body() categoryDTO: CategoryDTO): Promise<CategoryDTO> {
        const categoryFoundById = await this.categoryService.findById(categoryDTO.id);

        if (!categoryFoundById) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        const userReq = req.user?.login;
        categoryDTO.lastModifiedBy = userReq;

        const categoryUpdated = await this.categoryService.update(categoryDTO);

        return categoryUpdated;
    }

    @Delete('/delete/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete category' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
        type: CategoryDTO,
    })
    async deleteCategory(@Param('id') id: number): Promise<CategoryDTO> {
        const categoryToDelete = await this.categoryService.findById(id);

        if (!categoryToDelete) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        return await this.categoryService.delete(categoryToDelete);
    }
}
