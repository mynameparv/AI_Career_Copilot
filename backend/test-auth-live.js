
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    console.log('--- Starting Auth Flow Test ---');

    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    try {
        // 1. Register
        console.log(`\n1. Registering user: ${testUser.email}`);
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        if (!regRes.ok) {
            const err = await regRes.text();
            throw new Error(`Registration failed: ${err}`);
        }
        const regData = await regRes.json();
        console.log('   SUCCESS: User registered.', regData._id);

        // 2. Login
        console.log(`\n2. Logging in user: ${testUser.email}`);
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });

        if (!loginRes.ok) {
            const err = await loginRes.text();
            throw new Error(`Login failed: ${err}`);
        }
        const loginData = await loginRes.json();
        console.log('   SUCCESS: User logged in.');
        console.log('   Token received:', loginData.token ? 'YES' : 'NO');

        console.log('\n--- Test Passed: Full Auth Flow works! ---');

    } catch (error) {
        console.error('\n--- Test FAILED ---');
        console.error(error.message);
        process.exit(1);
    }
}

testAuth();
