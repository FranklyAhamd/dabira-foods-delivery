import React, { useState, useEffect, useCallback } from 'react';
import api from '../../config/api';
import {
  Container,
  PageTitle,
  Form,
  Section,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  SaveButton,
  CancelButton,
  SuccessMessage,
  ErrorMessage,
  LoadingContainer,
  LoadingSpinner,
  StatusBadge
} from './SettingsStyles';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    restaurantEmail: '',
    paystackPublicKey: '',
    paystackSecretKey: '',
    deliveryFee: '',
    minimumOrder: '',
    openingTime: '',
    closingTime: ''
  });
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('Delivery is closed for today. Please check back during operating hours.');

  const fetchSettings = useCallback(async () => {
    try {
      const response = await api.get('/settings');
      if (response.success) {
        const settings = response.data.settings;
        setFormData({
          restaurantName: settings.restaurantName || '',
          restaurantAddress: settings.restaurantAddress || '',
          restaurantPhone: settings.restaurantPhone || '',
          restaurantEmail: settings.restaurantEmail || '',
          paystackPublicKey: settings.paystackPublicKey || '',
          paystackSecretKey: settings.paystackSecretKey || '',
          deliveryFee: settings.deliveryFee || '',
          minimumOrder: settings.minimumOrder || '',
          openingTime: settings.openingTime || '',
          closingTime: settings.closingTime || ''
        });
        setIsDeliveryOpen(settings.isDeliveryOpen !== false);
        setClosedMessage(settings.closedMessage || closedMessage);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading settings' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggleDelivery = async (open) => {
    setMessage({ type: '', text: '' });
    try {
      const response = await api.post('/settings/delivery', { open, message: closedMessage });
      if (response.success) {
        setIsDeliveryOpen(response.data.settings.isDeliveryOpen);
        setMessage({ type: 'success', text: `Delivery ${open ? 'opened' : 'closed'} successfully` });
        setTimeout(() => setMessage({ type: '', text: '' }), 2500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating delivery status' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);

    try {
      // Include closedMessage in the settings update
      const response = await api.put('/settings', {
        ...formData,
        closedMessage: closedMessage
      });
      if (response.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchSettings();
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>Settings</PageTitle>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Restaurant Information</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>Restaurant Name</Label>
              <Input
                type="text"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={formData.restaurantPhone}
                onChange={(e) => setFormData({ ...formData, restaurantPhone: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.restaurantEmail}
                onChange={(e) => setFormData({ ...formData, restaurantEmail: e.target.value })}
              />
            </FormGroup>
          </FormGrid>
          <FormGroup>
            <Label>Address</Label>
            <TextArea
              value={formData.restaurantAddress}
              onChange={(e) => setFormData({ ...formData, restaurantAddress: e.target.value })}
              rows={2}
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Paystack Configuration</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>Paystack Public Key</Label>
              <Input
                type="text"
                value={formData.paystackPublicKey}
                onChange={(e) => setFormData({ ...formData, paystackPublicKey: e.target.value })}
                placeholder="pk_test_..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Paystack Secret Key</Label>
              <Input
                type="password"
                value={formData.paystackSecretKey}
                onChange={(e) => setFormData({ ...formData, paystackSecretKey: e.target.value })}
                placeholder="sk_test_..."
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Delivery Settings</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>Delivery Fee (₦)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Minimum Order (₦)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Operating Hours</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>Opening Time</Label>
              <Input
                type="time"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Closing Time</Label>
              <Input
                type="time"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Delivery Control</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>Status</Label>
              <div style={{ display: 'flex', alignItems: 'center', height: '22px' }}>
                <StatusBadge $isOpen={isDeliveryOpen}>
                  {isDeliveryOpen ? 'Open' : 'Closed'}
                </StatusBadge>
              </div>
            </FormGroup>
          </FormGrid>
          <FormGroup>
            <Label>Closed Message</Label>
            <TextArea
              rows={2}
              value={closedMessage}
              onChange={(e) => setClosedMessage(e.target.value)}
              placeholder="Message shown to customers when delivery is closed"
            />
          </FormGroup>
          <ButtonGroup>
            <SaveButton type="button" onClick={() => handleToggleDelivery(true)}>
              Open Delivery
            </SaveButton>
            <CancelButton type="button" onClick={() => handleToggleDelivery(false)}>
              Close Delivery
            </CancelButton>
          </ButtonGroup>
        </Section>

        {message.text && (
          message.type === 'success' ? (
            <SuccessMessage>{message.text}</SuccessMessage>
          ) : (
            <ErrorMessage>{message.text}</ErrorMessage>
          )
        )}

        <ButtonGroup>
          <CancelButton type="button" onClick={handleReset} disabled={saving}>
            Reset
          </CancelButton>
          <SaveButton type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </SaveButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default Settings;











