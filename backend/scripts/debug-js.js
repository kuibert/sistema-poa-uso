
async function main() {
    const BASE = 'http://localhost:5000/api';

    console.log('1. Logging in...');
    const loginRes = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'carlos.martinez@uso.edu.sv', password: 'any' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', loginRes.status, await loginRes.text());
        process.exit(1);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Token obtained');

    console.log('2. Listing projects...');
    const listRes = await fetch(`${BASE}/proyectos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!listRes.ok) {
        console.error('List failed:', listRes.status, await listRes.text());
        process.exit(1);
    }

    const proyectos = await listRes.json();
    console.log(`Found ${proyectos.length} projects`);

    if (proyectos.length === 0) {
        console.log('No projects to test detail on.');
        return;
    }

    const id = proyectos[0].id; // id is likely integer
    console.log(`Testing detail for Project ID: ${id} (Type: ${typeof id})`);

    console.log('3. Getting Project Detail (GET /proyectos/:id)...');
    const detailRes = await fetch(`${BASE}/proyectos/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`Status: ${detailRes.status}`);
    if (!detailRes.ok) {
        console.log('Body:', await detailRes.text());
    } else {
        console.log('Success. Body length:', (await detailRes.text()).length);
    }

    console.log('4. Testing Malformed Path (GET /proyectos/actividades/5)...');
    // Expect 404 or 500, check if 401
    const malRes = await fetch(`${BASE}/proyectos/actividades/5`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Status Malformed: ${malRes.status}`);
}

main().catch(console.error);
