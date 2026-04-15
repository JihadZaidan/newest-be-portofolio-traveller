const API_BASE_URL = 'http://localhost:55435/api';

async function testShopAPI() {
    try {
        console.log('Testing shop API...');
        
        // Test GET all shop items
        console.log('\n1. Testing GET /api/shop-items');
        const getResponse = await fetch(`${API_BASE_URL}/shop-items`);
        const getData = await getResponse.json();
        console.log('GET Response:', getData);
        console.log('Number of items:', getData.data?.length || 0);
        
        if (getData.success && getData.data.length > 0) {
            const firstItem = getData.data[0];
            console.log('First item:', firstItem);
            
            // Test GET single item
            console.log('\n2. Testing GET /api/shop-items/:id');
            const getSingleResponse = await fetch(`${API_BASE_URL}/shop-items/${firstItem.id}`);
            const getSingleData = await getSingleResponse.json();
            console.log('GET Single Response:', getSingleData);
        }
        
    } catch (error) {
        console.error('API Test Error:', error.message);
    }
}

testShopAPI();
