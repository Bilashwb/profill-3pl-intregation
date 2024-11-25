import { Card,IndexTable,Button } from "@shopify/polaris";
import PodConfigItem from "./PodConfigItem";


export default function PodConfigTable({configs,updateConfig}) {
  return (
  
    <Card title="Configuration List" sectioned>
    <IndexTable
      selectable={false}
      itemCount={configs.length}
      headings={[
        { title: "Location" },
        { title: "Decoration" },
        { title: "Colors" },
        { title: "Description" },
        { title: "Artfile" },
        { title: "Select Art File" },
        { title: "Actions" },
      ]}
    >
      {configs.map((config, index) => (
        <PodConfigItem config={config} updateConfig={updateConfig}/>
      ))}
    </IndexTable>
  </Card>
  )
}
