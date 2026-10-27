import { createFileRoute } from "@tanstack/react-router";
import { Page } from "#/client/component/routes/counter/Page.tsx";
import { getCounter } from "#/server/serverFn/counter";

export const Route = createFileRoute("/counter")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData({
			queryKey: ["counter"],
			queryFn: () => getCounter(),
		}),
	component: Page,
});
