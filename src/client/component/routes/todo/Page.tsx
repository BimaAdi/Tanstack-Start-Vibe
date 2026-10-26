import { useRouter } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";
import type { Todo } from "#/server/schema/todo";
import {
	createTodo,
	deleteTodo,
	setTodoCompleted,
} from "#/server/serverFn/todo";
import { TodoItem } from "./TodoItem";

export function Page({ todos }: { todos: Todo[] }) {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function run(action: () => Promise<unknown>) {
		try {
			await action();
			setError(null);
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		}
	}

	async function handleAdd(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!title.trim()) {
			return;
		}
		await run(() => createTodo({ data: { title } }));
		setTitle("");
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

			{error && <p className="mt-3 text-red-600">{error}</p>}

			{todos.length === 0 ? (
				<p className="mt-6 text-gray-500">No todos yet.</p>
			) : (
				<ul className="mt-6 space-y-2">
					{todos.map((todo) => (
						<TodoItem
							key={todo.id}
							todo={todo}
							onToggle={(completed) =>
								run(() =>
									setTodoCompleted({ data: { id: todo.id, completed } }),
								)
							}
							onDelete={() => run(() => deleteTodo({ data: { id: todo.id } }))}
						/>
					))}
				</ul>
			)}
		</main>
	);
}
