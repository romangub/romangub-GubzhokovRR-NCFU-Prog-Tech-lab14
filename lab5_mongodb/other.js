db.orders.aggregate([
    { $unwind: "$items" },
    {
        $group: {
            _id: "$user_id",
            total_spent: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
    },
    { $sort: { total_spent: -1 } },
    { $limit: 3 },
    {
        $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $project: {
            full_name: { $arrayElemAt: ["$user.full_name", 0] },
            total_spent: 1,
            _id: 0
        }
    }
]);

db.orders.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_info"
        }
    },
    { $unwind: "$user_info" },
    {
        $addFields: {
            total_amount: {
                $reduce: {
                    input: "$items",
                    initialValue: 0,
                    in: { $add: ["$$value", { $multiply: ["$$this.quantity", "$$this.price"] }] }
                }
            }
        }
    },
    {
        $project: {
            order_id: "$_id",
            customer: "$user_info.full_name",
            status: 1,
            order_date: 1,
            total_amount: 1,
            items_count: { $size: "$items" }
        }
    },
    { $sort: { total_amount: -1 } }
]);