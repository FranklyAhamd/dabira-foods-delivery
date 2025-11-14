import React, { useState, useEffect, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSearch } from 'react-icons/fi';
import api from '../../config/api';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import {
  Container,
  PageTitle,
  GridContainer,
  LocationCard,
  CardHeader,
  CardTitle,
  CardContent,
  CardRow,
  CardLabel,
  CardValue,
  ActionButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  EmptyMessage,
  LoadingContainer,
  LoadingSpinner,
  StatusBadge,
  FloatingAddButton,
  CardActions,
  SearchBar,
  SearchInput
} from './DeliveryLocationsStyles';

const DeliveryLocations = () => {
  const { success, error } = useToast();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, location: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    isActive: true
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/delivery-locations');
      if (response.success) {
        setLocations(response.data.locations);
      }
    } catch (err) {
      error('Error fetching delivery locations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (location = null) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        price: location.price.toString(),
        isActive: location.isActive
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: '',
        price: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLocation(null);
    setFormData({
      name: '',
      price: '',
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      error('Location name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      error('Valid delivery price is required');
      return;
    }

    try {
      if (editingLocation) {
        const response = await api.put(`/delivery-locations/${editingLocation.id}`, {
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          isActive: formData.isActive
        });
        if (response.success) {
          success('Delivery location updated successfully');
          fetchLocations();
          handleCloseModal();
        }
      } else {
        const response = await api.post('/delivery-locations', {
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          isActive: formData.isActive
        });
        if (response.success) {
          success('Delivery location created successfully');
          fetchLocations();
          handleCloseModal();
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error saving delivery location');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.location) return;

    try {
      const response = await api.delete(`/delivery-locations/${deleteConfirm.location.id}`);
      if (response.success) {
        success('Delivery location deleted successfully');
        fetchLocations();
        setDeleteConfirm({ isOpen: false, location: null });
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error deleting delivery location');
      setDeleteConfirm({ isOpen: false, location: null });
    }
  };

  const toggleActive = async (location) => {
    try {
      const response = await api.put(`/delivery-locations/${location.id}`, {
        isActive: !location.isActive
      });
      if (response.success) {
        success(`Location ${!location.isActive ? 'activated' : 'deactivated'} successfully`);
        fetchLocations();
      }
    } catch (err) {
      error('Error updating location status');
    }
  };

  // Filter locations based on search
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    
    const query = searchQuery.toLowerCase();
    return locations.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.price.toString().includes(query)
    );
  }, [locations, searchQuery]);

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
      <PageTitle>Delivery Locations</PageTitle>

      <SearchBar>
        <FiSearch size={16} />
        <SearchInput
          type="text"
          placeholder="Search by name or price..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      {filteredLocations.length === 0 ? (
        <EmptyMessage>
          {locations.length === 0 
            ? 'No delivery locations found. Click the + button to add one.'
            : 'No delivery locations found matching your search criteria.'}
        </EmptyMessage>
      ) : (
        <GridContainer>
          {filteredLocations.map((location) => (
            <LocationCard key={location.id}>
              <CardHeader>
                <CardTitle>{location.name}</CardTitle>
                <StatusBadge
                  $active={location.isActive}
                  onClick={() => toggleActive(location)}
                  title={`Click to ${location.isActive ? 'deactivate' : 'activate'}`}
                >
                  {location.isActive ? 'Active' : 'Inactive'}
                </StatusBadge>
              </CardHeader>
              <CardContent>
                <CardRow>
                  <CardLabel>Delivery Fee:</CardLabel>
                  <CardValue>₦{parseFloat(location.price).toFixed(2)}</CardValue>
                </CardRow>
              </CardContent>
              <CardActions>
                <ActionButton
                  $edit
                  onClick={() => handleOpenModal(location)}
                  title="Edit"
                >
                  <FiEdit />
                </ActionButton>
                <ActionButton
                  onClick={() => setDeleteConfirm({ isOpen: true, location })}
                  title="Delete"
                >
                  <FiTrash2 />
                </ActionButton>
              </CardActions>
            </LocationCard>
          ))}
        </GridContainer>
      )}

      <FloatingAddButton onClick={() => handleOpenModal()} title="Add Location">
        <FiPlus />
      </FloatingAddButton>

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingLocation ? 'Edit Delivery Location' : 'Add Delivery Location'}
              </ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Location Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., VMH"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Delivery Fee (₦) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ marginRight: '8px' }}
                  />
                  Active (visible to customers)
                </Label>
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingLocation ? 'Update' : 'Create'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, location: null })}
        onConfirm={handleDelete}
        title="Delete Delivery Location"
        message={`Are you sure you want to delete "${deleteConfirm.location?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Container>
  );
};

export default DeliveryLocations;

