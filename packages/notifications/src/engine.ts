import { INotificationProvider, NotificationPayload, DeliveryResult, DeliveryChannel } from './types';
import { TwilioProvider } from './providers/twilio';
import { ResendProvider } from './providers/resend';

export class NotificationEngine {
  private providers: INotificationProvider[] = [];

  constructor() {
    // Register default providers
    this.registerProvider(new TwilioProvider());
    this.registerProvider(new ResendProvider());
  }

  public registerProvider(provider: INotificationProvider) {
    this.providers.push(provider);
  }

  /**
   * Retrieves the first registered provider that supports the given channel.
   */
  private getProviderForChannel(channel: DeliveryChannel): INotificationProvider {
    const provider = this.providers.find(p => p.supportsChannel(channel));
    if (!provider) {
      throw new Error(`No notification provider registered for channel: ${channel}`);
    }
    return provider;
  }

  /**
   * Sends a notification through the specified channel.
   */
  public async send(channel: DeliveryChannel, payload: NotificationPayload): Promise<DeliveryResult> {
    const provider = this.getProviderForChannel(channel);
    
    // In a real implementation, you might want to log this attempt to `notification_deliveries` here
    // with status='queued' before calling provider.send()
    
    const result = await provider.send(payload, channel);
    
    // Update `notification_deliveries` with the result status and messageId
    
    return result;
  }

  /**
   * Used for bulk campaigns. Queues the messages instead of sending immediately.
   * This would typically push to a Redis queue or Upstash QStash.
   */
  public async enqueueBatch(channel: DeliveryChannel, payloads: NotificationPayload[]) {
    // Mock queueing logic
    console.log(`[NotificationEngine] Queuing ${payloads.length} messages for channel ${channel}`);
    
    // For demonstration, just sending them synchronously
    for (const payload of payloads) {
      await this.send(channel, payload);
    }
  }
}

// Export a singleton instance
export const notificationEngine = new NotificationEngine();
