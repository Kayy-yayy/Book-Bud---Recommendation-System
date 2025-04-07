import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Add React types that are missing
declare module 'react' {
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ReactNode = React.ReactNode;
  export type CSSProperties = React.CSSProperties;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
  export type FocusEvent<T = Element> = React.FocusEvent<T>;
  export type HTMLAttributes<T = Element> = React.HTMLAttributes<T>;
  export type DetailedHTMLProps<E, T> = React.DetailedHTMLProps<E, T>;
  
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any> | undefined): T;
  export function useRef<T = undefined>(initialValue: T): { current: T };
  export function useContext<T>(context: React.Context<T>): T;
}
