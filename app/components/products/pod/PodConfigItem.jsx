import { IndexTable,Button,Spinner, DropZone,Link  } from "@shopify/polaris";
import { PlusIcon, SaveIcon, UploadIcon } from "@shopify/polaris-icons";
import { useState } from "react";
export default function PodConfigItem({config,updateConfig}) {

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setfileUrl] = useState(null)
  const handleFileChange = (event, configId) => {
    setSelectedFile({ file: event.target.files[0], configId });
  };

  const handleFileUpload = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const fileUrl = URL.createObjectURL(file);
      setfileUrl(fileUrl)
      setSelectedFile(() => ({file}));
    }
  };


  return (

    <IndexTable.Row id={config.id} key={config.id} >
          <IndexTable.Cell>{config.location}</IndexTable.Cell>
          <IndexTable.Cell>{config.decoration}</IndexTable.Cell>
          <IndexTable.Cell>{config.colors}</IndexTable.Cell>
          <IndexTable.Cell>{config.description}</IndexTable.Cell>
          <IndexTable.Cell>
            {config.artfileUrl ? (
              <Button
                url={fileUrl || config.artfileUrl  }
                target="_blank"
                download
                icon={SaveIcon}
              >
                Download
              </Button>
            ) : (
              "No file uploaded"
            )}
          </IndexTable.Cell>
          <IndexTable.Cell>
          <div style={{ width: 40, height: 40 }}>
          <DropZone onDrop={handleFileUpload}>
            <DropZone.FileUpload />
          </DropZone>
         
        </div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Button variant="primary" onClick={async ()=>{
              updateConfig({file:selectedFile,id:config.id})
              setSelectedFile(null);
              
              }} disabled={!selectedFile}>Save</Button>
            </IndexTable.Cell>
        </IndexTable.Row>
  )
}
