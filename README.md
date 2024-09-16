# LeetCode Submission Saver

**LeetCode Submission Saver** is a Chrome extension that automatically saves your successful LeetCode submissions to a GitHub repository. This extension helps you organize and track your coding progress by committing your LeetCode solutions directly to GitHub.

## Features

- Automatically captures successful LeetCode submissions.
- Allows you to select a GitHub repository to save your solutions.
- Commits your LeetCode solutions with detailed information (runtime, memory performance, etc.).
- Simple interface for adding your GitHub Personal Access Token (PAT) and selecting a repository.
- Reset functionality to easily reconfigure the extension.

## Installation

### Prerequisites

1. **Google Chrome**: Ensure you have Google Chrome installed on your machine.
2. **GitHub Account**: You need a GitHub account and a [Personal Access Token](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) (PAT) with `repo` permissions to commit code to your GitHub repositories.

### Steps

1. **Clone or download the repository** to your local machine:

   ```bash
   git clone https://github.com/your-repo/leetcode-submission-saver.git
   ```

2. **Open Chrome** and go to `chrome://extensions/`.

3. **Enable Developer Mode** (toggle on the top-right corner).

4. Click **Load unpacked** and select the folder where you cloned or downloaded the extension.

5. The extension will now appear in your Chrome extensions bar.

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

## Screenshots

![LeetCode Submission Saver Screenshot](screenshot.png)

## Contributing

If you'd like to contribute, feel free to fork the repository and submit a pull request. Bug reports and feature requests are also welcome in the issues section.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, feel free to reach out via [your-email@example.com](mailto:your-email@example.com).
