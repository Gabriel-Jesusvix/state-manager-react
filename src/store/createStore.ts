/* eslint-disable no-shadow */

import { useSyncExternalStore } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
type SetterFn<T> = (prevState: T) => Partial<T>;
type SetStateFn<T> = (partilState: Partial<T> | SetterFn<T>) => void;

export function createStore<TState extends Record<string, any>>(
  createState: (setState: SetStateFn<TState>, getState: () => TState) => TState,
) {
  let state: TState;
  let listeners: Set<() => void>;

  function notifyListeners() {
    listeners.forEach((listener) => listener());
  }

  function setState(partilState: Partial<TState> | SetterFn<TState>) {
    const newValue =
      typeof partilState === 'function' ? partilState(state) : partilState;

    state = {
      ...state,
      ...newValue,
    };
    notifyListeners();
  }

  function getState() {
    return state;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function useStore<TValue>(
    selector: (currentState: TState) => TValue,
  ): TValue {
    return useSyncExternalStore(subscribe, () => selector(state));
  }

  state = createState(setState, getState);
  listeners = new Set();

  return useStore;
}
