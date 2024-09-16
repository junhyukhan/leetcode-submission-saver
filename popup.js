document.addEventListener('DOMContentLoaded', function() {
  const patInput = document.getElementById('github-pat');
  const savePatButton = document.getElementById('save-pat');
  const tokenStatus = document.getElementById('token-status');
  
  const repoSelect = document.getElementById('repo-select');
  const saveRepoButton = document.getElementById('save-repo');
  const repoStatus = document.getElementById('repo-status');
  
  const resetButton = document.getElementById('reset-btn');

  // Check if the GitHub PAT and selected repo are already set
  chrome.storage.local.get(['githubToken', 'selectedRepo'], function(items) {
    const githubToken = items.githubToken;
    const selectedRepo = items.selectedRepo;

    if (githubToken) {
      // If the GitHub token is already set, disable input and button, and show partial token
      patInput.disabled = true;
      savePatButton.disabled = true;
      tokenStatus.textContent = `GitHub Token is already set (****${githubToken.slice(-4)})`;

      // Fetch repositories since the PAT is already set
      fetchRepositories(githubToken);
    } else {
      tokenStatus.textContent = 'GitHub Token is not set.';
    }

    if (selectedRepo) {
      // If the repo is already set, disable select and button, and show selected repo
      repoSelect.disabled = true;
      saveRepoButton.disabled = true;
      repoStatus.textContent = `Selected Repository: ${selectedRepo}`;
    } else {
      // Allow the user to select a repository
      repoStatus.textContent = 'No repository selected.';
    }
  });
  
  // Event listener to save the GitHub PAT
  savePatButton.addEventListener('click', function() {
    const pat = patInput.value;

    if (pat) {
      // Store the GitHub PAT in chrome storage
      chrome.storage.local.set({ githubToken: pat }, function() {
        alert('GitHub Personal Access Token saved successfully!');
        patInput.disabled = true;
        savePatButton.disabled = true;
        tokenStatus.textContent = `GitHub Token is already set (****${pat.slice(-4)})`;

        // Fetch repositories immediately after saving the PAT
        fetchRepositories(pat);
      });
    } else {
      alert('Please enter a valid GitHub PAT.');
    }
  });

  // Event listener to save the selected repository
  saveRepoButton.addEventListener('click', function() {
    const selectedRepo = repoSelect.value;

    if (selectedRepo) {
      // Store the selected repository in chrome storage
      chrome.storage.local.set({ selectedRepo }, function() {
        alert(`Repository "${selectedRepo}" saved successfully!`);
        repoSelect.disabled = true;
        saveRepoButton.disabled = true;
        repoStatus.textContent = `Selected Repository: ${selectedRepo}`;
      });
    } else {
      alert('Please select a repository.');
    }
  });

  // Reset button functionality: Clear storage and reset the UI
  resetButton.addEventListener('click', function() {
    // Clear all values from chrome.storage.local
    chrome.storage.local.clear(function() {
      alert('All settings have been reset!');

      // Reset the UI for GitHub token
      patInput.value = '';
      patInput.disabled = false;
      savePatButton.disabled = false;
      tokenStatus.textContent = 'GitHub Token is not set.';

      // Reset the UI for repository selection
      repoSelect.disabled = false;
      saveRepoButton.disabled = false;
      repoStatus.textContent = 'No repository selected.';
      
      // Clear repository options
      repoSelect.innerHTML = '<option value="">Loading repositories...</option>';
    });
  });

  // Function to fetch repositories using the GitHub API
  function fetchRepositories(pat) {
    const url = 'https://api.github.com/user/repos';

    fetch(url, {
      headers: {
        'Authorization': `token ${pat}`
      }
    })
    .then(response => response.json())
    .then(repos => {
      repoSelect.innerHTML = ''; // Clear existing options

      // Populate the dropdown with repositories
      if (repos.length > 0) {
        repos.forEach(repo => {
          const option = document.createElement('option');
          option.value = repo.full_name;
          option.textContent = repo.full_name;
          repoSelect.appendChild(option);
        });
      } else {
        repoSelect.innerHTML = '<option value="">No repositories found</option>';
      }
    })
    .catch(error => {
      console.error('Failed to fetch repositories:', error);
      repoSelect.innerHTML = '<option value="">Error fetching repositories</option>';
    });
  }
});