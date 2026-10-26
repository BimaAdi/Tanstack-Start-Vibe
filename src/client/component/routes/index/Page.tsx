import { Link } from "@tanstack/react-router";

export function Page() {
	return (
		<main className="mx-auto mt-10 max-w-xl p-6">
			<h1 className="text-3xl font-bold">Vibe</h1>
			<p className="mt-2 text-gray-600">
				A small Todo app built with TanStack Start.
			</p>
			<Link
				to="/todo"
				className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			>
				Go to Todo List
			</Link>
		</main>
	);
}
