import type { GitHubUser } from "../types";

type Props = {
	suggestions: GitHubUser[];
	show: boolean;
	onSelect: (username: string) => void;
};

const SuggestionDropdown = ({ suggestions, show, onSelect }: Props) => {
	// যদি শো ফলস হয় বা কোনো সাজেশন না থাকে, কিছুই রেন্ডার হবে না
	if (!show || !suggestions || suggestions.length === 0) return null;

	return (
		<ul className="suggestions">
			{suggestions.slice(0, 5).map((user: GitHubUser) => (
				<li
					key={user.login} // ID এর বদলে login বা username ইউনিক হিসেবে ভালো
					onClick={() => {
						onSelect(user.login);
						// setUsername(user.login);
						// setShowSuggestions(false);

						// // যদি আগের ইউজারই আবার সার্চ করা হয়, তবে ফোর্স রি-ফেচ
						// if (submittedUsername !== user.login) {
						// 	setSubmittedUsername(user.login);
						// } else {
						// 	refetch();
						// }

						// // রিসেন্ট ইউজার আপডেট
						// setRecentUsers((prev) => {
						// 	const updated = [
						// 		user.login,
						// 		...prev.filter((u) => u !== user.login),
						// 	];
						// 	return updated.slice(0, 5);
						// });
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
	);
};

export default SuggestionDropdown;
