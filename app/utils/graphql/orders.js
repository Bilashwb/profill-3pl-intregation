const getOrders = async (admin) => {
  try {
    const response = await admin.graphql(
      `#graphql
              query {
                orders(first: 250,query: "status:open") {
    edges{
      node{
        name
        id
        sourceName
        note
        createdAt
        metafields(first:5,namespace:"profill"){
         nodes{
          key
          value
        }
        }
        lineItems(first:250){
          nodes{
            quantity
            product{productType}
          }
        }
        displayFinancialStatus
        totalPriceSet{
          shopMoney{
            amount
          }
        }
        displayFulfillmentStatus
        fullyPaid
        fulfillmentsCount{count}
        currentSubtotalLineItemsQuantity
        customer{
          email
          displayName
        }
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
      orders: data.data.orders.edges,
      pageInfo: data.data.orders.pageInfo,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const getNextOrders = async (admin, cursor) => {
  try {
    const response = await admin.graphql(
      `#graphql
                query($after:String) {
                  orders(first: 25, after:$after) 
                  {
    edges{
      node{
        name
        id
        sourceName
        note
        createdAt
        displayFinancialStatus
        totalPriceSet{
          shopMoney{
            amount
          }
        }
        displayFulfillmentStatus
        fullyPaid
        fulfillmentsCount{count}
        currentSubtotalLineItemsQuantity
        customer{
          email
          displayName
        }
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

const getPrevOrders = async (admin, cursor) => {
  try {
    const response = await admin.graphql(
      `#graphql
                query($before:String) {
                  orders(first: 25, before:$before) {
    edges{
      node{
        name
        id
        sourceName
        note
        createdAt
        displayFinancialStatus
        totalPriceSet{
          shopMoney{
            amount
          }
        }
        displayFulfillmentStatus
        fullyPaid
        fulfillmentsCount{count}
        currentSubtotalLineItemsQuantity
        customer{
          email
          displayName
        }
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


const getOrderById = async (admin, orderId) => {
    orderId=`gid://shopify/Order/${orderId}`
    try {
      const response = await admin.graphql(
        `#graphql
              query GetOrderById($id: ID!) 
       {
        order(id: $id) {
          name
          shippingAddress {
            address2
            city
            country
            countryCodeV2
            address1
            formatted
            zip
          }
          billingAddress {
            address2
            city
            country
            countryCodeV2
            address1
            formatted
            zip
          }
          customAttributes {
            key
            value
          }
          id
          sourceName
          note
          createdAt
          displayFulfillmentStatus
          fullyPaid
          displayFinancialStatus
          totalPriceSet {
            shopMoney {
              amount
            }
          }
          fulfillmentsCount {
            count
          }
          fulfillments {
            trackingInfo(first: 1) {
              url
              company
              number
            }
          }
          currentSubtotalLineItemsQuantity
          customer {
            email
            displayName
          }
          lineItems(first: 250) {
            nodes {
              quantity
              id
              title
            variantTitle
              name
              variant{
              id
              metafields(first:5,namespace:"profill"){
                nodes{
                  key
                  value
                }
              }
              }
              sku
              originalUnitPriceSet {
                presentmentMoney {
                  amount
                }
              }
              product {
                productType
                metafields(first:5,keys: "type") {
                  nodes {
                    value
                  }
                }
              }
            }
          }
        }}`,
        { variables: { id: orderId } },
      );
      const data = await response.json();
      return {
        status: "success",
        order: data.data.order
      };
    } catch (error) {
      return {
        status: "error",
        error,
      };
    }
  };


export { getOrders, getNextOrders, getPrevOrders,getOrderById };
