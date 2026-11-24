async function testFinalServer() {
    try {
        console.log('Testing http://localhost:7777/search-kakao-book ...');
        const res = await fetch('http://localhost:7777/search-kakao-book?keyword=%ED%85%8C%EC%8A%A4%ED%8A%B8&display=10&start=1&sort=sim');
        console.log('Status:', res.status, res.statusText);
        const json = await res.json();
        console.log('Status:', json.status);
        console.log('Total Books:', json.data?.total);
        console.log('First Item:', json.data?.items?.[0]?.title);
    } catch (e: any) {
        console.error('Error fetching local server:', e.message);
    }
}

testFinalServer();
