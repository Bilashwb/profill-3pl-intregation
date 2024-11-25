// import React, { useState } from 'react';
// import { FormLayout, Text, TextField, Button } from '@shopify/polaris';

// export default function CornConfig() {
//   // State to store each individual input value
//   const [productStatus, setProductStatus] = useState('');
//   const [variantStatus, setVariantStatus] = useState('');
//   const [ppsInventory, setPpsInventory] = useState('');
//   const [podInventory, setPodInventory] = useState('');
//   const [orderPush, setOrderPush] = useState('');
//   const [orderStatus, setOrderStatus] = useState('');
//   const [shipmentPull, setShipmentPull] = useState('');

//   // State to store error messages
//   const [productStatusError, setProductStatusError] = useState('');
//   const [variantStatusError, setVariantStatusError] = useState('');
//   const [ppsInventoryError, setPpsInventoryError] = useState('');
//   const [podInventoryError, setPodInventoryError] = useState('');
//   const [orderPushError, setOrderPushError] = useState('');
//   const [orderStatusError, setOrderStatusError] = useState('');
//   const [shipmentPullError, setShipmentPullError] = useState('');

//   // Validate if the input is a valid number within the range 2 to 60
//   const validateInput = (value) => {
//     if (value < 2 || value > 60 || isNaN(value)) {
//       return 'Interval must be between 2 and 60 minutes';
//     }
//     return '';
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     // Validate each field and set errors
//     setProductStatusError(validateInput(productStatus));
//     setVariantStatusError(validateInput(variantStatus));
//     setPpsInventoryError(validateInput(ppsInventory));
//     setPodInventoryError(validateInput(podInventory));
//     setOrderPushError(validateInput(orderPush));
//     setOrderStatusError(validateInput(orderStatus));
//     setShipmentPullError(validateInput(shipmentPull));

//     // Check if there are no errors, then save settings
//     if (
//       !productStatusError &&
//       !variantStatusError &&
//       !ppsInventoryError &&
//       !podInventoryError &&
//       !orderPushError &&
//       !orderStatusError &&
//       !shipmentPullError
//     ) {
//       alert('Settings Saved!');
//     }
//   };

//   return (
//     <>
//       <Text alignment="center" fontWeight="bold" variant="headingMd">
//         Please provide your cron schedule.
//       </Text>

 
//       <Text variant="bodyMd" alignment="center" style={{ marginTop: '20px' }}>
//         Please provide the interval for each task in minutes. The interval must be between 2 and 60 minutes for each task.
//       </Text>

//       <div style={{ marginTop: '5%' }}>
//         <FormLayout>
//           <FormLayout.Group condensed>
//             <TextField
//               label="Product Status Check"
//               type="number"
//               value={productStatus}
//               onChange={(e) => setProductStatus(e)}
//               error={productStatusError}
//               autoComplete="off"
//             />

//             <TextField
//               label="Product Variant Status Check"
//               type="number"
//               value={variantStatus}
//               onChange={(e) => setVariantStatus(e)}
//               error={variantStatusError}
//               autoComplete="off"
//             />

//             <TextField
//               label="PPS Product Inventory Pull"
//               type="number"
//               value={ppsInventory}
//               onChange={(e) => setPpsInventory(e)}
//               error={ppsInventoryError}
//               autoComplete="off"
//             />
//           </FormLayout.Group>

//           <FormLayout.Group condensed>
//             <TextField
//               label="POD Product Inventory Pull"
//               type="number"
//               value={podInventory}
//               onChange={(e) => setPodInventory(e)}
//               error={podInventoryError}
//               autoComplete="off"
//             />

//             <TextField
//               label="Order Push"
//               type="number"
//               value={orderPush}
//               onChange={(e) => setOrderPush(e)}
//               error={orderPushError}
//               autoComplete="off"
//             />

//             <TextField
//               label="Order Status"
//               type="number"
//               value={orderStatus}
//               onChange={(e) => setOrderStatus(e)}
//               error={orderStatusError}
//               autoComplete="off"
//             />

//             <TextField
//               label="Order Shipment Pull"
//               type="number"
//               value={shipmentPull}
//               onChange={(e) => setShipmentPull(e)}
//               error={shipmentPullError}
//               autoComplete="off"
//             />
//           </FormLayout.Group>
//           <Button variant="primary" onClick={handleSubmit}>
//             Save Settings
//           </Button>
//         </FormLayout>
//       </div>
//     </>
//   );
// }
import React from 'react'

export default function CornConfig() {
  return (
    <div>Corn Config</div>
  )
}
