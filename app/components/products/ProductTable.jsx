import {
  IndexTable,
  TextField,
  Thumbnail,
  Button,
  Tooltip,
  Badge,
} from "@shopify/polaris";
import { SettingsIcon } from "@shopify/polaris-icons";

import { useState, useCallback } from "react";

export default function ProductTable({ products, pageInfo, fun }) {
  const [queryValue, setQueryValue] = useState("");
  const handleQueryChange = useCallback((value) => setQueryValue(value), []);
  const handleQueryClear = useCallback(() => setQueryValue(""), []);

  const filteredProducts = products.filter((product) =>
    product.node.title.toLowerCase().includes(queryValue.toLowerCase()),
  );
  const productHeaders = [
    { title: "Product Image" },
    { title: "Product Name" },
    { title: "Variants" },
    { title: "Total Inventory" },
    { title: "Price" },
    { title: "Status" },
    { title: "Action" },
  ];
  const productRows = filteredProducts.map((product) => ({
    id: product.node.id,
    url: `/app/products/${product.node.handle}`,
    children: [
      <Thumbnail
        key="image"
        source={
          product.node.featuredMedia?.preview?.image?.url ||
          "/placeholder-image.png"
        } 
        alt={product.node.title}
        size="extraSmall"
      />,
      product.node.title,
      product.node.variantsCount.count,
      product.node.totalInventory,
      `$${product.node.priceRangeV2.maxVariantPrice.amount}`,
      <Badge>{product.node.status}</Badge>,
      <Tooltip content="Configure Product">
        <Button
          url={"/app/product/" + product.node.id.slice(22)}
          icon={SettingsIcon}
        ></Button>
      </Tooltip>,
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
        itemCount={productRows.length}
        headings={productHeaders}
        selectable={false}
        pagination={{
          hasNext: pageInfo?.hasNextPage,
          onNext: () => {
            fun(
              { type: "nextPage", cursor: pageInfo.endCursor },
              { method: "post" },
            );
          },
          hasPrevious: pageInfo?.hasPreviousPage,
          onPrevious: () => {
            fun(
              { type: "prevPage", cursor: pageInfo.startCursor },
              { method: "post" },
            );
          },
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
  );
}
