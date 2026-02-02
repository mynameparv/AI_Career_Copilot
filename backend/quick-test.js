// Simple manual test to debug
const testUrl = 'http://localhost:5000/api/auth/login';

fetch(testUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
    })
})
    .then(res => res.json())
    .then(data => {
        console.log('Login response:', data);

        if (data.token) {
            // Test creating a job
            return fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify({
                    company: 'Google',
                    role: 'Software Engineer',
                    status: 'Applied',
                    notes: 'Test job'
                })
            });
        }
    })
    .then(res => res ? res.json() : null)
    .then(data => {
        if (data) {
            console.log('Job creation response:', data);
        }
    })
    .catch(err => console.error('Error:', err));
