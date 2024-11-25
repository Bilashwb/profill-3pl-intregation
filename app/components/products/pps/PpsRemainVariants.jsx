import { Button, Card, IndexTable, Text } from "@shopify/polaris";
import { getOptionValue } from "../../../utils/others/helper";
import { PlusIcon, RefreshIcon } from "@shopify/polaris-icons";
export default function PpsRemainVariants({ variants, handleAddPps }) {
  return (
   <div style={{marginTop:'2%',marginBottom:'2%'}}>
     <Card title="Variants without Metafields">
      <div style={{ marginBottom: "1%", marginTop: "1%" }}>
        <Text alignment="center" fontWeight="bold" variant="bodyLg">
          Variants Pending Configuration
        </Text>
      </div>
      <IndexTable
        itemCount={variants.length}
        headings={[
          { title: "SKU" },
          { title: "Price" },
          { title: "Color" },
          { title: "Size" },
          { title: "Weight" },
          { title: "Action", alignment: "end" },
        ]}
        selectable={false}
      >
        {variants.map((variant) => (
          <IndexTable.Row key={variant.node.id}>
            <IndexTable.Cell>{variant.node.sku}</IndexTable.Cell>
            <IndexTable.Cell>{variant.node.price}</IndexTable.Cell>
            <IndexTable.Cell>
              {getOptionValue(variant.node.selectedOptions, "color")}
            </IndexTable.Cell>
            <IndexTable.Cell>
              {getOptionValue(variant.node.selectedOptions, "size")}
            </IndexTable.Cell>
            <IndexTable.Cell>
              {variant.node.inventoryItem.measurement.weight.value}{" "}
              {variant.node.inventoryItem.measurement.weight.unit}
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text alignment="end">
                <Button
                  a
                  icon={PlusIcon}
                  onClick={() => handleAddPps(variant.node)}
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
