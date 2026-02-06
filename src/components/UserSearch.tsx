import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce"; // ইমপোর্ট
import { fetchGitHubUser, searchGitHubUsers } from "../api/github";
import type { GitHubUser } from "../types";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearches";

const UserSearch = () => {
	const [username, setUsername] = useState(""); // ইনপুট ফিল্ডের জন্য
	const [submittedUsername, setSubmittedUsername] = useState(""); // সার্চ ট্রিগার করার জন্য

	// Debounce স্টেট (৩০০ms ডিলে)
	const [debouncedUsername] = useDebounce(username, 300);
	const [showSuggestions, setShowSuggestions] = useState(false);

	const [recentUsers, setRecentUsers] = useState<string[]>(() => {
		// ১. লোকাল স্টোরেজ থেকে ডেটা খোঁজা
		const stored = localStorage.getItem("recentUsers");
		// ২. ডেটা থাকলে পার্স করা, না থাকলে খালি অ্যারে রিটার্ন করা
		return stored ? JSON.parse(stored) : [];
	});

	// ডেটা ফেচিং লজিক
	const {
		data: userData,
		isLoading,
		error,
		refetch, // refetch ফাংশন বের করা হলো
	} = useQuery({
		// ১. কুয়েরি কি (Query Key): এটি ক্যাশিংয়ের জন্য ইউনিক আইডি হিসেবে কাজ করে
		queryKey: ["users", submittedUsername],

		// ২. কুয়েরি ফাংশন: ডেটা ফেচ করার লজিক
		queryFn: () => fetchGitHubUser(submittedUsername),

		// ৩. শর্ত (Enabled): এটি তখনই রান করবে যখন submittedUsername খালি থাকবে না
		enabled: !!submittedUsername,
		// staleTime: 1000 * 60 * 5, // (অপশনাল) ৫ মিনিট পর্যন্ত ডেটা ফ্রেশ থাকবে
	});

	// সাজেশন ফেচিং (Debounced ভ্যালু ব্যবহার করে)
	const { data: suggestions } = useQuery({
		queryKey: ["github-user-suggestions", debouncedUsername],
		queryFn: () => searchGitHubUsers(debouncedUsername),
		enabled: debouncedUsername.length > 1, // অন্তত ২ অক্ষর হলে সার্চ হবে
	});

	// সাবমিট হ্যান্ডলার
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmed = username.trim();
		if (!trimmed) return;

		setShowSuggestions(false); // সাবমিট করলে সাজেশন বন্ধ
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

	// ৩. স্টেট পরিবর্তন হলেই লোকাল স্টোরেজ আপডেট হবে
	useEffect(() => {
		localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
	}, [recentUsers]);

	return (
		<>
			{/* ফর্ম */}
			<form onSubmit={handleSubmit} className="form">
				<div className="dropdown-wrapper">
					<input
						type="text"
						value={username}
						onChange={(e) => {
							const val = e.target.value;
							setUsername(val);
							setShowSuggestions(val.trim().length > 1); // ২ অক্ষর হলে সাজেশন দেখাবে
						}}
						// বাইরে ক্লিক করলে সাজেশন বন্ধ হবে (টাইমআউট দেওয়া যাতে ক্লিক কাজ করে)
						onBlur={() =>
							setTimeout(() => setShowSuggestions(false), 200)
						}
						placeholder="Enter GitHub username"
					/>

					{/* ৫. ড্রপডাউন রেন্ডারিং */}
					{showSuggestions &&
						suggestions &&
						suggestions.length > 0 && (
							<ul className="suggestions">
								{suggestions
									.slice(0, 5)
									.map((user: GitHubUser) => (
										<li
											key={user.login} // ID এর বদলে login বা username ইউনিক হিসেবে ভালো
											onClick={() => {
												setUsername(user.login);
												setShowSuggestions(false);

												// যদি আগের ইউজারই আবার সার্চ করা হয়, তবে ফোর্স রি-ফেচ
												if (
													submittedUsername !==
													user.login
												) {
													setSubmittedUsername(
														user.login,
													);
												} else {
													refetch();
												}

												// রিসেন্ট ইউজার আপডেট
												setRecentUsers((prev) => {
													const updated = [
														user.login,
														...prev.filter(
															(u) =>
																u !==
																user.login,
														),
													];
													return updated.slice(0, 5);
												});
											}}
										>
											<img
												src={user.avatar_url}
												alt={user.login}
												className="avatar-xs"
											/>
											{user.login}
										</li>
									))}
							</ul>
						)}
				</div>
				<button type="submit">Search</button>
			</form>

			{/* লোডিং এবং এরর স্টেট */}
			{isLoading && <p className="status">Loading...</p>}
			{error && <p className="status error">{error.message}</p>}

			{/* ডেটা দেখানো (User Card) */}
			{userData && <UserCard user={userData} />}

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
		</>
	);
};

export default UserSearch;
