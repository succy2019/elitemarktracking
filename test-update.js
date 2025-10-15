// Test script to check user update functionality
const API_BASE = 'http://localhost:3000';

async function testLogin() {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@elitemgt.com', // Default admin from init script
                password: 'admin123'
            })
        });

        const data = await response.json();
        console.log('Login response:', data);
        
        if (response.ok && data.token) {
            return data.token;
        }
        throw new Error('Login failed');
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

async function testUpdateUser(token) {
    try {
        const updateData = {
            id: 1,
            name: "Test User Updated",
            email: "test@example.com",
            amount: "₦50,000.00",
            status: "pending",
            phone: "+234-803-123-4567",
            address: "123 Test Street, Lagos, Nigeria",
            message: "Test payment for Elite Management services",
            payment_to: "Elite Management Bank",
            account_number: "0012345678",
            estimated_processing_time: "2-3 minutes",
            money_due: "₦50,000.00",
            progress_percentage: 15
        };

        console.log('Sending update request with data:', updateData);

        const response = await fetch(`${API_BASE}/api/users/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        console.log('Update response status:', response.status);
        console.log('Update response ok:', response.ok);

        const responseText = await response.text();
        console.log('Update response text:', responseText);

        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('Update successful:', data);
        } else {
            console.error('Update failed:', responseText);
        }
    } catch (error) {
        console.error('Update error:', error);
    }
}

async function runTest() {
    console.log('Starting test...');
    
    const token = await testLogin();
    if (!token) {
        console.error('Could not get valid token');
        return;
    }
    
    console.log('Got token, testing update...');
    await testUpdateUser(token);
}

runTest();