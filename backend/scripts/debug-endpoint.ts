
import { authService } from '../src/services/auth.service'; // We can't import easily without tsconfig paths, better use fetch only
// Actually, let's just use pure fetch to localhost

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

    const id = proyectos[0].id;
    console.log(`Testing detail for Project ID: ${id}`);

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

    console.log('4. Getting Seguimiento (GET /proyectos/:id/seguimiento)...');
    const segRes = await fetch(`${BASE}/proyectos/${id}/seguimiento`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Status: ${segRes.status}`);
}

main().catch(console.error);
