import db from "../../db.server";

async function createPodConfig(data) {
  try {
    await db.podConfigs.create({
      data: data,
    });
    const podConfigs = await db.podConfigs.findMany({
      where: { productId: data.productId },
    });
    return {
      status: "sucess",
      data: podConfigs,
    };
  } catch (error) {
    console.error("Error creating PodConfig:", error);
    return {
      status: "error",
      error,
    };
  }
}

async function getPodConfigs(productId) {
  try {
    const podConfigs = await db.podConfigs.findMany({
      where: {
        productId,
      },
    });
    return {
      status: "sucess",
      data: podConfigs,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updatePodConfig(data) {
  try {
    const updatedPodConfig = await db.podConfigs.update({
      where: {
        id: parseInt(data.id),
      },
      data: data,
    });
    return {
      status: "sucess",
      data: updatedPodConfig,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deletePodConfig(id) {
  try {
    const deletedPodConfig = await db.podConfigs.delete({
      where: {
        id: parseInt(id),
      },
    });
    return deletedPodConfig;
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}
async function deleteAllPodConfig(productId) {
  try {
    const deletedPodConfig = await db.podConfigs.deleteMany({
      where: {
        productId,
      },
    });
    return deletedPodConfig;
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}
export {
  createPodConfig,
  updatePodConfig,
  getPodConfigs,
  deletePodConfig,
  deleteAllPodConfig,
};
