
import { Card, Layout, Page, Text, TextField, IndexTable,Thumbnail, Button ,Tooltip, Badge } from "@shopify/polaris";
import {
  ViewIcon
} from '@shopify/polaris-icons';

import { useState, useCallback } from "react";
export default function PpsProductTable({products,pageInfo}) {
  const [queryValue, setQueryValue] = useState("");
  const handleQueryChange = useCallback((value) => setQueryValue(value), []);
  const handleQueryClear = useCallback(() => setQueryValue(""), []);

  const filteredProducts = products.filter((product) =>
    product.node.title.toLowerCase().includes(queryValue.toLowerCase()),
  );


  const productHeaders = [
    { title: "Product Image" },
    { title: "Product Name" },
    { title: "Product Type" },
    { title: "Variants" },
    { title: "Total Inventory" },
    { title: "Price" },
    { title: "Status" },
    { title: "Action" },
  ];

  
  const productRows = filteredProducts.map((product) => ({
    id: product.node.id,
    url: `/app/products/${product.node.handle}`, // Assuming handle is the unique identifier for the product
    children: [
      <Thumbnail
      key="image"
      source={product.node.featuredMedia?.preview?.image?.url || "/placeholder-image.png"} // Fallback if no image exists
      alt={product.node.title}
      size="extraSmall"
    />,
      product.node.title,
      product.node.productType,  // Product Name
      product.node.variantsCount.count, // Variants count
      product.node.totalInventory, // Total Inventory
      `$${product.node.priceRangeV2.maxVariantPrice.amount}`, // Price
      <Badge>{product.node.status}</Badge>,
      <Tooltip content="View Product">
      <Button url={"/app/product/pps/"+product.node.id.slice(22)} icon={ViewIcon}></Button>
    </Tooltip>
    ],
  }));
  return (
   <>
    <div style={{ marginBottom: "1%" }}>
    <TextField
      value={queryValue}
      onChange={handleQueryChange}
      placeholder="Search Products"
      clearButton
      onClearButtonClick={handleQueryClear}
    />
  </div>
    <IndexTable
    resourceName={{ singular: "product", plural: "products" }}
    itemCount={filteredProducts.length}
    headings={productHeaders}
    selectable={false} 
    pagination={{hasNext:pageInfo?.hasNextPage,
      onNext:()=>{},
      hasPrevious:pageInfo?.hasPreviousPage,
      onPrevious:()=>{}
  }}
  
  >
    {productRows.map((row, index) => (
      <IndexTable.Row
        key={row.id}
        id={row.id}
        url={row.url}
        position={index}
      >
        {row.children.map((child, idx) => (
          <IndexTable.Cell key={idx}>{child}</IndexTable.Cell>
        ))}
      </IndexTable.Row>
    ))}
  </IndexTable>
   </>
  )
}
