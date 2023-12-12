type Subscriber<T> = (value: T) => void;
type Unsubscriber = () => void;

export default class EventNotifier<T> {
  private _nextId = 0;
  private readonly _subscribers = new Map<number, Subscriber<T>>();

  subscribe(subscriber: Subscriber<T>): Unsubscriber {
    const id = this._nextId++;
    this._subscribers.set(id, subscriber);
    return () => this._subscribers.delete(id);
  }

  notify(value: T) {
    this._subscribers.forEach(sub => sub(value));
  }
}