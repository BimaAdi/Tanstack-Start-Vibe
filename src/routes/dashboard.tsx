import { createFileRoute } from "@tanstack/react-router";

import { Page } from "#/client/component/routes/dashboard/Page";
import { requireSession } from "#/client/lib/require-session";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		const session = await requireSession();
		return { user: session.user };
	},
	component: Dashboard,
});

function Dashboard() {
	const { user } = Route.useRouteContext();

	return <Page user={{ name: user.name, email: user.email }} />;
}
