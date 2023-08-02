import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    url: `${process.env.PG_URL}`,
    entities: [__dirname+'/../**/entities/*.entity.{ts,js}'],
    migrations: [__dirname+'/../migrations/*.{ts,js}'],
    ssl: {},
    autoLoadEntities: true,
    synchronize: false,
    logging: true,
}

console.log(config)

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);