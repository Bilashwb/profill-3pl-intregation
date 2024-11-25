import { Button, Card, IndexTable, Text } from "@shopify/polaris";
import { findMetafieldValue, getOptionValue } from "../../../utils/others/helper";
import { PlusIcon, RefreshIcon } from "@shopify/polaris-icons";
export default function PpsRemainVariants({ variants, handleAddPps }) {
  return (
    <div  style={{marginTop:'2%',marginBottom:'2%'}}>
      <Card title="Variants without Metafields">
      <div style={{ marginBottom: "1%", marginTop: "1%" }}>
      <Text alignment="center" fontWeight="bold" variant="bodyLg">Variants with Completed Configuration</Text>
      </div>
      <IndexTable
        itemCount={variants.length}
        headings={[
          { title: "SKU" },
                { title: "UPC Code" },
                { title: "HTS Code" },
                { title: "Profill Sku" },
                { title: "Color" },
                { title: "Size" },
                { title: "Weight" },
                { title: "Profill Status" },
                { title: "Inventory Quantity" },
                { title: "Sync Inventory" },
        ]}
        selectable={false}
      >
        {variants.map((variant) => (
          
          <IndexTable.Row key={variant.node.id}>
            <IndexTable.Cell>{variant.node.sku}</IndexTable.Cell>
            <IndexTable.Cell>{findMetafieldValue (variant.node.metafields.edges,"upc_code")}</IndexTable.Cell>
            <IndexTable.Cell>{findMetafieldValue (variant.node.metafields.edges,"hts_code")}</IndexTable.Cell>
            <IndexTable.Cell>{findMetafieldValue (variant.node.metafields.edges,"profill_sku")}</IndexTable.Cell>
            <IndexTable.Cell>{getOptionValue(variant.node.selectedOptions, "color")}</IndexTable.Cell>
            <IndexTable.Cell>
              {getOptionValue(variant.node.selectedOptions, "size")}
            </IndexTable.Cell>
            <IndexTable.Cell>
              {variant.node.inventoryItem.measurement.weight.value}{" "}
              {variant.node.inventoryItem.measurement.weight.unit}
            </IndexTable.Cell>
            <IndexTable.Cell>{findMetafieldValue (variant.node.metafields.edges,"status")}</IndexTable.Cell>
            <IndexTable.Cell>{variant.node.inventoryQuantity} </IndexTable.Cell>

            
            <IndexTable.Cell>
              <Text >
                <Button
                  a
                  icon={RefreshIcon}
                
                ></Button>
              </Text>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </Card>
    </div>
  );
}
