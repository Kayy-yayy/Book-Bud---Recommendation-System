// Type definitions for React 18.0
// Project: https://react.dev/
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4.1

declare namespace React {
  // React Elements and Components
  type ReactNode = 
    | React.ReactElement 
    | string 
    | number 
    | boolean 
    | null 
    | undefined 
    | React.ReactNodeArray;
  
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  type ReactNodeArray = Array<ReactNode>;
  type Key = string | number;
  
  type JSXElementConstructor<P> = 
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);
  
  // Component Types
  interface Component<P = {}, S = {}> {
    render(): ReactNode;
    props: Readonly<P>;
    state: Readonly<S>;
    setState(state: S | ((prevState: Readonly<S>, props: Readonly<P>) => S | null), callback?: () => void): void;
  }
  
  type FC<P = {}> = FunctionComponent<P>;
  interface FunctionComponent<P = {}> {
    (props: P): ReactElement<any, any> | null;
    displayName?: string;
  }
  
  // Event Types
  interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget;
    timeStamp: number;
    type: string;
  }
  
  interface FormEvent<T = Element> extends SyntheticEvent<T, Event> {}
  interface ChangeEvent<T = Element> extends SyntheticEvent<T, Event> {
    target: T & EventTarget & { value: string; checked?: boolean };
  }
  interface MouseEvent<T = Element> extends SyntheticEvent<T, NativeMouseEvent> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget | null;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }
  
  // HTML Attributes
  interface HTMLAttributes<T> {
    className?: string;
    id?: string;
    style?: CSSProperties;
    onClick?: (event: MouseEvent<T>) => void;
    onChange?: (event: ChangeEvent<T>) => void;
    onSubmit?: (event: FormEvent<T>) => void;
    key?: Key;
    [key: string]: any;
  }
  
  interface DetailedHTMLProps<E extends HTMLAttributes<T>, T> extends E {}
  
  // Style Types
  interface CSSProperties {
    [key: string]: string | number | undefined;
  }
  
  // React Hooks
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  function useContext<T>(context: Context<T>): T;
  function useReducer<R extends Reducer<any, any>, I>(
    reducer: R,
    initialArg: I,
    init?: (arg: I) => ReducerState<R>
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  function useMemo<T>(factory: () => T, deps: ReadonlyArray<any> | undefined): T;
  function useRef<T = undefined>(initialValue: T): { current: T };
  
  // Context API
  interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  interface Provider<T> {
    (props: { value: T; children?: ReactNode }): ReactElement | null;
  }
  interface Consumer<T> {
    (props: { children: (value: T) => ReactNode }): ReactElement | null;
  }
  function createContext<T>(defaultValue: T): Context<T>;
  
  // Reducer Types
  type Reducer<S, A> = (prevState: S, action: A) => S;
  type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
  type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  type Dispatch<A> = (action: A) => void;
}

declare module 'react' {
  export = React;
}

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {}
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
    
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
