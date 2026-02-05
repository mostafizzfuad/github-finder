import { FaClock, FaUser } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";

type RecentSearchesProps = {
	users: string[];
	onSelect: (username: string) => void;
};

const RecentSearches = ({ users, onSelect }: RecentSearchesProps) => {
	const queryClient = useQueryClient();

	return (
		<div className="recent-searches">
			<div className="recent-header">
				<FaClock />
				<h3>Recent Searches</h3>
			</div>
			<ul>
				{users.map((user) => (
					<li key={user}>
						<button
							onClick={() => onSelect(user)}
							// প্রি-ফেচিং লজিক
							onMouseEnter={() => {
								queryClient.prefetchQuery({
									queryKey: ["users", user], // ইউনিক কি (Key)
									queryFn: () => fetchGitHubUser(user), // ডেটা ফেচিং ফাংশন
									// staleTime: 1000 * 60 * 5, // (অপশনাল) ৫ মিনিট পর্যন্ত ডেটা ফ্রেশ থাকবে
								});
							}}
						>
							<FaUser className="user-icon" />
							{user}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RecentSearches;
