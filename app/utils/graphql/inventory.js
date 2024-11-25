const updateInventory = async (admin, inp) => {
  try {
    let { inventoryItem_id, quantity } = inp;
    let location = await admin.graphql(
      `#graphql
       query{ locations(first:1){ nodes{ id } } }`,
    );
    location = await location.json();
    location = location.data.locations.nodes[0].id;

    let res = await admin.graphql(
      `#graphql
          mutation SetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
        inventorySetOnHandQuantities(input: $input) {
          inventoryAdjustmentGroup {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
          `,
      {
        variables: {
          input: {
            reason: "restock",
            setQuantities: [
              {
                inventoryItemId: inventoryItem_id,
                locationId: location,
                quantity: quantity,
              },
            ],
          },
        },
      },
    );
    res = await res.json();
    return {
      status: "success",
      data: "res",
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const updateInventoryPolicy = async (admin, data) => {
  try {
    let { variantId, inventoryPolicy } = data;
    const response = await admin.graphql(
      `#graphql
    mutation UpdateVariantInventoryPolicy($variantId: ID!, $inventoryPolicy: ProductVariantInventoryPolicy!) {
    productVariantUpdate(input: { id: $variantId, inventoryPolicy: $inventoryPolicy }) {
      productVariant {
        id
        inventoryPolicy
      }
      userErrors {
        field
        message
      }
    }
  }
        `,
      {
        variables: {
          variantId,
          inventoryPolicy,
        },
      },
    );
    let tt = await response.json();
    return {
      status: "success",
      data: tt,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

export { updateInventory, updateInventoryPolicy };
