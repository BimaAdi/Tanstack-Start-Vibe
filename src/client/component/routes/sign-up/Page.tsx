import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SocialButtons } from "#/client/component/shared/SocialButtons";
import { authClient } from "#/client/lib/auth-client";

export function Page() {
	const navigate = useNavigate();
	const [pending, setPending] = useState(false);
	const [socialPending, setSocialPending] = useState<
		"google" | "github" | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
	});

	async function signInWithSocial(provider: "google" | "github") {
		setSocialPending(provider);
		setError(null);

		try {
			const result = await authClient.signIn.social({
				provider,
				callbackURL: "/dashboard",
			});
			if (result.error) {
				setError(
					result.error.message ??
						`${provider === "google" ? "Google" : "GitHub"} sign-in is unavailable. Please try again.`,
				);
			}
		} catch {
			setError(
				`${provider === "google" ? "Google" : "GitHub"} sign-in is unavailable. Please try again.`,
			);
		} finally {
			setSocialPending(null);
		}
	}

	async function submit(event: React.FormEvent) {
		event.preventDefault();
		setPending(true);
		setError(null);

		try {
			const result = await authClient.signUp.email({
				email: form.email,
				password: form.password,
				name: form.name,
				callbackURL: "/dashboard",
			});
			if (result.error) {
				setError(
					result.error.message ??
						"We couldn't create your account. Check your details and try again.",
				);
				return;
			}

			await navigate({ to: "/dashboard" });
		} catch {
			setError(
				"We couldn't create your account. Check your details and try again.",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<main className="grid min-h-screen place-items-center p-6">
			<div className="w-full max-w-[380px]">
				<h1 className="mt-0 mb-1 text-3xl font-bold">Create your account</h1>
				<p className="mt-0 mb-6 text-sm text-gray-600">
					Sign up with email and a password to continue.
				</p>

				<SocialButtons pending={socialPending} onPick={signInWithSocial} />

				<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
					<span className="h-px bg-gray-200" />
					<p className="m-0 text-xs text-gray-500">or sign up with email</p>
					<span className="h-px bg-gray-200" />
				</div>

				<form onSubmit={submit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium" htmlFor="name">
							Name
						</label>
						<input
							className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
							autoComplete="name"
							id="name"
							name="name"
							type="text"
							placeholder="Your name"
							value={form.name}
							onChange={(event) =>
								setForm({ ...form, name: event.target.value })
							}
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium" htmlFor="email">
							Email address
						</label>
						<input
							className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
							autoComplete="email"
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							value={form.email}
							onChange={(event) =>
								setForm({ ...form, email: event.target.value })
							}
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium" htmlFor="password">
							Password
						</label>
						<input
							className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
							autoComplete="new-password"
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							minLength={8}
							value={form.password}
							onChange={(event) =>
								setForm({ ...form, password: event.target.value })
							}
							required
						/>
					</div>

					{error ? (
						<p className="m-0 text-sm text-red-600" role="alert">
							{error}
						</p>
					) : null}

					<button
						className="h-10 cursor-pointer rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
						type="submit"
						disabled={pending || socialPending !== null}
					>
						{pending ? "Creating account…" : "Sign up"}
					</button>
				</form>

				<p className="mt-6 mb-0 text-center text-sm text-gray-600">
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-medium text-blue-600 underline hover:text-blue-700"
					>
						Log in
					</Link>
				</p>
			</div>
		</main>
	);
}
