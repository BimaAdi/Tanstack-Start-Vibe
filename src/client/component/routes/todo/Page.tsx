import { useMutation, useQuery } from "@tanstack/react-query";
import { type SubmitEvent, useState } from "react";
import type { Todo } from "#/server/schema/todo";
import {
	createTodo,
	deleteTodo,
	getTodos,
	setTodoCompleted,
} from "#/server/serverFn/todo";
import { TodoItem } from "./TodoItem";

const todosQueryKey = ["todos"] as const;

function errorMessage(error: unknown) {
	return error instanceof Error ? error.message : "Something went wrong";
}

export function Page({ initialTodos }: { initialTodos: Todo[] }) {
	const { data: todos = [], refetch } = useQuery({
		queryKey: todosQueryKey,
		queryFn: () => getTodos(),
		initialData: initialTodos,
	});
	const [title, setTitle] = useState("");

	const create = useMutation({
		mutationFn: (newTitle: string) => createTodo({ data: { title: newTitle } }),
		onSuccess: () => {
			refetch();
		},
	});

	const setCompleted = useMutation({
		mutationFn: (variables: { id: number; completed: boolean }) =>
			setTodoCompleted({ data: variables }),
		onSuccess: () => {
			refetch();
		},
	});

	const remove = useMutation({
		mutationFn: (id: number) => deleteTodo({ data: { id } }),
		onSuccess: () => {
			refetch();
		},
	});

	const error = create.error ?? setCompleted.error ?? remove.error;

	function resetErrors() {
		create.reset();
		setCompleted.reset();
		remove.reset();
	}

	function handleAdd(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		const newTitle = title.trim();
		if (!newTitle) {
			return;
		}
		resetErrors();
		create.mutate(newTitle, {
			onSuccess: () => setTitle(""),
		});
	}

	return (
		<main className="mx-auto mt-10 max-w-xl p-6">
			<h1 className="text-3xl font-bold">Todo List</h1>

			<form onSubmit={handleAdd} className="mt-6 flex gap-2">
				<input
					type="text"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="What needs to be done?"
					maxLength={200}
					className="flex-1 rounded border border-gray-300 px-3 py-2"
				/>
				<button
					type="submit"
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					Add
				</button>
			</form>

			{error && <p className="mt-3 text-red-600">{errorMessage(error)}</p>}

			{todos.length === 0 ? (
				<p className="mt-6 text-gray-500">No todos yet.</p>
			) : (
				<ul className="mt-6 space-y-2">
					{todos.map((todo) => (
						<TodoItem
							key={todo.id}
							todo={todo}
							onToggle={(completed) => {
								resetErrors();
								setCompleted.mutate({ id: todo.id, completed });
							}}
							onDelete={() => {
								resetErrors();
								remove.mutate(todo.id);
							}}
						/>
					))}
				</ul>
			)}
		</main>
	);
}
