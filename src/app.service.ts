import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MvdService } from './mvd/mvd.service';
import { AmqpService } from './amqp/amqp.service';

@Injectable()
export class AppService implements OnModuleInit {
  private logger = new Logger('app:s');
  
  async onModuleInit() {
    
    const $mvdSource = await this.ampqServ.onMvdEvent();
    $mvdSource.subscribe(async (event: any) => {
      // this.logger.log(`In MVD event RAW >> [${JSON.stringify(event)}]`);

      // const { pattern, data: { phone } } = JSON.parse(event.content)
      const { pattern, data } = JSON.parse(event.content)
      if (pattern) {
        this.logger.log(`In MVD event >> [${pattern}](${JSON.stringify(data)})`);
        const phone = data.phone.toString();
        // this.logger.log(`In MVD event >> [${pattern}](${phone})`);
        if (pattern === 'add-phone') {
          await this.mvdServ.addPhone(phone); // Add phone number to monitoring list
        } else if (pattern === 'remove-phone') {
          await this.mvdServ.removePhone(phone);  // Remove phone number from monitoring list
        } else {
          this.logger.warn('MVD Uncknown message', event)
        }
      } else {
        this.logger.warn('MVD Uncknown message', event)
      }
    });
    this.logger.log(" [*] Waiting for MVD messages");
    
    const $imsSource = await this.ampqServ.onImsEvent();
    $imsSource.subscribe(async (event: any) => {
      // this.logger.log(`In IMS event RAW >> [${JSON.stringify(event)}]`);
      
      const { pattern, data: { phone } } = JSON.parse(event.content)
      this.logger.log(`In IMS event >> [${pattern}](${phone})`);
      if (pattern === 'phone-event') {
        const underMonitoring = await this.mvdServ.isFound(phone.toString()); // Check phone number in monitoring list
        if (underMonitoring) {
          this.logger.log(`Phon number [${phone}] >> under monitoring !, send notify`);
          this.ampqServ.sendToMvd(event);
        } else {
          this.logger.log(`Phon number [${phone}] >> not in list, skip it.`);
        }
      } else {
        this.logger.warn('IMS Uncknown message', event)
      }
      // const { data } = JSON.parse(event.content)
      // this.logger.log(`In IMS data >> (${JSON.stringify(data)})`);

    });
    this.logger.log(" [*] Waiting for IMS messages");
  }

  constructor(
    private readonly mvdServ: MvdService,
    private readonly ampqServ: AmqpService,
  ) {}
}
