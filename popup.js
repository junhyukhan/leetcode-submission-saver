// Event listener to save the GitHub PAT
document.getElementById('save-pat').addEventListener('click', function() {
    const pat = document.getElementById('github-pat').value;
  
    if (pat) {
      // Store the GitHub PAT in chrome storage
      chrome.storage.local.set({ githubToken: pat }, function() {
        alert('GitHub Personal Access Token saved successfully!');
        fetchRepositories(pat); // Fetch repositories after saving the PAT
      });
    } else {
      alert('Please enter a valid GitHub PAT.');
    }
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
      const repoSelect = document.getElementById('repo-select');
      repoSelect.innerHTML = ''; // Clear the existing options
  
      if (repos.length === 0) {
        repoSelect.innerHTML = '<option>No repositories found</option>';
        return;
      }
  
      // Populate the dropdown with repository options
      repos.forEach(repo => {
        const option = document.createElement('option');
        option.value = repo.full_name;
        option.textContent = repo.full_name;
        repoSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Failed to fetch repositories:', error);
      document.getElementById('repo-select').innerHTML = '<option>Error fetching repositories</option>';
    });
  }
  
  // Event listener to save the selected repository
  document.getElementById('save-repo').addEventListener('click', function() {
    const selectedRepo = document.getElementById('repo-select').value;
  
    if (selectedRepo) {
      // Store the selected repository in chrome storage
      chrome.storage.local.set({ selectedRepo }, function() {
        alert(`Repository "${selectedRepo}" saved successfully!`);
      });
    } else {
      alert('Please select a repository.');
    }
  });