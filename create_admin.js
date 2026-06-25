async function createAdmin() {
    console.log("Initializing Admin Generation Protocol...");

    // 1. Submit Credentials to Auth-Service
    const authPayload = { 
        email: 'abhishekgupta2405@gmail.com', 
        password: 'Kittu2401', 
        role: 'ADMIN' 
    };
    
    console.log(`Step 1: Minting Auth Profile for ${authPayload.email}`);
    const authRes = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authPayload)
    });
    
    if (!authRes.ok) {
        console.error("Auth Failure!", authRes.status, await authRes.text());
        return;
    }
    
    const authData = await authRes.json();
    console.log("Auth Success. Token Acquired. User ID:", authData.userId);

    // 2. Initialize Profile on User-Service
    const profilePayload = { 
        firstName: "Abhishek", 
        lastName: "Gupta", 
        batchYear: 2024, 
        branch: "Admin", 
        location: "India", 
        role: "ADMIN" 
    };

    console.log("Step 2: Syncing Profile Data Vectors...");
    const profileRes = await fetch(`http://localhost:8080/api/v1/profiles/${authData.userId}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify(profilePayload)
    });

    if (!profileRes.ok) {
        console.error("Profile Linkage Failed!", profileRes.status, await profileRes.text());
        return;
    }

    console.log("Global Admin Entity Fully Deployed successfully!");
    console.log("Login Credentials Active:");
    console.log("Email: abhishekgupta2405@gmail.com");
    console.log("Password: Kittu2401");
}

createAdmin().catch(console.error);
