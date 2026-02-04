import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";
import UserCard from "./UserCard";

const UserSearch = () => {
	const [username, setUsername] = useState(""); // ইনপুট ফিল্ডের জন্য
	const [submittedUsername, setSubmittedUsername] = useState(""); // সার্চ ট্রিগার করার জন্য

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
		setSubmittedUsername(username.trim()); // ইনপুট ভ্যালু দিয়ে ট্রিগার সেট করা
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

			{/* লোডিং এবং এরর স্টেট */}
			{isLoading && <p className="status">Loading...</p>}
			{error && <p className="status error">{error.message}</p>}

			{/* ডেটা দেখানো (User Card) */}
			{data && <UserCard user={data} />}
		</>
	);
};

export default UserSearch;
