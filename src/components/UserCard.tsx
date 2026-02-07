import { useQuery, useMutation } from "@tanstack/react-query";
import { FaGithub, FaUserPlus, FaUserMinus } from "react-icons/fa";
import type { GitHubUser } from "../types";
import {
	followGitHubUser,
	checkIfFollowingUser,
} from "../api/github";

const UserCard = ({ user }: { user: GitHubUser }) => {
	// ফলো স্ট্যাটাস চেক করা
	const { data: isFollowing, refetch } = useQuery({
		queryKey: ["follow-status", user.login],
		queryFn: () => checkIfFollowingUser(user.login),
		enabled: !!user.login, // ইউজার লগইন থাকলে এই কোয়েরি চালাবে
	});

	// Mutation to follow user
	const followMutation = useMutation({
		mutationFn: () => followGitHubUser(user.login),
		onSuccess: () => {
			// সফল হলে আমরা UI আপডেট করার জন্য refetch কল করব
			console.log(`You have followed ${user.login}`);
			refetch();
		},
		onError: (err: any) => {
			alert(err.message); // আপাতত alert ব্যবহার করছি
		},
	});

	const handleFollow = () => {
		if (isFollowing) {
			// আনফলো লজিক আমরা পরে লিখব
			console.log("Unfollowing logic coming soon...");
		} else {
			// ফলো করা না থাকলে ফলো মিউটেশন কল হবে
			followMutation.mutate();
		}
	};

	return (
		<div className="user-card">
			<img src={user.avatar_url} alt={user.name} className="avatar" />
			<h2>{user.name || user.login}</h2>
			<p className="bio">{user.bio}</p>

			<div className="user-card-buttons">
				{/* ফলো/আনফলো বাটন */}
				<button
					className={`follow-btn ${isFollowing ? "following" : ""}`}
					onClick={handleFollow} // ক্লিক হ্যান্ডলার
					disabled={followMutation.isPending} // রিকোয়েস্ট চলাকালীন বাটন ডিজেবল থাকবে
				>
					{isFollowing ? (
						<>
							<FaUserMinus className="follow-icon" />
							Following
						</>
					) : (
						<>
							<FaUserPlus className="follow-icon" />
							Follow User
						</>
					)}
				</button>

				<a
					href={user.html_url}
					target="_blank"
					rel="noopener noreferrer"
					className="profile-btn"
				>
					<FaGithub />
					View GitHub Profile
				</a>
			</div>
		</div>
	);
};

export default UserCard;
