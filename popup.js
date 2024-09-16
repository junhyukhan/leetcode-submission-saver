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
    } else {
      // Otherwise, allow user to enter a token
      tokenStatus.textContent = 'GitHub Token is not set.';
    }

    if (selectedRepo) {
      // If the repo is already set, disable select and button, and show selected repo
      repoSelect.disabled = true;
      saveRepoButton.disabled = true;
      repoStatus.textContent = `Selected Repository: ${selectedRepo}`;
    } else {
      // Otherwise, allow user to select a repository
      repoStatus.textContent = 'No repository selected.';
      fetchRepositories(); // Fetch repositories if repo not selected yet
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
      
    });
  });

  // Function to fetch repositories using the GitHub API
  function fetchRepositories() {
    chrome.storage.local.get('githubToken', function(items) {
      const pat = items.githubToken;
      if (!pat) {
        alert('GitHub token not set. Cannot fetch repositories.');
        return;
      }

      const url = 'https://api.github.com/user/repos';
      
      fetch(url, {
        headers: {
          'Authorization': `token ${pat}`
        }
      })
      .then(response => response.json())
      .then(repos => {
        repoSelect.innerHTML = ''; // Clear existing options
        repos.forEach(repo => {
          const option = document.createElement('option');
          option.value = repo.full_name;
          option.textContent = repo.full_name;
          repoSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Failed to fetch repositories:', error);
        repoSelect.innerHTML = '<option>Error fetching repositories</option>';
      });
    });
  }
});