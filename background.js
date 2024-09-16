// Store information from the submit request
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes('/submit/')) {
      const requestBody = details.requestBody;
      const decoder = new TextDecoder('utf-8');
      const formData = JSON.parse(decoder.decode(requestBody.raw[0].bytes));

      // Extract information
      const { lang, question_id, typed_code } = formData;

      // Extract problem name from the URL
      const problemUrlParts = details.url.split('/');
      const problemName = problemUrlParts[problemUrlParts.length - 3];  // Third last part of the URL is the problem name

      // Log the captured data for debugging
      console.log('LeetCode submission detected:', { lang, question_id, typed_code, problemName });

      // Store the submission data in chrome storage
      chrome.storage.local.set({ submissionData: { lang, question_id, typed_code, problemName } });

      // Set a 5-second delay before making the check API request
      setTimeout(() => {
        console.log("🚀 ~ setTimeout ~ fetchCheckApiOnce called, question_id:", question_id)
        chrome.storage.local.get(['submissionId'], function(result) {
          fetchCheckApiOnce(result.submissionId);  // Call the function to fetch the check API
        });
      }, 10000);  // 5-second delay
    }
  },
  { urls: ["*://leetcode.com/problems/*/submit/"] },
  ["requestBody"]
);

chrome.webRequest.onCompleted.addListener(
  function(details) {
    const problemUrlParts = details.url.split('/');
    const submissionId = problemUrlParts[problemUrlParts.length - 3];  // Third last part of the URL is the problem name
    chrome.storage.local.set({ submissionId });

  },
  { urls: ["*://leetcode.com/submissions/detail/*/check/"] }
);

// Function to fetch the check API once
function fetchCheckApiOnce(questionId) {
  // Construct the check API URL using the question ID
  const checkUrl = `https://leetcode.com/submissions/detail/${questionId}/check/`;

  // Fetch the check API once to get the status
  fetch(checkUrl)
    .then(response => response.json())
    .then(data => {
      // Check if the submission is accepted
      if (data.status_msg === "Accepted") {
        console.log("Submission Accepted:", data);

        // Extract necessary info from the check response
        const lang = data.pretty_lang || data.lang;
        const runtimePercentile = data.runtime_percentile ? data.runtime_percentile.toFixed(2) : "N/A";
        const memoryPercentile = data.memory_percentile ? data.memory_percentile.toFixed(2) : "N/A";

        // Retrieve stored submission data
        chrome.storage.local.get(['submissionData', 'selectedRepo'], function(result) {
          if (result.submissionData && result.selectedRepo) {
            const { typed_code, question_id, lang: submissionLang, problemName } = result.submissionData;
            const repo = result.selectedRepo;

            // Get the correct file extension based on the language
            const fileExtension = getFileExtension(submissionLang);

            // Format the file name: {problem-number}-{problem-name}.{language-extension}
            const formattedProblemName = problemName.replace(/-/g, '_'); // Replace hyphens with underscores
            const fileName = `${question_id}-${formattedProblemName}.${fileExtension}`;

            // Commit message with lang, runtime percentile, and memory percentile
            const commitMessage = `[Leetcode Submission Saver] Problem ID ${question_id} (${lang}): Runtime Percentile ${runtimePercentile}%, Memory Percentile ${memoryPercentile}%`;

            // Commit the accepted solution to the selected GitHub repository
            commitToGitHub(repo, `solutions/${fileName}`, typed_code, commitMessage);
          } else {
            console.error('No repository selected or no submission data found');
          }
        });
      } else {
        console.log("Submission not accepted or still processing:", data.status_msg);
      }
    })
    .catch(error => console.error('Error fetching check API:', error));
}

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