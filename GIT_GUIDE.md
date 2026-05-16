# Stop Zipping! Use Git & GitHub for Collaboration 🚀

Zipping and sharing files manually is slow, prone to errors, and makes it impossible to see who changed what. Here is how you and your friends can work like professional developers.

## 1. What I've already done for you
I have already initialized a local Git repository in your project and made the **Initial Commit**.
- **Created `.gitignore`**: This ensures that "junk" files (like `venv`, `__pycache__`, and your `.zip` files) are not tracked.
- **Initial Commit**: All your current frontend and backend code is now "saved" in Git history.

## 2. Moving to the Cloud (GitHub)
To share this with ouyr friends, you need to host the code online.

### Step A: Create a GitHub Repo
1. Go to [github.com](https://github.com/) and log in.
2. Click **New** (or the **+** icon) to create a new repository.
3. Name it `Nutri_AI_POC`.
4. **DO NOT** check "Initialize this repository with a README" (since we already have code).
5. Click **Create repository**.

### Step B: Connect your local code to GitHub
Run these commands in your terminal (inside the `Nutri_AI_POC` folder):

```powershell
# 1. Add the remote link (Replace <YOUR_USERNAME> with your actual GitHub username)
git remote add origin https://github.com/<YOUR_USERNAME>/Nutri_AI_POC.git

# 2. Rename branch to main (standard)
git branch -M main

# 3. Push your code to GitHub
git push -u origin main
```

## 3. How your friends join
Once the code is on GitHub, your friends don't need zips anymore!

### For the first time (Cloning):
Your friend should run:
```bash
git clone https://github.com/<YOUR_USERNAME>/Nutri_AI_POC.git
```

### Every day (Getting latest changes):
Before they start working, they should run:
```bash
git pull origin main
```

### Sending their changes to you:
When they finish a feature:
```bash
git add .
git commit -m "added login feature"
git push origin main
```

## 4. Pro-Tips for your Hackathon
1. **Never commit secrets**: I've ignored `.env` files. Share your API keys/DB passwords via WhatsApp/Discord instead, or create a `.env.example` file with dummy values.
2. **Commit often**: Small commits with good messages (e.g., "fixed sidebar layout") are better than one huge commit.
3. **Conflicts**: If two people edit the same line, Git will ask you to "Resolve Conflict". Don't panic! It just asks you which version to keep.

## Current Git Status
I've already cleaned up the repository. You can check it anytime with:
`git status`
