import { INotificationProvider, NotificationPayload, DeliveryResult, DeliveryChannel } from '../types';

// Mocking Resend SDK for this scaffold
// import { Resend } from 'resend';

export class ResendProvider implements INotificationProvider {
  name = 'Resend';
  // private client: Resend;
  private defaultFrom: string;

  constructor() {
    // this.client = new Resend(process.env.RESEND_API_KEY);
    this.defaultFrom = process.env.RESEND_FROM_EMAIL || 'ALIF Notifications <noreply@alif-foundation.org>';
  }

  supportsChannel(channel: DeliveryChannel): boolean {
    return channel === 'email';
  }

  async send(payload: NotificationPayload, channel: DeliveryChannel): Promise<DeliveryResult> {
    if (!this.supportsChannel(channel)) {
      throw new Error(`ResendProvider does not support channel: ${channel}`);
    }

    try {
      // Mock implementation
      console.log(`[ResendProvider] Sending email to ${payload.to} with subject "${payload.subject || 'Notification'}"`);
      
      // const data = await this.client.emails.send({
      //   from: this.defaultFrom,
      //   to: payload.to,
      //   subject: payload.subject || 'ALIF Notification',
      //   html: payload.message // Alternatively use React templates
      // });

      return {
        success: true,
        messageId: `mock_email_id_${Date.now()}`, // data.id
        status: 'queued'
      };
    } catch (error: any) {
      console.error(`[ResendProvider Error]`, error);
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }
}
