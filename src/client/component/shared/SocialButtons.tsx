import { GitHubMark } from "#/client/component/shared/GitHubMark";
import { GoogleMark } from "#/client/component/shared/GoogleMark";

const providers = [
	{
		id: "google",
		label: "Continue with Google",
		pendingLabel: "Connecting to Google…",
		icon: <GoogleMark />,
	},
	{
		id: "github",
		label: "Continue with GitHub",
		pendingLabel: "Connecting to GitHub…",
		icon: <GitHubMark />,
	},
] as const;

export function SocialButtons({
	pending,
	onPick,
}: {
	pending: string | null;
	onPick: (provider: "google" | "github") => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			{providers.map((provider) => (
				<button
					className="flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-[border-color] hover:border-gray-400 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-70"
					type="button"
					key={provider.id}
					onClick={() => onPick(provider.id)}
					disabled={pending !== null}
				>
					{provider.icon}
					{pending === provider.id ? provider.pendingLabel : provider.label}
				</button>
			))}
		</div>
	);
}
