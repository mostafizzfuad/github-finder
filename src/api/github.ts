export const fetchGitHubUser = async (username: string) => {
	const res = await fetch(`https://api.github.com/users/${username}`, {
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
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
			Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to search users");
	}

	const data = await res.json();
	return data.items;
};

// Check if following a user on github
export const checkIfFollowingUser = async (username: string) => {
	const res = await fetch(
		`${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
		{
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
				Accept: "application/vnd.github+json",
			},
		},
	);

	// 204 মানে Success (No Content), অর্থাৎ আমরা ফলো করছি
	if (res.status === 204) {
		return true;
	}
	// 404 মানে Not Found, অর্থাৎ আমরা ফলো করছি না
	else if (res.status === 404) {
		return false;
	} else {
		const errorData = await res.json().catch(() => null);
		throw new Error(errorData?.message || "Failed to check follow status");
	}
};

// Follow user on Github
export const followGitHubUser = async (username: string) => {
	const res = await fetch(
		`${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
		{
			method: "PUT", // ফলো করার জন্য PUT মেথড ব্যবহার হয়
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
				"Content-Type": "application/json",
				Accept: "application/vnd.github+json",
			},
		},
	);

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || "Failed to follow user");
	}

	return true;
};

// Unfollow user on Github
export const unfollowGitHubUser = async (username: string) => {
	const res = await fetch(
		`${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
		{
			method: "DELETE", // আনফলো করার জন্য DELETE মেথড
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
				Accept: "application/vnd.github+json",
			},
		},
	);

	if (!res.ok) {
		const errorData = await res.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to unfollow user");
	}

	return true;
};
