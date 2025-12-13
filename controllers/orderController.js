const Card = require("../models/Card");
const Order = require("../models/Order");

// Confirm order
const confirmOrder = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { items, location } = req.body; //receive location

    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    if (!location || !location.lat || !location.lon)
      return res.status(400).json({ success: false, message: "Delivery location is required" });

    let totalPrice = 0;
    const savedOrders = [];

    for (const item of items) {
      const card = await Card.findById(item.cardId);
      if (!card)
        return res.status(404).json({ success: false, message: "Card not found" });

      if (item.quantity % 20 !== 0)
        return res.status(400).json({ success: false, message: "Quantity must be multiple of 20" });

      if (card.stock < item.quantity)
        return res.status(400).json({ success: false, message: "Not enough stock" });

      const itemPrice = card.price * (item.quantity / 20);
      totalPrice += itemPrice;

      card.stock -= item.quantity;
      if (card.stock === 0) card.available = false;
      await card.save();

      const order = new Order({
        userId,
        itemName: card.title,
        quantity: item.quantity,
        unitPrice: card.price,
        totalPrice: itemPrice,
        location: { lat: location.lat, lon: location.lon }, //save location
      });

      await order.save();
      savedOrders.push(order);
    }

    res.json({ success: true, message: "Order confirmed", orders: savedOrders, totalPrice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "fullName email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Export both functions
module.exports = { confirmOrder, getOrders };
