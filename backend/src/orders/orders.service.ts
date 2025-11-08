import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Validate products and check stock
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.product);
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
      }
    }

    // Update stock for each product
    for (const item of createOrderDto.items) {
      await this.productsService.updateStock(item.product, item.quantity);
    }

    const order = new this.orderModel({
      ...createOrderDto,
      user: userId,
    });

    return order.save();
  }

  async findAll(userId?: string): Promise<Order[]> {
    const filter = userId ? { user: userId } : {};
    return this.orderModel
      .find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name price images')
      .exec();
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const filter: any = { _id: id };
    if (userId) {
      filter.user = userId;
    }

    const order = await this.orderModel
      .findOne(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name price images')
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, userId?: string): Promise<Order> {
    const filter: any = { _id: id };
    if (userId) {
      filter.user = userId;
    }

    const updatedOrder = await this.orderModel
      .findOneAndUpdate(filter, updateOrderDto, { new: true })
      .populate('user', 'name email')
      .populate('items.product', 'name price images')
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }
    return updatedOrder;
  }

  async remove(id: string, userId?: string): Promise<void> {
    const filter: any = { _id: id };
    if (userId) {
      filter.user = userId;
    }

    const result = await this.orderModel.findOneAndDelete(filter).exec();
    if (!result) {
      throw new NotFoundException('Order not found');
    }
  }

  async getOrderStats(): Promise<any> {
    const totalOrders = await this.orderModel.countDocuments();
    const totalRevenue = await this.orderModel.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const ordersByStatus = await this.orderModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
    };
  }
}
