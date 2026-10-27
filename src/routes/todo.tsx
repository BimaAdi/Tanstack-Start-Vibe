import { createFileRoute } from "@tanstack/react-router";
import { Page } from "#/client/component/routes/todo/Page.tsx";
import { getTodos } from "#/server/serverFn/todo";

export const Route = createFileRoute("/todo")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData({
			queryKey: ["todos"],
			queryFn: () => getTodos(),
		}),
	component: Page,
});
