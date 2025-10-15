// Test script to check the API endpoint
const testAPI = async () => {
    try {
        // First login to get a token
        const loginResponse = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });
        
        if (!loginResponse.ok) {
            console.error('Login failed:', await loginResponse.text());
            return;
        }
        
        const loginData = await loginResponse.json();
        console.log('Login successful, token:', loginData.token ? 'Present' : 'Missing');
        
        // Now test the users endpoint
        const usersResponse = await fetch('http://localhost:3000/api/users/all', {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        });
        
        console.log('Users API status:', usersResponse.status);
        const usersData = await usersResponse.json();
        console.log('Users data:', usersData);
        
    } catch (error) {
        console.error('Error testing API:', error);
    }
};

testAPI();
