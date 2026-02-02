// Detailed test with full error logging
const baseUrl = 'http://localhost:5000';

async function test() {
    console.log('\n=== TESTING API ENDPOINTS ===\n');

    console.log('1️⃣ Testing Login...');

    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
        })
    });

    const loginData = await loginRes.json();
    console.log('   Status:', loginRes.status);
    console.log('   Response:', JSON.stringify(loginData, null, 2));

    if (!loginData.token) {
        console.log('\n❌ No token received, stopping tests');
        return;
    }

    const token = loginData.token;
    console.log('   Token (first 50 chars):', token.substring(0, 50) + '...');

    console.log('\n2️⃣ Testing Job Creation...');
    console.log('   Sending Authorization header:', `Bearer ${token.substring(0, 20)}...`);

    const jobRes = await fetch(`${baseUrl}/api/jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            company: 'Test Company',
            role: 'Test Role',
            status: 'Applied',
            notes: 'Test notes'
        })
    });

    console.log('   Status:', jobRes.status);
    const jobData = await jobRes.json();
    console.log('   Response:', JSON.stringify(jobData, null, 2));

    if (jobRes.status === 201) {
        console.log('   ✅ Job created successfully!');

        console.log('\n3️⃣ Testing Get Jobs...');

        const getJobsRes = await fetch(`${baseUrl}/api/jobs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('   Status:', getJobsRes.status);
        const jobs = await getJobsRes.json();
        console.log('   Jobs count:', Array.isArray(jobs) ? jobs.length : 'N/A');
        console.log('   Response:', JSON.stringify(jobs, null, 2));
    } else {
        console.log('   ❌ Job creation failed');
    }

    console.log('\n=== TEST COMPLETE ===\n');
}

test().catch(err => {
    console.error('\n❌ TEST ERROR:', err);
    console.error(err.stack);
});
