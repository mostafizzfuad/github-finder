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

export const searchGitHubUsers = async (query: string) => {
	// গিটহাব সার্চ API ব্যবহার করা হচ্ছে - https://api.github.com/search/users?q=mostafizzfuad
	const res = await fetch(`https://api.github.com/search/users?q=${query}`, {
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to search users");
	}

	const data = await res.json();
	return data.items;
};
