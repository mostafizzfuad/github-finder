export const fetchGitHubUser = async (username: string) => {
	const res = await fetch(`https://api.github.com/users/${username}`, {
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
		},
	});

	if (!res.ok) {
		throw new Error("User not found");
	}

	return res.json();
};
