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
    UploadedFiles,
} from '@nestjs/common';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { ProductDTO } from '../../service/dto/product.dto';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../../service/product.service';
import { SearchProductDTO } from '../../service/dto/search-product.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { MediaDTO } from '../../service/dto/media.dto';
import { storage } from '../../utils/storage';
import sharp from 'sharp';
import { readFileSync } from 'fs';

@Controller('api/product')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
// @UseGuards(AuthGuard, RolesGuard)
// @ApiBearerAuth()
@ApiUseTags('product-resource')
export class ProductController {
    logger = new Logger('ProductController');

    constructor(private readonly productService: ProductService) {}

    @Get('/get-all')
    // @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of products' })
    @ApiResponse({
        status: 200,
        description: 'List all products',
        type: ProductDTO,
    })
    async getAllProducts(@Req() req: Request): Promise<ProductDTO[]> {
        const products = await this.productService.findAll();

        return products;
    }

    @Get('/search')
    // @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of products' })
    @ApiResponse({
        status: 200,
        description: 'List all products searched',
        type: ProductDTO,
    })
    async searchProducts(@Req() req: Request): Promise<any> {
        const searchProductDTO: SearchProductDTO = req.query;

        const products = await this.productService.search(searchProductDTO);

        const count = await this.productService.countBySearch(searchProductDTO);

        return { products, count };
    }

    @Get('/get-by-id/:id')
    // @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of products' })
    @ApiResponse({
        status: 200,
        description: 'List all products',
        type: ProductDTO,
    })
    async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductDTO> {
        const productFound = await this.productService.findById(id);

        if (!productFound) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        return productFound;
    }

    @Post('/create')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create product' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ProductDTO,
    })
    @UseInterceptors(AnyFilesInterceptor(storage))
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createProduct(@Req() req: Request, @Body() productDTO: ProductDTO, @UploadedFiles() files): Promise<any> {
        const userReq = req.user?.login;
        const theMediaDTO: MediaDTO[] = [];

        files.forEach(file => {
            if (file.mimetype.includes('image')) {
                const buffer = readFileSync(file.path);

                sharp(buffer)
                    .resize(200, 200)
                    .toFile(`./uploads/the-media-resize/${file.filename}`, (err, info) => {
                        if (err) {
                            throw new HttpException('Resize File Failed', HttpStatus.BAD_REQUEST);
                        }

                        theMediaDTO.push({
                            type: file.mimetype,
                            fileName: file.filename,
                        });
                    });
            }
        });

        productDTO.createdBy = userReq;
        productDTO.categories = JSON.parse(productDTO.categories);
        productDTO.theMedia = theMediaDTO;

        const productCreated = await this.productService.saveWithTheMedia(productDTO);

        return productCreated;
    }

    @Put('/update')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update product' })
    @UseInterceptors(AnyFilesInterceptor(storage))
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ProductDTO,
    })
    async updateProduct(
        @Req() req: Request,
        @UploadedFiles() files,
    ): Promise<ProductDTO> {
        const productDTO: ProductDTO = JSON.parse(req.body.product);
        const theMediaDTO: MediaDTO[] = [];

        files.forEach(file => {
            if (file.mimetype.includes('image')) {
                const buffer = readFileSync(file.path);

                sharp(buffer)
                    .resize(200, 200)
                    .toFile(`./uploads/the-media-resize/${file.filename}`, (err, info) => {
                        if (err) {
                            throw new HttpException('Resize File Failed', HttpStatus.BAD_REQUEST);
                        }

                        theMediaDTO.push({
                            type: file.mimetype,
                            fileName: file.filename,
                        });
                    });
            }
        });

        const productFoundById = await this.productService.findById(productDTO.id);

        if (!productFoundById) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        const userReq = req.user?.login;
        productDTO.lastModifiedBy = userReq;
        productDTO.theMedia = theMediaDTO;

        const productUpdated = await this.productService.updateWithTheMedia(productDTO);

        return productUpdated;
    }

    @Delete('/delete/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete product' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
        type: ProductDTO,
    })
    async deleteProduct(@Param('id') id: number): Promise<ProductDTO> {
        const productToDelete = await this.productService.findById(id);

        if (!productToDelete) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        return await this.productService.delete(productToDelete);
    }
}
