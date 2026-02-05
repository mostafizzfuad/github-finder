import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearches";

const UserSearch = () => {
	const [username, setUsername] = useState(""); // ইনপুট ফিল্ডের জন্য
	const [submittedUsername, setSubmittedUsername] = useState(""); // সার্চ ট্রিগার করার জন্য
	const [recentUsers, setRecentUsers] = useState<string[]>([]);

	// ডেটা ফেচিং লজিক
	const { data, isLoading, error } = useQuery({
		// ১. কুয়েরি কি (Query Key): এটি ক্যাশিংয়ের জন্য ইউনিক আইডি হিসেবে কাজ করে
		queryKey: ["users", submittedUsername],

		// ২. কুয়েরি ফাংশন: ডেটা ফেচ করার লজিক
		queryFn: () => fetchGitHubUser(submittedUsername),

		// ৩. শর্ত (Enabled): এটি তখনই রান করবে যখন submittedUsername খালি থাকবে না
		enabled: !!submittedUsername,
	});

	// সাবমিট হ্যান্ডলার
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmed = username.trim();
		if (!trimmed) return;

		setSubmittedUsername(trimmed);

		// Recent Users আপডেট করা
		setRecentUsers((prev) => {
			// নতুন ইউজার শুরুতে যোগ করা এবং ডুপ্লিকেট বাদ দেওয়া
			const updated = [
				trimmed,
				...prev.filter((user) => user !== trimmed),
			];
			return updated.slice(0, 5); // সর্বোচ্চ ৫টি ইউজার রাখবে
		});
	};

	return (
		<>
			{/* ফর্ম */}
			<form onSubmit={handleSubmit} className="form">
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Enter GitHub username"
				/>
				<button type="submit">Search</button>
			</form>

			{/* রিসেন্ট সার্চেস কম্পোনেন্ট */}
			{recentUsers.length > 0 && (
				<RecentSearches
					users={recentUsers}
					onSelect={(username) => {
						setUsername(username); // ইনপুট ফিল্ড আপডেট হবে
						setSubmittedUsername(username); // সার্চ ট্রিগার হবে
					}}
				/>
			)}

			{/* লোডিং এবং এরর স্টেট */}
			{isLoading && <p className="status">Loading...</p>}
			{error && <p className="status error">{error.message}</p>}

			{/* ডেটা দেখানো (User Card) */}
			{data && <UserCard user={data} />}
		</>
	);
};

export default UserSearch;
