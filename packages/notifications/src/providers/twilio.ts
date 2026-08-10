import { INotificationProvider, NotificationPayload, DeliveryResult, DeliveryChannel } from '../types';

// Mocking Twilio SDK for this scaffold
// import { Twilio } from 'twilio';

export class TwilioProvider implements INotificationProvider {
  name = 'Twilio';
  // private client: Twilio;
  private fromWhatsApp: string;
  private fromSMS: string;

  constructor() {
    // this.client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    this.fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // default twilio sandbox
    this.fromSMS = process.env.TWILIO_SMS_NUMBER || '';
  }

  supportsChannel(channel: DeliveryChannel): boolean {
    return channel === 'whatsapp' || channel === 'sms';
  }

  async send(payload: NotificationPayload, channel: DeliveryChannel): Promise<DeliveryResult> {
    if (!this.supportsChannel(channel)) {
      throw new Error(`TwilioProvider does not support channel: ${channel}`);
    }

    try {
      const from = channel === 'whatsapp' ? this.fromWhatsApp : this.fromSMS;
      const to = channel === 'whatsapp' ? `whatsapp:${payload.to}` : payload.to;

      // Mock implementation to avoid requiring real credentials during dev/test
      console.log(`[TwilioProvider] Sending ${channel} to ${to}: ${payload.message}`);
      
      // const message = await this.client.messages.create({
      //   body: payload.message,
      //   from,
      //   to
      // });

      // Mock successful response
      return {
        success: true,
        messageId: `mock_id_${Date.now()}`, // message.sid
        status: 'queued'
      };
    } catch (error: any) {
      console.error(`[TwilioProvider Error]`, error);
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }
}
