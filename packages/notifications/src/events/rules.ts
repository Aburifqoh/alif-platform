import { eventBus } from './bus';
import { notificationEngine } from '../engine';

/**
 * Initializes all automated notification rules.
 * This listens for domain events and triggers the appropriate notification campaigns/queues.
 */
export function initializeNotificationRules() {
  
  // Example Rule 1: Hostel Application Approved
  eventBus.on('hostel.application.approved', async (payload) => {
    console.log('[Rule Engine] Processing hostel.application.approved for:', payload);
    
    // In a real implementation:
    // 1. Fetch user preferences from `notification_preferences`
    // 2. Fetch the `HOSTEL_APPLICATION_APPROVED` template
    // 3. Queue the notification via NotificationEngine
    
    await notificationEngine.send('email', {
      to: payload.email,
      subject: 'Hostel Application Approved',
      message: `Dear ${payload.name}, your hostel application has been approved.`
    });

    // Note: WhatsApp logic would check opt-in before sending.
  });

  // Example Rule 2: Donation Received
  eventBus.on('donation.received', async (payload) => {
    console.log('[Rule Engine] Processing donation.received for:', payload);
    
    await notificationEngine.send('email', {
      to: payload.email,
      subject: 'Donation Receipt',
      message: `Jazakallah Khairan for your donation of ${payload.amount}.`
    });
  });

}
