import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
    port: `${process.env.PORT}`,
}

console.log(config)

export default registerAs('main', () => config)