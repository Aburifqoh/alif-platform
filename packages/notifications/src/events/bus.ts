type EventCallback = (payload: any) => Promise<void> | void;

export class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  /**
   * Subscribe to a domain event.
   */
  public on(eventName: string, callback: EventCallback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)?.push(callback);
  }

  /**
   * Emit a domain event.
   * Listeners are executed asynchronously to avoid blocking the main thread.
   */
  public emit(eventName: string, payload: any) {
    const callbacks = this.listeners.get(eventName) || [];
    
    // Fire and forget
    Promise.allSettled(callbacks.map(cb => cb(payload))).catch(err => {
      console.error(`[EventBus] Error in event ${eventName}:`, err);
    });
  }
}

export const eventBus = new EventBus();
