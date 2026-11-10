import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "#/client/lib/auth-client";

export function SignOutButton() {
	const navigate = useNavigate();
	const [signingOut, setSigningOut] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function signOut() {
		setSigningOut(true);
		setError(null);
		try {
			const result = await authClient.signOut();
			if (result.error) {
				setError(
					result.error.message ?? "We couldn't sign you out. Please try again.",
				);
				return;
			}
			await navigate({ to: "/login" });
		} catch {
			setError("We couldn't sign you out. Please try again.");
		} finally {
			setSigningOut(false);
		}
	}

	return (
		<div className="flex flex-col items-end gap-1">
			<button
				className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-wait disabled:opacity-70"
				type="button"
				onClick={signOut}
				disabled={signingOut}
			>
				{signingOut ? "Signing out…" : "Log out"}
			</button>
			{error ? (
				<p className="m-0 text-xs text-red-600" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}
