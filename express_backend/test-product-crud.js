const API_URL = "http://localhost:5000/api/products";

async function testProductCRUD() {
    console.log("Testing Product CRUD...");

    try {
        // 1. Create
        console.log("\n1. Creating Product...");
        const createRes = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Laptop",
                price: 999.99,
                category: "Electronics"
            })
        });
        const createdProduct = await createRes.json();
        console.log("Created:", JSON.stringify(createdProduct, null, 2));

        if (!createdProduct.success || !createdProduct.data._id) {
            console.error("Failed to create product");
            return;
        }
        const productId = createdProduct.data._id;

        // 2. Read All
        console.log("\n2. Reading All Products...");
        const readAllRes = await fetch(API_URL);
        const allProducts = await readAllRes.json();
        console.log("All Products Count:", allProducts.data.length);

        // 3. Read by Category
        console.log("\n3. Reading by Category (Electronics)...");
        const readCategoryRes = await fetch(`${API_URL}?category=Electronics`);
        const categoryProducts = await readCategoryRes.json();
        console.log("Category Products Count:", categoryProducts.data.length);

        // 4. Update
        console.log(`\n4. Updating Product ${productId}...`);
        const updateRes = await fetch(`${API_URL}/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                price: 899.99
            })
        });
        const updatedProduct = await updateRes.json();
        console.log("Updated:", JSON.stringify(updatedProduct, null, 2));

        // 5. Delete
        console.log(`\n5. Deleting Product ${productId}...`);
        const deleteRes = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE"
        });
        const deletedProduct = await deleteRes.json();
        console.log("Deleted:", JSON.stringify(deletedProduct, null, 2));

    } catch (error) {
        console.error("Test Error:", error);
    }
}

testProductCRUD();
