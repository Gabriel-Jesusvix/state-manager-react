import { ITodo } from '../entities/ITodo';
import { IUser } from '../entities/IUser';

import { createStore } from './createStore';

interface IGlobalStore {
  user: IUser | null;
  todos: ITodo[];
  login(): void;
  logout(): void;
  addTodo(title: string, author?: string): void;
  toggleTodoDone(todoId: number): void;
  removeTodo(todoId: number): void;
}

export const useGlobalStore = createStore<IGlobalStore>(
  (setState, getState) => ({
    user: null,
    todos: [],
    logout: () => setState({ user: null }),
    login: () =>
      setState({
        user: {
          name: 'Gabriel J',
          email: 'gabriel.developer2@gmail.com',
        },
      }),
    addTodo: (title: string) => {
      setState((prevState) => ({
        todos: prevState.todos.concat({
          id: Date.now(),
          title,
          author: getState().user?.name ?? 'Convidado',
          done: false,
        }),
      }));
    },
    toggleTodoDone: (todoId: number) => {
      setState((prevState) => ({
        todos: prevState.todos.map((todo) =>
          todo.id === todoId ? { ...todo, done: !todo.done } : todo,
        ),
      }));
    },
    removeTodo: (todoId: number) => {
      setState((prevState) => ({
        todos: prevState.todos.filter((todo) => todo.id !== todoId),
      }));
    },
  }),
);
