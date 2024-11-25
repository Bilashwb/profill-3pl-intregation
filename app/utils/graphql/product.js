const getProductsByType = async (admin, ptype) => {
  ptype = `product_type:${ptype}`;
  try {
    const response = await admin.graphql(
      `#graphql
            query($qur: String) {
              products(first: 25, query: $qur) {
                edges {
                  node {
                    id
                    title
                    variantsCount { count }
                    handle
                    totalInventory
                    tags
                    category { name }
                    priceRangeV2 { maxVariantPrice { amount } }
                    featuredMedia { preview { image { url } } }
                    productType
                    status
                  }
                }
                pageInfo{
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
              }
            }`,
      { variables: { qur: ptype } },
    );
    const data = await response.json();
    return {
      status: "success",
      products: data.data.products.edges,
      pageInfo: data.data.products.pageInfo,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};
const getProducts = async (admin) => {
  try {
    const response = await admin.graphql(
      `#graphql
            query {
              products(first: 25, query:"product_type:''") {
                edges {
                  node {
                    id
                    title
                    variantsCount { count }
                    handle
                    totalInventory
                    tags
                    category { name }
                    priceRangeV2 { maxVariantPrice { amount } }
                    featuredMedia { preview { image { url } } }
                    productType
                    status
                  }
                }
                pageInfo{
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
              }
            }`,
    );
    const data = await response.json();
    return {
      status: "success",
      products: data.data.products.edges,
      pageInfo: data.data.products.pageInfo,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};
const getNextProductsByType = async (admin, ptype, cursor) => {
  ptype = `product_type:${ptype}`;
  try {
    const response = await admin.graphql(
      `#graphql
            query($qur: String,$after:String) {
              products(first: 25, query: $qur, after:$after) {
                edges {
                  node {
                    id
                    title
                    variantsCount { count }
                    handle
                    totalInventory
                    tags
                    category { name }
                    priceRangeV2 { maxVariantPrice { amount } }
                    featuredMedia { preview { image { url } } }
                    productType
                    status
                  }
                }
                pageInfo{
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
              }
            }`,
      { variables: { qur: ptype, after: cursor } },
    );
    const data = await response.json();
    return {
      status: "success",
      products: data.data.products.edges,
      pageInfo: data.data.products.pageInfo,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const getPrevProductsByType = async (admin, ptype, cursor) => {
  ptype = `product_type:${ptype}`;
  try {
    const response = await admin.graphql(
      `#graphql
            query($qur: String,$before :String) {
              products(first: 25, query: $qur ,before:$before) {
                edges {
                  node {
                    id
                    title
                    variantsCount { count }
                    handle
                    totalInventory
                    tags
                    category { name }
                    priceRangeV2 { maxVariantPrice { amount } }
                    featuredMedia { preview { image { url } } }
                    productType
                    status
                  }
                }
                pageInfo{
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
              }
            }`,
      { variables: { qur: ptype, before: cursor } },
    );
    const data = await response.json();
    return {
      status: "success",
      products: data.data.products.edges,
      pageInfo: data.data.products.pageInfo,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};
const getNextProducts = async (admin, cursor) => {
  try {
    const response = await admin.graphql(
      `#graphql
              query($after:String) {
                products(first: 25, query:"product_type:''" , after:$after) {
                  edges {
                    node {
                      id
                      title
                      variantsCount { count }
                      handle
                      totalInventory
                      tags
                      category { name }
                      priceRangeV2 { maxVariantPrice { amount } }
                      featuredMedia { preview { image { url } } }
                      productType
                      status
                    }
                  }
                  pageInfo{
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
                }
              }`,
      { variables: { after: cursor } },
    );
    const data = await response.json();
    return {
      status: "success",
      products: data.data.products.edges,
      pageInfo: data.data.products.pageInfo,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const getPrevProducts = async (admin, cursor) => {
  try {
    const response = await admin.graphql(
      `#graphql
              query($before:String) {
                products(first: 25, query:"product_type:''" , before:$before) {
                  edges {
                    node {
                      id
                      title
                      variantsCount { count }
                      handle
                      totalInventory
                      tags
                      category { name }
                      priceRangeV2 { maxVariantPrice { amount } }
                      featuredMedia { preview { image { url } } }
                      productType
                      status
                    }
                  }
                  pageInfo{
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
                }
              }`,
      { variables: { before: cursor } },
    );
    const data = await response.json();
    return {
      status: "success",
      products: data.data.products.edges,
      pageInfo: data.data.products.pageInfo,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const getProductById = async (admin, productId) => {
    productId=`gid://shopify/Product/${productId}`
    try {
      const response = await admin.graphql(
        `#graphql
              query($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          options{name}
          description
          tags
          featuredImage {
            originalSrc
          }
          variants(first: 100) {
            edges {
              node {
                id
                inventoryQuantity
                metafields(first: 7, namespace: "profill") {
            edges {
              node {
                id
                namespace
                key
                value
                type
                description
              }
            }
          }
                sku
                price
                inventoryItem {
                duplicateSkuCount
                  measurement {
                    weight {
                      unit
                      value
                    }
                  }
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          metafields(first: 5, namespace: "profill") {
            edges {
              node {
                id
                namespace
                key
                value
                type
                description
              }
            }
          }
          productType
          status
        }
      }`,
        { variables: { id: productId } },
      );
      const data = await response.json();
      return {
        status: "success",
        product: data.data.product
      };
    } catch (error) {
      return {
        status: "error",
        error,
      };
    }
  };

  const UpdateProduct = async (admin, input) => {

    try {
      const response = await admin.graphql(
        `#graphql
            mutation UpdateProductWithNewMedia($input: ProductInput!) {
    productUpdate(input: $input,) {
      product {
        id
          title
          handle
          description
          tags
          featuredImage {
            originalSrc
          }
          variants(first: 100) {
            edges {
              node {
                id
                sku
                price
                inventoryItem {
                duplicateSkuCount
                  measurement {
                    weight {
                      unit
                      value
                    }
                  }
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          metafields(first: 10, namespace: "profill") {
            edges {
              node {
                id
                namespace
                key
                value
                type
                description
              }
            }
          }
          productType
          status
      }
      userErrors {
        field
        message
      }
    }
  }`,
        { variables: { input: input } },
      );
      const data = await response.json();
      return {
        status: "success",
        products: data.data.productUpdate.product
      };
    } catch (error) {
      return {
        status: "error",
        error,
      };
    }
  };
  const getProductsByTitle = async (admin, title) => {
   let ptype = `title:*${title}*`;
    try {
      const response = await admin.graphql(
        `#graphql
              query($qur: String) {
                products(first: 25, query: $qur ) {
                  edges {
                    node {
                      id
                      title
                      variantsCount { count }
                      handle
                      totalInventory
                      tags
                      category { name }
                      priceRangeV2 { maxVariantPrice { amount } }
                      featuredMedia { preview { image { url } } }
                      productType
                      status
                    }
                  }
                  pageInfo{
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
                }
              }`,
        { variables: { qur: ptype } },
      );
      const data = await response.json();
      return {
        status: "success",
        products: data.data.products.edges,
        pageInfo: data.data.products.pageInfo,
      };
    } catch (error) {
      return {
        status: "error",
        error,
      };
    }
  };
  const UpdateproductVariants = async (admin, productId,variants) => {
    try {
      const response = await admin.graphql(
        `#graphql
              mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    product {
      id
          title
          handle
          options{name}
          description
          tags
          featuredImage {
            originalSrc
          }
          variants(first: 50) {
            edges {
              node {
                id
                inventoryQuantity
                metafields(first: 5, namespace: "profill") {
            edges {
              node {
                id
                namespace
                key
                value
                type
                description
              }
            }
          }
                sku
                price
                inventoryItem {
                duplicateSkuCount
                  measurement {
                    weight {
                      unit
                      value
                    }
                  }
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          metafields(first: 7, namespace: "profill") {
            edges {
              node {
                id
                namespace
                key
                value
                type
                description
              }
            }
          }
          productType
          status
    }
   
    
  }
}`,
        { variables: { productId:productId,variants:variants } },
      );
      const data = await response.json();
      return {
        status: "success",
        product: data.data.productVariantsBulkUpdate
      };
    } catch (error) {
      return {
        status: "error",
        error,
      };
    }
  };

export {
  UpdateProduct,
  getProductsByType,
  getProducts,
  getNextProducts,
  getProductsByTitle,
  getPrevProducts,
  getPrevProductsByType,
  getNextProductsByType,
  getProductById,
  UpdateproductVariants
};
