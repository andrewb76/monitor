import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { Observable } from 'rxjs';

const mvd_monitor_q = "mvd_monitor_queue";
const mvd_q = "mvd_queue";
const ims_q = "ims_queue";


@Injectable()
export class AmqpService implements OnModuleDestroy {
    private logger = new Logger('amqp');
    private mvdConnection;
    private imsConnection;
    private mvdChannel;
    private mvdSendChannel;
    private imsChannel;

    constructor(
      private readonly config: ConfigService,
    ) {
      // config.get('amqp');
    }

    async sendToMvd (payload: any) {
      
      return await this.mvdSendChannel.sendToQueue(this.config.get('amqp.mvd.queue_data_out'), Buffer.from(JSON.stringify(payload)))
      // this.mvdSendChannel.sendToQueue(mvd_q, Buffer.from('something to do'))
    }

    async onMvdEvent () {
      return new Observable((subscriber) => {
        this.logger.log('onMvdEvent initializing ...')
        amqp.connect(this.config.get('amqp.mvd.url'))
          .then(conn => {
            this.mvdConnection = conn;
            return Promise.all([
              conn.createChannel(),
              conn.createChannel(),
            ]); 
          })
          .then(([mvdChannel, mvdSendChannel]) => {
            this.mvdChannel = mvdChannel;
            this.mvdSendChannel = mvdSendChannel;
            mvdSendChannel.assertQueue(this.config.get('amqp.mvd.queue_data_out'), this.config.get('amqp.mvd.queue_data_out_opt'));
            mvdChannel.assertQueue(this.config.get('amqp.mvd.queue_monitor_in'), this.config.get('amqp.mvd.queue_monitor_in_opt'));
            mvdChannel.consume('',
              (message) => {
                if (message) {
                  subscriber.next(message);
                }
              },
              { noAck: true }
            );
          })
          .catch(err => {
            subscriber.error(err);
          });
      });
    }

    async onImsEvent () {
      return new Observable((subscriber) => {
        this.logger.log('onImsEvent initializing ...')
        amqp.connect(this.config.get('amqp.ims.url'))
          .then(conn => {
            this.imsConnection = conn;
            return conn.createChannel();
          })
          .then(imsChannel => {
            this.imsChannel = imsChannel;
            imsChannel.assertQueue(this.config.get('amqp.ims.queue_data_in'), this.config.get('amqp.ims.queue_data_in_opt'));
            imsChannel.consume('',
              (message) => {
                if (message) {
                  subscriber.next(message);
                }
              },
              { noAck: true }
            );
          })
          .catch(err => {
            subscriber.error(err);
          });
      });
    }

    async onModuleDestroy() {
        this.logger.log('onModuleDestroy terminate connections ...')
        await this.mvdChannel.close();
        await this.mvdSendChannel.close();
        await this.imsChannel.close();
        await this.mvdConnection.close();
        await this.imsConnection.close();
        this.logger.log('onModuleDestroy connections terminated.')
    }
}
