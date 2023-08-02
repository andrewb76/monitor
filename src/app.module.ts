import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AmqpModule } from './amqp/amqp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import amqp from './config/amqp';
import main from './config/main';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MvdModule } from './mvd/mvd.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [main, typeorm, amqp]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm')),
    }),
    MvdModule,
    AmqpModule,
  ],
  providers: [AppService],
})
export class AppModule {}
