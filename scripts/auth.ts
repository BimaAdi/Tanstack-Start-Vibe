import { cac } from "cac";
import { config } from "dotenv";

import { type CreateUserOptions, createUser } from "./create-user.ts";

config({ path: [".env.local", ".env"] });

const cli = cac("auth");
let action: Promise<void> | undefined;

cli
	.command("create-user", "Create an email sign-in user")
	.option("--email <email>", "Email address for the new user")
	.option("--name <name>", "Name for the new user")
	.option("--password <password>", "Password (prompted for when omitted)")
	.example(
		'pnpm auth:create-user -- --email "user@example.com" --name "User Name"',
	)
	.action((options: CreateUserOptions) => {
		action = createUser(options);
	});

cli.help();

cli.addEventListener("command:*", (event) => {
	const command = (event as CustomEvent<string>).detail;
	console.error(`Unknown auth command: ${command}`);
	process.exitCode = 1;
});

const argv = process.argv.slice();
if (argv[3] === "--") {
	argv.splice(3, 1);
}
const args = argv.slice(2);
cli.parse(argv);

if (args.length === 0) {
	cli.outputHelp();
} else if (action) {
	await action;
}
