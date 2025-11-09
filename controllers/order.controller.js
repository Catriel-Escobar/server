import * as orderService from "../services/order.service.js"

export const listOrders = async (req, res, next) => {
  try {
    const orders = await orderService.listOrders()
    res.json({ data: orders })
  } catch (error) {
    next(error)
  }
}