import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    const saved = await createdProduct.save();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productDoc: any = await this.productModel
      .findById(saved._id)
      .populate('subCategory', 'name parentCategory')
      .populate({ path: 'subCategory', populate: { path: 'parentCategory', select: 'name' } })
      .exec();
    if (!productDoc) {
      throw new NotFoundException('Product not found after creation');
    }
    return productDoc.toObject() as Product;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel
      .find({ isActive: true })
      .populate('subCategory', 'name parentCategory')
      .populate({ path: 'subCategory', populate: { path: 'parentCategory', select: 'name' } })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findAllAdmin(): Promise<Product[]> {
    return this.productModel
      .find()
      .populate('subCategory', 'name parentCategory')
      .populate({ path: 'subCategory', populate: { path: 'parentCategory', select: 'name' } })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findBySubCategory(subCategoryId: string): Promise<Product[]> {
    return this.productModel
      .find({ subCategory: subCategoryId, isActive: true })
      .populate('subCategory', 'name parentCategory')
      .populate({ path: 'subCategory', populate: { path: 'parentCategory', select: 'name' } })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    // Find all sub-categories of this category, then find products in those sub-categories
    // Since parentCategory might be stored as string or ObjectId, try both
    // First try as string (since that's how it appears to be stored)
    let subCategories = await this.categoryModel
      .find({ parentCategory: categoryId })
      .select('_id')
      .exec();
    
    // If no results, try as ObjectId
    if (subCategories.length === 0) {
      try {
        const objectId = new Types.ObjectId(categoryId);
        subCategories = await this.categoryModel
          .find({ parentCategory: objectId })
          .select('_id')
          .exec();
      } catch (error) {
        // Invalid ObjectId, return empty products
        console.error('Invalid categoryId format:', error);
        return [];
      }
    }
    
    const subCategoryIds = subCategories.map((sc) => sc._id);
    
    if (subCategoryIds.length === 0) {
      return [];
    }
    
    return this.productModel
      .find({ subCategory: { $in: subCategoryIds }, isActive: true })
      .populate('subCategory', 'name parentCategory')
      .populate({ path: 'subCategory', populate: { path: 'parentCategory', select: 'name' } })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('subCategory', 'name parentCategory')
      .populate({ path: 'subCategory', populate: { path: 'parentCategory', select: 'name' } })
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('subCategory', 'name parentCategory')
      .populate({ path: 'subCategory', populate: { path: 'parentCategory', select: 'name' } })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }

  async search(query: string): Promise<Product[]> {
    return this.productModel
      .find({
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } },
            ],
          },
        ],
      })
      .populate('subCategory', 'name parentCategory')
      .populate({ path: 'subCategory', populate: { path: 'parentCategory', select: 'name' } })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async updateStock(productId: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    
    product.stock -= quantity;
    return product.save();
  }
}