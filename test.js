async function test() {
    const res = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `test_profile_${Date.now()}@test.com`, password: 'Password1!', role: 'STUDENT' })
    });
    const authData = await res.json();
    console.log("Auth Status:", res.status, authData.token ? "GOT TOKEN" : "NO TOKEN");

    const profileRes = await fetch(`http://localhost:8080/api/v1/profiles/${authData.userId}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify({ firstName: "Test", lastName: "User", batchYear: 2024, branch: "CSE", location: "India", role: "STUDENT" })
    });
    console.log("Profile Status:", profileRes.status);
    console.log("Profile Body:", await profileRes.text());
}
test();
