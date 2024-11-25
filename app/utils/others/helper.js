function findMetafieldValue(metafields, key) {
    const metafield = metafields.find(item => item.node.key === key);
    return metafield ? metafield.node.value : null;
}

function validateVariants(variants) {
    const seenSkus = new Set();
    const errors = [];
  
    variants.forEach(variantData => {
      const variant = variantData.node;
      const sku = variant.sku;
      const weight = variant.inventoryItem?.measurement?.weight?.value || 0;
  
      // Check if SKU is null or empty
      if (!sku) {
        errors.push("Variant missing SKU.");
      } else {
        // Check if SKU is unique
        if (seenSkus.has(sku)) {
          errors.push(`SKU '${sku}' is not unique.`);
        }
        seenSkus.add(sku);
      }
  
      // Check if weight is greater than 0
      if (weight <= 0) {
        errors.push(`Variant with SKU '${sku}' has invalid weight: ${weight}. Weight must be greater than 0.`);
      }
    });
  
    return errors;
  }
  
  const getOptionValue = (data,name)=> {
    const item = data.find(obj => obj.name.toLowerCase() === name.toLowerCase());
    return item ? item.value : 'N/A';
}
 
const divideVariants = (variants) => {
  const withMetafields = [];
  const withoutMetafields = [];

  variants.forEach(variant => {
    if (variant.node.metafields && variant.node.metafields.edges.length > 0) {
      withMetafields.push(variant);
    } else {
      withoutMetafields.push(variant);
    }
  });

  return { withMetafields, withoutMetafields };
};
function findSkuByVariantId(data, variantId) {
  for (let i = 0; i < data.length; i++) {
      if (data[i].node.id === variantId) {
          return data[i].node.sku;
      }
  }
  // If no match is found, return null or any message you prefer
  return null;
}
function getWeightByVariantId(variants,variantId) {
  const variant = variants.find(v => v.node.id === variantId);
  if (variant && variant.node.inventoryItem && variant.node.inventoryItem.measurement) {
    return variant.node.inventoryItem.measurement.weight.value;
  }
  return 0;
}
export{findMetafieldValue,validateVariants,getOptionValue,divideVariants,getWeightByVariantId,findSkuByVariantId}