use shop_mongo;

db.users.insertMany([
    {
        _id: 1,
        email: "alice@example.com",
        full_name: "Alice Smith",
        created_at: new Date(),
        address: { city: "Moscow", street: "Tverskaya", zipcode: "101000" }
    },
    {
        _id: 2,
        email: "bob@example.com",
        full_name: "Bob Johnson",
        created_at: new Date(),
        address: { city: "Saint Petersburg", street: "Nevsky", zipcode: "191186" }
    }
]);

db.products.insertMany([
    { _id: 1, name: "Ноутбук", category: "Электроника", price: 75000, stock_quantity: 10 },
    { _id: 2, name: "Мышь", category: "Электроника", price: 1500, stock_quantity: 50 },
    { _id: 3, name: "Книга SQL", category: "Книги", price: 2500, stock_quantity: 30 },
    { _id: 4, name: "Монитор", category: "Электроника", price: 35000, stock_quantity: 7 },
    { _id: 5, name: "Клавиатура", category: "Электроника", price: 5000, stock_quantity: 20 }
]);

// Заказы (каждый содержит массив items)
db.orders.insertMany([
    {
        _id: 1,
        user_id: 1,   // Alice
        order_date: new Date("2025-04-01T10:00:00Z"),
        status: "completed",
        items: [
            { product_id: 1, quantity: 1, price: 75000 },  // Ноутбук
            { product_id: 2, quantity: 2, price: 1500 },   // 2 мыши
            { product_id: 4, quantity: 1, price: 35000 }    // Монитор
        ]
    },
    {
        _id: 2,
        user_id: 2,   // Bob
        order_date: new Date("2025-04-05T12:30:00Z"),
        status: "completed",
        items: [
            { product_id: 3, quantity: 1, price: 2500 },    // Книга SQL
            { product_id: 5, quantity: 1, price: 5000 }     // Клавиатура
        ]
    },
    {
        _id: 3,
        user_id: 1,   // Alice (второй заказ)
        order_date: new Date("2025-04-10T09:15:00Z"),
        status: "pending",
        items: [
            { product_id: 2, quantity: 1, price: 1500 }     // Мышь
        ]
    }
]);