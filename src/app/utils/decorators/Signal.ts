import { signal, WritableSignal } from '@angular/core';

export function Signal<T>(target: any, propertyKey: string) {
  const _signal: WritableSignal<T> = signal(target[propertyKey]);

  // Используем Proxy, чтобы перехватывать операции чтения и записи
  Object.defineProperty(target, propertyKey, {
    get() {
      return _signal();
    },
    set(value: T) {
      _signal.set(value);
    },
  });
}
