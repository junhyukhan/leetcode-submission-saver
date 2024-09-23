# LeetCode Submission Saver

**LeetCode Submission Saver** is a Chrome extension that automatically saves your successful LeetCode submissions to a GitHub repository. This extension helps you organize and track your coding progress by committing your LeetCode solutions directly to GitHub.

<div align="center">
   <img src="https://github.com/user-attachments/assets/ebb6e878-1ee5-4594-9b10-f674c040b957" alt="Alt text" width="600" />
</div>


<div align="center">
   <img src="https://github.com/user-attachments/assets/678170e5-0480-4bb9-91f1-8c873000c339" alt="Alt text" width="300" />  
</div>

## Features

- Automatically captures successful LeetCode submissions.
- Allows you to select a GitHub repository to save your solutions.
- Commits your LeetCode solutions with detailed information (runtime, memory performance, etc.).
- Simple interface for adding your GitHub Personal Access Token (PAT) and selecting a repository.
- Reset functionality to easily reconfigure the extension.

## Todo
- [ ] Add a way to add some notes related to the solution
  - leetcode already has a section that allows the user to write some notes, so perhaps this could be used
  - perhaps a logic to capture the content section, or a listener of the call since the text will be in the request body
- [ ] make the hanling of github PATs more secure
  - encrypt the PAT and let the user enter a pin to access the PAT
  - instead of saving the PAT, just request the token when a commit is made (like an alert)

## Installation

### Prerequisites

1. **Google Chrome**: Ensure you have Google Chrome installed on your machine.
2. **GitHub Account**: You need a GitHub account and a [Personal Access Token](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) (PAT) with `repo` permissions to commit code to your GitHub repositories.
3. **Node.js & npm**: You need Node.js and npm installed to build Tailwind CSS.

### Steps

1. **Clone or download the repository** to your local machine:

   ```bash
   git clone https://github.com/your-repo/leetcode-submission-saver.git
   ```

2. **Install dependencies**:

   Navigate to the project directory and install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Build Tailwind CSS**:

   Run the following command to build Tailwind CSS locally:

   ```bash
   npx tailwindcss -i ./input.css -o ./output.css --watch
   ```

   This command will compile the `input.css` file into `output.css` using Tailwind CSS, and it will watch for any changes so the styles are updated as you modify the CSS.

4. **Open Chrome** and go to `chrome://extensions/`.

5. **Enable Developer Mode** (toggle on the top-right corner).

6. Click **Load unpacked** and select the folder where you cloned or downloaded the extension.

7. The extension will now appear in your Chrome extensions bar.

## Usage

1. **GitHub Personal Access Token (PAT)**: 
   - Open the extension by clicking on the LeetCode Submission Saver icon in the Chrome toolbar.
   - Enter your GitHub Personal Access Token (PAT) in the provided input field.
   - Click the **Save** button to store the token securely.

2. **Select Repository**:
   - Once your PAT is saved, you can choose the repository where your LeetCode submissions will be committed.
   - Use the dropdown menu to select one of your GitHub repositories, then click **Save**.

3. **Commit Submissions**:
   - After completing a successful submission on LeetCode, the extension will capture the solution and automatically commit it to your selected GitHub repository.

4. **Reset**:
   - You can reset the configuration at any time by clicking the **Reset All** button in the extension popup.

## Security

### Storing Your GitHub PAT

- **Local Storage**: The GitHub Personal Access Token (PAT) is stored securely using Chrome's `chrome.storage.local` API. This storage is local to your device and cannot be accessed by external websites or scripts.
- **No External Server**: The extension does not use any external servers to store or process your PAT. All data remains local to your browser and machine.
- **No Hardcoding**: The PAT is not hardcoded into the extension, and you are required to input your own token when configuring the extension.
- **Token Scope**: Ensure that your PAT has the minimum required permissions (typically `repo` scope) to commit to your repositories.
- **Encryption**: At this stage, the PAT is not encrypted when stored, which is a known limitation. We recommend revoking the token if you ever uninstall or stop using the extension.

### Recommendations

- **Use Short-Lived PATs**: For enhanced security, consider using short-lived tokens if GitHub enables this functionality.
- **Limit PAT Permissions**: Only grant the `repo` scope and avoid granting excessive permissions when generating your PAT.
- **Revocation**: If the PAT is ever compromised or you no longer need the extension, revoke it immediately via your GitHub account's token management settings.
