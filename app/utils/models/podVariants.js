import db from "../../db.server";

async function createPodVariant(data) {
  const { productId } = data;
  try {
    await db.podVariants.create({ data: data });
    const podVariants = await db.podVariants.findMany({ where: { productId } });
    return {
      status: "sucess",
      data: podVariants,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function getPodVariantByProductId(productId) {
  try {
    const podVariants = await db.podVariants.findMany({
      where: {
        productId,
      },
    });
    return {
      status: "sucess",
      data: podVariants,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updatePodVariant(data) {
  try {
    const updatedPodVariant = await db.podVariants.update({
      where: {
        id: parseInt(data.id),
      },
      data: data,
    });
    return {
      status: "sucess",
      data: updatedPodVariant,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deletePodVariant(id) {
  try {
    const deletedPodVariant = await db.podVariants.delete({
      where: {
        id: parseInt(id),
      },
    });
    return {
      status: "sucess",
      data: deletedPodVariant,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deleteAllPodVariants(productId) {
  try {
    const podVariants = await db.podVariants.deleteMany({
      where: { productId },
    });
    return {
      status: "sucess",
      data: podVariants,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export {
  createPodVariant,
  updatePodVariant,
  getPodVariantByProductId,
  deletePodVariant,
  deleteAllPodVariants,
};
