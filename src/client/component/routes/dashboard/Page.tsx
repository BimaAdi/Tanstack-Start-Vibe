import { SignOutButton } from "#/client/component/shared/SignOutButton";

interface PageProps {
	user: {
		name: string;
		email: string;
	};
}

export function Page({ user }: PageProps) {
	return (
		<main className="min-h-screen px-[clamp(24px,6vw,84px)] py-[30px]">
			<nav className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 border-b border-gray-200 pb-5">
				<a
					className="inline-flex w-fit items-center gap-[11px] text-xl font-bold tracking-[-0.04em] text-gray-900 no-underline"
					href="/"
					aria-label="Vibe home"
				>
					<span
						className="grid size-8 place-items-center rounded-[10px] bg-blue-600 text-base font-extrabold text-white"
						aria-hidden="true"
					>
						V
					</span>
					<span>Vibe</span>
				</a>
				<SignOutButton />
			</nav>
			<section className="mx-auto mt-16 max-w-[1120px]">
				<h1 className="mt-0 mb-2 text-3xl font-bold">Welcome, {user.name}.</h1>
				<p className="mt-0 mb-0 text-sm text-gray-600">
					Signed in as {user.email}
				</p>
			</section>
		</main>
	);
}
