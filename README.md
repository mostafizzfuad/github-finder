# 🔍 GitHub Finder with TanStack Query

A powerful GitHub user search application built with **React** and **TanStack Query (React Query)**. This project demonstrates advanced server-state management, data fetching strategies, and real-time interactions using the GitHub REST API.

## 🚀 Features

Based on the implemented modules, the application includes:

- **Advanced Data Fetching:** Utilizes `useQuery` to fetch user profiles and repositories efficiently.
- **Search & Suggestions:** Real-time user search with a suggestions dropdown.
- **Recent Searches:** Saves search history to **Local Storage** and displays them for quick access.
- **Performance Optimization:** Implements **Data Prefetching** to load user data before the user even clicks, ensuring instant navigation.
- **Mutations (Follow/Unfollow):** Allows following or unfollowing users directly from the app using `useMutation` to update server state.
- **Feedback & Notifications:** Integrated **Toast Notifications** for success/error messages (e.g., "Followed successfully").
- **DevTools:** Integrated React Query DevTools for debugging and visualizing cache states.

## 🛠️ Tech Stack

- **Framework:** React.js
- **Data Fetching & State:** TanStack Query (React Query)
- **API:** GitHub REST API
- **Styling:** CSS
- **Notifications:** Sooner Toast
- **Tools:** React Query DevTools

## ⚙️ Setup & Installation

To run this project, you will need a GitHub Personal Access Token to increase API rate limits and perform actions like "Follow/Unfollow".

### Clone the Repository
```bash
git clone https://github.com/mostafizzfuad/github-finder.git
cd github-finder
npm install
```

# 👨‍💻Author
[Md. Mostafizur Rahman](https://www.linkedin.com/in/mostafizzfuad/) - Full Stack Developer
