import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Phone } from 'src/entities/Phone.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MvdService {
    constructor(
        @InjectRepository(Phone) private phonesRepository: Repository<Phone>,
    ) {}

    async isFound (phone: string) {
        const phoneNum = await this.phonesRepository.findOne({ where: { phoneNumber: phone }, select: ['id'] });
        return !!phoneNum;
    }

    async addPhone (phone: string) {
        return await this.phonesRepository.createQueryBuilder()
            .insert()
            .into(Phone)
            .values({ phoneNumber: phone })
            .orIgnore()
            .execute();
    }
    
    async removePhone (phone: string) {
        return await this.phonesRepository.createQueryBuilder()
        .delete()
        .from(Phone)
        .where("phoneNumber = :phone", { phone })
        .execute();
    }
}
