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
    { $match: { "user_info.email": "alice@example.com" } },
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
    { $project: { order_id: "$_id", status: 1, total_amount: 1, items_count: { $size: "$items" } } }
]);

db.orders.aggregate([
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
    { $match: { total_amount: { $gt: 80000 } } }
]).forEach(order => {
    db.orders.updateOne(
        { _id: order._id },
        { $set: { discount: 10, discount_reason: "large order" } }
    );
});

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
db.orders.deleteMany({ status: "cancelled", order_date: { $lt: thirtyDaysAgo } });
