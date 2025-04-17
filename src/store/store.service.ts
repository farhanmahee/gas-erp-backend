import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entity/Store';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find({
      relations: ['products'],
    });
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { store_id: id },
      relations: ['products'],
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async create(storeData: Partial<Store>): Promise<Store> {
    const store = this.storeRepository.create(storeData);
    return this.storeRepository.save(store);
  }

  async update(id: number, storeData: Partial<Store>): Promise<Store> {
    await this.storeRepository.update(id, storeData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.storeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
  }

  async findByCode(storeCode: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { store_code: storeCode },
      relations: ['products'],
    });
    if (!store) {
      throw new NotFoundException(`Store with code ${storeCode} not found`);
    }
    return store;
  }
}
