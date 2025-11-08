import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    const saved = await createdCategory.save();
    const categoryDoc = await this.categoryModel
      .findById(saved._id)
      .populate('parentCategory', 'name')
      .exec();
    if (!categoryDoc) {
      throw new NotFoundException('Category not found after creation');
    }
    return categoryDoc.toObject() as Category;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel
      .find({ isActive: true, parentCategory: null })
      .populate('parentCategory', 'name')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findAllAdmin(): Promise<Category[]> {
    return this.categoryModel
      .find()
      .populate('parentCategory', 'name')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findSubCategories(parentId: string): Promise<Category[]> {
    // Since parentCategory might be stored as string or ObjectId, try both
    // First try as string (since that's how it appears to be stored)
    let results = await this.categoryModel
      .find({ parentCategory: parentId, isActive: true })
      .populate('parentCategory', 'name')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
    
    // If no results, try as ObjectId
    if (results.length === 0) {
      try {
        const objectId = new Types.ObjectId(parentId);
        results = await this.categoryModel
          .find({ parentCategory: objectId, isActive: true })
          .populate('parentCategory', 'name')
          .sort({ sortOrder: 1, name: 1 })
          .exec();
      } catch (error) {
        // Invalid ObjectId, return empty results
        console.error('Invalid parentId format:', error);
      }
    }
    
    return results;
  }

  async findSubCategoriesAdmin(parentId: string): Promise<Category[]> {
    // Since parentCategory might be stored as string or ObjectId, try both
    // First try as string (since that's how it appears to be stored)
    let results = await this.categoryModel
      .find({ parentCategory: parentId })
      .populate('parentCategory', 'name')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
    
    // If no results, try as ObjectId
    if (results.length === 0) {
      try {
        const objectId = new Types.ObjectId(parentId);
        results = await this.categoryModel
          .find({ parentCategory: objectId })
          .populate('parentCategory', 'name')
          .sort({ sortOrder: 1, name: 1 })
          .exec();
      } catch (error) {
        // Invalid ObjectId, return empty results
        console.error('Invalid parentId format:', error);
      }
    }
    
    return results;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findById(id)
      .populate('parentCategory', 'name')
      .exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .populate('parentCategory', 'name')
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }
    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Category not found');
    }
  }
}
