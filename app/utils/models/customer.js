import db from "../../db.server";
async function createCustomer(data) {
  try {
    const customer = await db.customers.create({
      data: data,
    });
    return {
      status: "sucess",
      data: customer,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function getCustomerByShop(shop) {
  try {
    const customer = await db.customers.findFirst({
      where: {
        shop,
      },
    });
    if (customer) {
      return {
        status: "sucess",
        data: customer,
      };
    } else {
      return {
        status: "notfound",
      };
    }
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updateCustomer(data) {
  const { credential, customer_id, environment, prefix, id } = data;
  console.log(data)
  try {
    const updatedCustomer = await db.customers.update({
      where: {
        id: parseInt(id),
      },
      data: { credential, customer_id:parseInt(customer_id), environment:parseInt(environment), prefix },
    });
    return {
      status: "sucess",
      data: updatedCustomer,
    };
  } catch (error) {
    console.log(error)
    return {
      status: "error",
      error,
    };
  }
}

async function deleteCustomer(shop) {
  try {
    const deletedCustomer = await db.customers.deleteMany({
      where: {
        shop,
      },
    });
    return {
      status: "sucess",
      data: deletedCustomer,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export { createCustomer, deleteCustomer, getCustomerByShop, updateCustomer };
