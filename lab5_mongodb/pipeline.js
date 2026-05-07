db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "product"
        }
    },
    { $unwind: "$product" },
    {
        $group: {
            _id: "$product.category",
            total_sold: { $sum: "$items.quantity" },
            total_revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
            avg_price: { $avg: "$items.price" }
        }
    },
    { $sort: { total_revenue: -1 } },
    {
        $project: {
            _id: 0,
            category: "$_id",
            total_sold: 1,
            total_revenue: 1,
            avg_price: { $round: ["$avg_price", 2] }
        }
    }
]);