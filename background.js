// Listen for LeetCode submissions and commits
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes('/submit/')) {
      const requestBody = details.requestBody;
      const decoder = new TextDecoder('utf-8');
      const formData = JSON.parse(decoder.decode(requestBody.raw[0].bytes));

      // Extract problem name from the URL
      const problemUrlParts = details.url.split('/');
      const problemName = problemUrlParts[problemUrlParts.length - 3];  // Third last part of the URL is the problem name

      const { lang, question_id, typed_code } = formData;
      console.log('LeetCode submission detected:', { lang, question_id, typed_code, problemName });

      // Store the submission data, including the problem name
      chrome.storage.local.set({ submissionData: { lang, question_id, typed_code, problemName } });
    }
  },
  { urls: ["*://leetcode.com/problems/*/submit/"] },
  ["requestBody"]
);
  
chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.url.includes('/submissions/detail/') && details.url.includes('/check/')) {
      console.log("🚀 ~ details:", details)
      
      fetch(details.url)
        .then(response => response.json())
        .then(data => {
          if (data.status_msg === "Accepted") {
            console.log("Submission Accepted:", data);

            // Extract the relevant information for the commit message
            const lang = data.pretty_lang || data.lang;
            const runtimePercentile = data.runtime_percentile ? data.runtime_percentile.toFixed(2) : "N/A";
            const memoryPercentile = data.memory_percentile ? data.memory_percentile.toFixed(2) : "N/A";

            // Retrieve stored submission data, including problem name
            chrome.storage.local.get(['submissionData', 'selectedRepo'], function(result) {
              if (result.submissionData && result.selectedRepo) {
                const { typed_code, question_id, lang: submissionLang, problemName } = result.submissionData;
                const repo = result.selectedRepo;

                // Get the correct file extension based on the language
                const fileExtension = getFileExtension(submissionLang);

                // Format the file name: {problem-number}-{problem-name}.{language-extension}
                const formattedProblemName = problemName.replace(/-/g, '_'); // Replace hyphens with underscores if needed
                const fileName = `${question_id}-${formattedProblemName}.${fileExtension}`;

                // Commit message with lang, runtime percentile, and memory percentile
                const commitMessage = `Solution for problem ID ${question_id} (${lang}): Runtime Percentile ${runtimePercentile}%, Memory Percentile ${memoryPercentile}%`;

                // Commit the accepted solution to the selected GitHub repository
                commitToGitHub(repo, `solutions/${fileName}`, typed_code, commitMessage);
              } else {
                console.error('No repository selected or no submission data found');
              }
            });
          }
        })
        .catch(error => console.error('Error checking submission status:', error));
    }
  },
  { urls: ["*://leetcode.com/submissions/detail/*/check/"] }
);

// Commit code to the selected GitHub repository
function commitToGitHub(repo, path, content, message) {
  chrome.storage.local.get('githubToken', function(items) {
    const githubToken = items.githubToken;

    if (!githubToken) {
      console.error('GitHub token not found. Please provide a Personal Access Token.');
      return;
    }

    const url = `https://api.github.com/repos/${repo}/contents/${path}`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        content: btoa(content),  // Base64 encode the content
        branch: 'main'
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Successfully committed to GitHub:', data);
    })
    .catch(error => console.error('Failed to commit to GitHub:', error));
  });
}

const languageExtensionMap = {
  python3: 'py',
  go: 'go',
  cpp: 'cpp',
  c: 'c',
  java: 'java'
};

function getFileExtension(lang) {
  return languageExtensionMap[lang] || 'txt'; // Default to 'txt' if the language isn't in the map
}