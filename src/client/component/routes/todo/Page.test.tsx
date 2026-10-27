// @vitest-environment jsdom
import { useRouter } from "@tanstack/react-router";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Todo } from "#/server/schema/todo";
import {
	createTodo,
	deleteTodo,
	setTodoCompleted,
} from "#/server/serverFn/todo";
import { Page } from "./Page";

vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@tanstack/react-router")>();
	return {
		...actual,
		useRouter: vi.fn(),
	};
});

vi.mock("#/server/serverFn/todo", () => ({
	createTodo: vi.fn(),
	deleteTodo: vi.fn(),
	setTodoCompleted: vi.fn(),
}));

const todos: Todo[] = [
	{
		id: 1,
		title: "Write tests",
		completed: false,
		createdAt: new Date("2026-01-01T00:00:00Z"),
	},
	{
		id: 2,
		title: "Ship feature",
		completed: true,
		createdAt: null,
	},
];

describe("Page", () => {
	const invalidate = vi.fn(async () => {});

	beforeEach(() => {
		vi.mocked(useRouter).mockReturnValue({
			invalidate,
		} as unknown as ReturnType<typeof useRouter>);
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("renders the heading and empty state", () => {
		render(<Page todos={[]} />);

		expect(screen.getByRole("heading", { name: "Todo List" })).toBeTruthy();
		expect(screen.getByText("No todos yet.")).toBeTruthy();
	});

	it("renders the provided todos", () => {
		render(<Page todos={todos} />);

		expect(screen.getByText("Write tests")).toBeTruthy();
		expect(screen.getByText("Ship feature")).toBeTruthy();
		expect(screen.queryByText("No todos yet.")).toBeNull();
	});

	it("creates a todo and clears the input", async () => {
		const created: Todo = {
			id: 3,
			title: "New todo",
			completed: false,
			createdAt: null,
		};
		vi.mocked(createTodo).mockResolvedValue(created);

		render(<Page todos={[]} />);

		const input = screen.getByPlaceholderText("What needs to be done?");
		fireEvent.change(input, { target: { value: "New todo" } });
		fireEvent.click(screen.getByRole("button", { name: "Add" }));

		await waitFor(() =>
			expect(createTodo).toHaveBeenCalledWith({
				data: { title: "New todo" },
			}),
		);
		await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(1));
		expect((input as HTMLInputElement).value).toBe("");
	});

	it("does not create a todo with a blank title", async () => {
		render(<Page todos={[]} />);

		const input = screen.getByPlaceholderText("What needs to be done?");
		fireEvent.change(input, { target: { value: "   " } });
		fireEvent.click(screen.getByRole("button", { name: "Add" }));

		await waitFor(() => expect(createTodo).not.toHaveBeenCalled());
		expect(invalidate).not.toHaveBeenCalled();
	});

	it("toggles a todo and invalidates the router", async () => {
		vi.mocked(setTodoCompleted).mockResolvedValue(undefined);

		render(<Page todos={todos} />);

		fireEvent.click(screen.getAllByRole("checkbox")[0]);

		await waitFor(() =>
			expect(setTodoCompleted).toHaveBeenCalledWith({
				data: { id: 1, completed: true },
			}),
		);
		await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(1));
	});

	it("deletes a todo and invalidates the router", async () => {
		vi.mocked(deleteTodo).mockResolvedValue(undefined);

		render(<Page todos={todos} />);

		fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

		await waitFor(() =>
			expect(deleteTodo).toHaveBeenCalledWith({ data: { id: 1 } }),
		);
		await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(1));
	});

	it("shows the error message when an action fails", async () => {
		vi.mocked(deleteTodo).mockRejectedValue(new Error("Failed to delete"));

		render(<Page todos={todos} />);

		fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

		expect(await screen.findByText("Failed to delete")).toBeTruthy();
		expect(invalidate).not.toHaveBeenCalled();
	});

	it("shows a fallback message for non-Error failures", async () => {
		vi.mocked(deleteTodo).mockRejectedValue("nope");

		render(<Page todos={todos} />);

		fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

		expect(await screen.findByText("Something went wrong")).toBeTruthy();
		expect(invalidate).not.toHaveBeenCalled();
	});
});
