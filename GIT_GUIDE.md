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

## 4. Professional Collaboration Roadmap 🛣️

Now that you've resolved the initial conflicts, here is the sustainable way to work with your friend.

### A. The "Golden Rule": Always Pull First
Before you write a single line of code, make sure you have your friend's latest work.
```bash
git pull origin main
```

### B. Use Feature Branches (Avoid "Master" for coding)
Instead of everyone coding on `master`, create a branch for each new feature. This prevents conflicts!

1. **Create a branch**: `git checkout -b feature/login-ui`
2. **Work and Commit**: `git add .`, `git commit -m "Added login screen"`
3. **Push the branch**: `git push origin feature/login-ui`

### C. The Pull Request (PR) 🔄
Once you push a branch, go to GitHub. You will see a button: **"Compare & pull request"**.
1. Click it.
2. Ask your friend to review your code.
3. Once approved, click **"Merge pull request"**.
4. Your changes are now safely in `main`!

### D. Summary of Daily Commands
| Goal | Command |
| :--- | :--- |
| Start the day | `git pull origin main` |
| Start a new feature | `git checkout -b feature/NAME` |
| Save progress | `git add .` then `git commit -m "msg"` |
| Share with friend | `git push origin feature/NAME` |
| Switch back to main | `git checkout main` |

## 5. What if you get a conflict? 💥
If Git says "Conflict", don't panic!
1. Open the file in VS Code.
2. You will see markers like `<<<<<<< HEAD` and `>>>>>>> branch-name`.
3. Choose which code to keep (or keep both).
4. Save the file, run `git add .`, and `git commit`.

## 6. How to ensure everything is working fine? ✅
1. **Backend**: Run `python manage.py runserver`. If it starts without errors, your models and settings are good.
2. **Migrations**: If you change `models.py`, run:
   - `python manage.py makemigrations`
   - `python manage.py migrate`
3. **Frontend**: Run `npm run dev` in the `myfrontend` folder.

---
**Current Repo Status**:
I have fixed the `max_digits` typo, missing imports, and database migration errors. Your `master` branch is now healthy!

**Next Step**:
Run `git push origin master` to share these fixes with your friend.
