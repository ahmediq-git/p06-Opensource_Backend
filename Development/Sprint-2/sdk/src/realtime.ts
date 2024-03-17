import { io } from "socket.io-client";

interface Subscription {
  collection: string;
  query: any; // Replace 'any' with a more specific type for your use case
}

class RealtimeService {
  private socket;
  private subscriptions: { [key: string]: Array<Subscription> } = {};
  private client: any;
  private authStore: any;

//   constructor(serverUrl: string) {
//     this.socket = io(serverUrl);
//     this.setupSocketListeners();
//   }
  constructor(ezBaseClient: any, authStore: any) {
    this.client = ezBaseClient; //passing the client object to send to the user.
    this.authStore = authStore; //passing the authStore object to send to the user.
    this.socket = io(ezBaseClient.socketUrl);
    this.setupSocketListeners();
}

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      // Reinitialize subscriptions on reconnect
      this.reinitializeSubscriptions();
    });

    this.socket.on('subscribed', (response) => {
      console.log('Subscribed to collection:', response.collection);
    });

    this.socket.on('unsubscribed', (response) => {
      console.log('Unsubscribed from collection:', response.collection);
    });

    // Handle other server events as necessary
  }

  // Call this method to subscribe to a collection
  public subscribe(collection: string, query: any, callback: (data: any) => void) {
    const subscription = { collection, query };
    if (!this.subscriptions[collection]) {
      this.subscriptions[collection] = [];
    }
    this.subscriptions[collection].push(subscription);

    // Register the event listener for the collection
    this.socket.on(collection, callback);

    // Notify the server about the new subscription
    this.socket.emit('subscribe', { collection, query });
  }

  // Call this method to unsubscribe from a collection
  public unsubscribe(collection: string) {
    // Remove the local subscription
    if (this.subscriptions[collection]) {
      delete this.subscriptions[collection];
    }

    // Remove all listeners for the event associated with the collection
    this.socket.off(collection);

    // Notify the server about the unsubscription
    this.socket.emit('unsubscribe', { collection });
  }

  // Use this method to reinitialize subscriptions after reconnecting
  private reinitializeSubscriptions() {
    for (const collection in this.subscriptions) {
      for (const subscription of this.subscriptions[collection]) {
        this.socket.emit('subscribe', { collection, query: subscription.query });
      }
    }
  }
}

export default RealtimeService;