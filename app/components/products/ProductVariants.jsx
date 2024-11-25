import {
    Card,
    IndexTable,
    Text,
  } from "@shopify/polaris";


export default function ProductVariants({variants}) {
    const resourceName = {
        singular: "variant",
        plural: "variants",
      };
    
      const rowMarkup = variants.map(({ node }, index) => {
        const colorOption =
          node.selectedOptions.find(
            (option) => option.name.toLowerCase() === "color",
          )?.value || "N/A";
        const sizeOption =
          node.selectedOptions.find(
            (option) => option.name.toLowerCase() === "size",
          )?.value || "N/A";
    
        return (
          <IndexTable.Row id={node.id} key={node.id} position={index}>
            <IndexTable.Cell>
              {node.sku || <span style={{ color: "red" }}>Missing SKU</span>}
            </IndexTable.Cell>
            <IndexTable.Cell>{node.price}</IndexTable.Cell>
            <IndexTable.Cell>
              {node.availableForSale ? "Yes" : "No"}
            </IndexTable.Cell>
            <IndexTable.Cell>{colorOption}</IndexTable.Cell>
            <IndexTable.Cell>{sizeOption}</IndexTable.Cell>
            <IndexTable.Cell>
              {node.inventoryItem.measurement.weight.value}{" "}
              {node.inventoryItem.measurement.weight.unit}
            </IndexTable.Cell>
          </IndexTable.Row>
        );
      });
  return (
    <Card >
     <div style={{marginBottom:'2%'}}>
     <Text alignment="center" fontWeight="bold" variant="headingXs">Product Variants</Text>
     </div>
    <IndexTable
      resourceName={resourceName}
      itemCount={variants.length}
      selectable={false}
      headings={[
        { title: "SKU" },
        { title: "Price" },
        { title: "Available" },
        { title: "Color" },
        { title: "Size" },
        { title: "Weight" },
      ]}
    >
      {rowMarkup}
    </IndexTable>
  </Card>
  )
}
