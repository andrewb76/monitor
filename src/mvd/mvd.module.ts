import { Module } from '@nestjs/common';
import { MvdService } from './mvd.service';
import { Phone } from 'src/entities/Phone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Phone]),
  ],
  providers: [MvdService],
  exports: [MvdService],
})
export class MvdModule {}
