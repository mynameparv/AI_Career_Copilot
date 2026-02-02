// Test script for API endpoints with new local storage
// Run this after starting the server with: node server.js

const API_BASE = 'http://localhost:5000';
let authToken = '';
let userId = '';

// Helper function to make requests
async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error(`❌ Error calling ${endpoint}:`, error.message);
        return { status: 500, error: error.message };
    }
}

// Test 1: Register a new user
async function testRegister() {
    console.log('\n🧪 Test 1: Register User');
    const result = await makeRequest('/api/auth/register', 'POST', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    });

    if (result.status === 201) {
        console.log('✅ User registered successfully');
        console.log('   User ID:', result.data._id);
        console.log('   Name:', result.data.name);
        console.log('   Email:', result.data.email);
        authToken = result.data.token;
        userId = result.data._id;
        return true;
    } else {
        console.log('❌ Registration failed:', result.data);
        return false;
    }
}

// Test 2: Login with created user
async function testLogin() {
    console.log('\n🧪 Test 2: Login User');
    const result = await makeRequest('/api/auth/login', 'POST', {
        email: 'test@example.com',
        password: 'password123'
    });

    if (result.status === 200) {
        console.log('✅ Login successful');
        console.log('   Token received:', result.data.token ? 'Yes' : 'No');
        authToken = result.data.token;
        return true;
    } else {
        console.log('❌ Login failed:', result.data);
        return false;
    }
}

// Test 3: Create a job
async function testCreateJob() {
    console.log('\n🧪 Test 3: Create Job');
    const result = await makeRequest('/api/jobs', 'POST', {
        company: 'Google',
        role: 'Software Engineer',
        status: 'Applied',
        notes: 'Applied via LinkedIn'
    }, authToken);

    if (result.status === 201) {
        console.log('✅ Job created successfully');
        console.log('   Job ID:', result.data._id);
        console.log('   Company:', result.data.company);
        console.log('   Role:', result.data.role);
        console.log('   Status:', result.data.status);
        return result.data._id;
    } else {
        console.log('❌ Job creation failed:', result.data);
        return null;
    }
}

// Test 4: Get all jobs
async function testGetJobs() {
    console.log('\n🧪 Test 4: Get All Jobs');
    const result = await makeRequest('/api/jobs', 'GET', null, authToken);

    if (result.status === 200) {
        console.log('✅ Jobs retrieved successfully');
        console.log('   Total jobs:', result.data.length);
        if (result.data.length > 0) {
            console.log('   First job:', result.data[0].company, '-', result.data[0].role);
        }
        return true;
    } else {
        console.log('❌ Failed to get jobs:', result.data);
        return false;
    }
}

// Test 5: Update a job
async function testUpdateJob(jobId) {
    console.log('\n🧪 Test 5: Update Job');
    const result = await makeRequest(`/api/jobs/${jobId}`, 'PUT', {
        status: 'Interviewing',
        notes: 'First round scheduled'
    }, authToken);

    if (result.status === 200) {
        console.log('✅ Job updated successfully');
        console.log('   New status:', result.data.status);
        console.log('   New notes:', result.data.notes);
        return true;
    } else {
        console.log('❌ Job update failed:', result.data);
        return false;
    }
}

// Test 6: Create a project
async function testCreateProject() {
    console.log('\n🧪 Test 6: Create Project');
    const result = await makeRequest('/api/projects', 'POST', {
        title: 'AI Career Copilot',
        description: 'Building an AI-powered career assistant',
        status: 'In Progress'
    }, authToken);

    if (result.status === 201) {
        console.log('✅ Project created successfully');
        console.log('   Project ID:', result.data._id);
        console.log('   Title:', result.data.title);
        console.log('   Status:', result.data.status);
        return result.data._id;
    } else {
        console.log('❌ Project creation failed:', result.data);
        return null;
    }
}

// Test 7: Get all projects
async function testGetProjects() {
    console.log('\n🧪 Test 7: Get All Projects');
    const result = await makeRequest('/api/projects', 'GET', null, authToken);

    if (result.status === 200) {
        console.log('✅ Projects retrieved successfully');
        console.log('   Total projects:', result.data.length);
        if (result.data.length > 0) {
            console.log('   First project:', result.data[0].title);
        }
        return true;
    } else {
        console.log('❌ Failed to get projects:', result.data);
        return false;
    }
}

// Test 8: Delete a job
async function testDeleteJob(jobId) {
    console.log('\n🧪 Test 8: Delete Job');
    const result = await makeRequest(`/api/jobs/${jobId}`, 'DELETE', null, authToken);

    if (result.status === 200) {
        console.log('✅ Job deleted successfully');
        return true;
    } else {
        console.log('❌ Job deletion failed:', result.data);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting API Endpoint Tests');
    console.log('================================');

    try {
        // Authentication tests
        await testRegister();
        await new Promise(resolve => setTimeout(resolve, 500));

        await testLogin();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Job tests
        const jobId = await testCreateJob();
        await new Promise(resolve => setTimeout(resolve, 500));

        await testGetJobs();
        await new Promise(resolve => setTimeout(resolve, 500));

        if (jobId) {
            await testUpdateJob(jobId);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Project tests
        await testCreateProject();
        await new Promise(resolve => setTimeout(resolve, 500));

        await testGetProjects();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Cleanup
        if (jobId) {
            await testDeleteJob(jobId);
        }

        console.log('\n================================');
        console.log('✅ All tests completed!');
        console.log('\n💾 Check backend/data/ directory for JSON files:');
        console.log('   - users.json');
        console.log('   - jobs.json');
        console.log('   - projects.json');

    } catch (error) {
        console.error('\n❌ Test suite failed:', error);
    }
}

// Run tests
runAllTests();
