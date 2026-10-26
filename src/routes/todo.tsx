import { createFileRoute } from "@tanstack/react-router";
import { Page } from "#/client/component/routes/todo/Page.tsx";
import { getTodos } from "#/server/serverFn/todo";

export const Route = createFileRoute("/todo")({
	loader: () => getTodos(),
	component: TodoRoute,
});

function TodoRoute() {
	const todos = Route.useLoaderData();
	return <Page todos={todos} />;
}
