import { useState } from 'react';
import { Card, FormLayout, Text, Button, TextField, InlineGrid } from '@shopify/polaris';
import React from 'react';
import { login } from '../../utils/apis/auth';

export default function LoginForm({ addCustomer }) {
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [prefix, setPrefix] = useState('');
  const [error, setError] = useState('');
  const [showPrefix, setShowPrefix] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false); 

  const handleLogin = async () => {
    if (customerId && password) {
      setLoading(true); 
      let response = await login(customerId,password)
      setLoading(false); 
      if (response.success) {
        setShowPrefix(true);
        setError('');
      } else {
        setError('Invalid credentials.');
        setShowPrefix(false);
      }
    } else {
      setIsValid(false);
    }
  };

  const handleSubmit = () => {
    if (!prefix) {
      setError('Prefix is required.');
      return;
    }

    const data = {
      customer_id: customerId,
      credential: password,
      prefix: prefix,
      shop: shopify.config.shop,
    };

    setLoading(true); 
    addCustomer({ ...data, type: 'newcustomer' }, { method: 'post' })
      .finally(() => setLoading(false));
  };

  return (
    <Card>
      <InlineGrid columns={2} gap={'400'}>
        <FormLayout>
          <Text alignment="center" fontWeight="bold" variant="headingMd">
          </Text>

          <TextField
            name="customer_id"
            label="Customer Number"
            value={customerId}
            type="number"
            onChange={(value) => {
              setCustomerId(value);
              setError(''); // Clear error when input changes
            }}
            error={!isValid && !customerId && 'Customer Number is required'}
            requiredIndicator
          />

          <TextField
            name="credential"
            label="Customer Password"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setError(''); // Clear error when input changes
            }}
            error={!isValid && !password && 'Customer Password is required'}
            requiredIndicator
          />

          {showPrefix && (
            <TextField
              name="prefix"
              label="Prefix"
              value={prefix}
              onChange={(value) => {
                setPrefix(value);
                setError(''); // Clear error when input changes
              }}
              requiredIndicator
            />
          )}

          {error && (
            <div style={{ marginTop: '2%' }}>
              <Text fontWeight="bold" tone="critical">
                {error}
              </Text>
            </div>
          )}

          {!showPrefix ? (
            <Button
              variant="primary"
              onClick={handleLogin}
              loading={loading} // show spinner when loading is true
            >
              Login
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading} // show spinner when loading is true
            >
              Submit
            </Button>
          )}
        </FormLayout>

        <div style={{ textAlign: 'center', alignContent: 'center' }}>
          <Card>
            <Text variant="headingXl">Don't have an account?</Text>
            <div style={{ marginTop: '1%' }}>
              <Text variant="bodyMd">Request for a Profill Customer Account</Text>
            </div>
            <div style={{ paddingTop: '2%' }}>
              <Button
                variant="plain"
                url="https://portaltest.profillholdings.com/index.php?r=appIntegrationCustomerRequest/create&integration=shopify"
                target="_blank"
              >
                Create Account
              </Button>
            </div>
          </Card>
        </div>
      </InlineGrid>
    </Card>
  );
}
