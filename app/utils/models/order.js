import db from "../../db.server";

async function createOrder(data) {
  try {
    const order = await db.order.create({ data: data });
    return {
      status: "sucess",
      data: order,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function getOrderById(orderId) {
  try {
    const order = await db.order.findFirst({
      where: {
        orderId: id,
      },
    });
    return {
      status: "sucess",
      data: order,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updateOrder(data) {
  try {
    const updatedOrder = await db.order.update({
      where: {
        id: parseInt(data.id),
      },
      data: data,
    });
    return {
      status: "sucess",
      data: updatedOrder,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deleteOrder(id) {
  try {
    const deletedOrder = await db.order.delete({
      where: {
        id: id,
      },
    });
    return {
      status: "sucess",
      data: deletedOrder,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export { createOrder, getOrderById, updateOrder, deleteOrder };
