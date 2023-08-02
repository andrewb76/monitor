import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
    ims: {
        url: `${process.env.AMQP_IMS_URL}`,
        queue_data_in: `${process.env.AMQP_IMS_Q_IN}`,
        queue_data_it_opt: { 
            durable: false 
        },
    },
    mvd: {
        url: `${process.env.AMQP_MVD_URL}`,
        queue_monitor_in: `${process.env.AMQP_MVD_Q_MONITOR_IN}`,
        queue_monitor_in_opt: { 
            durable: false 
        },
        queue_data_out: `${process.env.AMQP_MVD_Q_DATA_OUT}`,
        queue_data_out_opt: { 
            durable: false 
        },
    },
}

console.log(config)

export default registerAs('amqp', () => config)