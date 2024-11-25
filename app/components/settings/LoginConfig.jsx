import React, { useState } from 'react'
import { FormLayout, Text, TextField, Select, Button, InlineError } from '@shopify/polaris'
import { login } from '../../utils/apis/auth'

export default function LoginConfig({customer,submit}) {
 
  const [customerNumber, setCustomerNumber] = useState(customer?.customer_id)
  const [customerCredential, setCustomerCredential] = useState('')
  const [customerPrefix, setCustomerPrefix] = useState(customer?.prefix)
  const [environment, setEnvironment] = useState(customer?.environment)
  
  // State for error messages
  const [errors, setErrors] = useState({
    customerNumber: '',
    customerCredential: '',
    customerPrefix: '',
    environment: '',
  })

  const handleSubmit = async() => {

    let validationErrors = {
      customerNumber: customerNumber ? '' : 'Customer Number is required',
      customerCredential: customerCredential ? '' : 'Customer Credential is required',
      customerPrefix: customerPrefix ? '' : 'Customer Prefix is required',
      environment: environment ? '' : 'Environment is required',
    }
    if (!validationErrors.customerNumber && !validationErrors.customerCredential && !validationErrors.customerPrefix ) {

      let res= await login(customerNumber,customerCredential);
      console.log(res);
      if (res.success){
        submit({customer_id:customerNumber,credential:customerCredential,prefix:customerPrefix,environment:environment,id:customer.id},{method:"POST"});
        }
        else{
          shopify.toast.show("Invalid Credential ");
        }
      
    }
    else{
      shopify.toast.show("Please Fill All The Details")
    }
  }

  return (
    <>
      <Text alignment="center" fontWeight="bold" variant="headingMd">
        Please provide your Profile Details. These settings apply to all internal functions across this integration.
      </Text>
      
      <div style={{ marginTop: '2%' }}>
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField
              label="Customer Number"
              value={customerNumber}
              type='number'
              onChange={setCustomerNumber}
              autoComplete="off"
              error={errors.customerNumber}
            />
            <TextField
              label="Customer Credential"
              value={customerCredential}
              type='password'
              onChange={setCustomerCredential}
              autoComplete="off"
              error={errors.customerCredential}
            />
          </FormLayout.Group>

          <FormLayout.Group condensed>
            <TextField
              label="Customer Prefix"
              value={customerPrefix}
              onChange={setCustomerPrefix}
              autoComplete="off"
              error={errors.customerPrefix}
            />
            <Select
              label="Environment"
              options={[
                { label: 'Development', value: '1' },
                { label: 'Production', value: '2' },
              ]}
              value={environment}
              onChange={setEnvironment}
              error={errors.environment}
            />
          </FormLayout.Group>

          <Button variant="primary" onClick={handleSubmit}>
            Save Settings
          </Button>
        </FormLayout>
      </div>
    </>
  )
}
