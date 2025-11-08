import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  price: number;

  @Prop()
  originalPrice?: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  subCategory: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  unit: string; // kg, piece, bag, etc.

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop()
  whatsappMessage: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: [] })
  tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);