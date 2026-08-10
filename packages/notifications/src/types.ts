export type DeliveryChannel = 'whatsapp' | 'sms' | 'email' | 'in-app';

export interface NotificationPayload {
  to: string; // phone number, email, or user id
  message: string;
  subject?: string; // used for email
  metadata?: Record<string, any>;
}

export interface DeliveryResult {
  success: boolean;
  messageId?: string; // Provider's message ID for webhook tracking
  error?: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
}

export interface INotificationProvider {
  name: string;
  supportsChannel(channel: DeliveryChannel): boolean;
  send(payload: NotificationPayload, channel: DeliveryChannel): Promise<DeliveryResult>;
}
