// Define the API URL
const apiUrl = 'https://exec.sherbet.com/affiliates/dgenbros/wagers?startDate=2024-09-01';

// Authentication token
const authToken = '3ba4f227b1e9de1fef23a7d2825d6270';

async function fetchAndDisplayLeaderboard() {
    try {
        // Fetch the data from the API with authentication headers
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Log the full response object to inspect status and headers
        console.log('Full response:', response);

        if (!response.ok) {
            // Log the status and statusText for more details about the error
            console.error(`Error: Status ${response.status}, ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('API Response:', data); // Log the entire API response for debugging

        // Validate data structure
        if (!data.results || !Array.isArray(data.results)) {
            console.error('Invalid data structure:', data);
            throw new Error('Invalid data structure: "results" is undefined or not an array');
        }

        if (data.results.length > 0) {
            const firstItem = data.results[0];
            if (typeof firstItem.name === 'undefined' || typeof firstItem.wagerTotal === 'undefined') {
                console.error('Unexpected item structure:', firstItem);
                throw new Error('Unexpected item structure in "results" array');
            }
        }

        // Extract the necessary fields
        const users = data.results.map(user => ({
            username: user.name,
            totalWager: user.wagerTotal
        }));

        // Sort users by their total wager in descending order
        users.sort((a, b) => b.totalWager - a.totalWager);

        // Get the top 10 users
        const top10Users = users.slice(0, 10);

        // Define the prize values
        const prizes = ['$1500', '$700', '$400', '$200', '$50', '$50', '$25', '$25', '$10', '$10'];

        // Get the table body element
        const tbody = document.querySelector('#leaderboardTable tbody');

        // Clear any existing rows
        tbody.innerHTML = '';

        // Populate the table with the top 10 users and their prizes
        top10Users.forEach((user, index) => {
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);

            const usernameCell = document.createElement('td');
            usernameCell.textContent = user.username;
            row.appendChild(usernameCell);

            const wagerCell = document.createElement('td');
            wagerCell.textContent = user.totalWager.toFixed(2);
            row.appendChild(wagerCell);

            const prizeCell = document.createElement('td');
            prizeCell.textContent = prizes[index]; // Add the prize value
            row.appendChild(prizeCell);

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching or displaying leaderboard:', error);
        document.querySelector('.leaderboard').innerHTML = '<p>Failed to load leaderboard data. Please try again later.</p>';
    }
}

// Call the function to fetch and display leaderboard on page load
fetchAndDisplayLeaderboard();
