import React, { useState, useEffect, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSearch, FiMapPin } from 'react-icons/fi';
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
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [areaFormData, setAreaFormData] = useState({ name: '', price: '', isActive: true });
  const [editingArea, setEditingArea] = useState(null);
  const [deleteAreaConfirm, setDeleteAreaConfirm] = useState({ isOpen: false, area: null });
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

  const handleOpenAreaModal = async (location) => {
    setSelectedLocation(location);
    setShowAreaModal(true);
    await fetchAreas(location.id);
  };

  const handleCloseAreaModal = () => {
    setShowAreaModal(false);
    setSelectedLocation(null);
    setAreas([]);
    setAreaFormData({ name: '', price: '', isActive: true });
    setEditingArea(null);
  };

  const fetchAreas = async (locationId) => {
    try {
      setLoadingAreas(true);
      const response = await api.get(`/delivery-areas/location/${locationId}`);
      if (response.success) {
        setAreas(response.data.areas);
      }
    } catch (err) {
      error('Error fetching areas');
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!areaFormData.name.trim()) {
      error('Area name is required');
      return false;
    }

    if (!areaFormData.price || parseFloat(areaFormData.price) < 0) {
      error('Valid delivery price is required');
      return false;
    }

    try {
      if (editingArea) {
        const response = await api.put(`/delivery-areas/${editingArea.id}`, {
          name: areaFormData.name.trim(),
          price: parseFloat(areaFormData.price),
          isActive: areaFormData.isActive
        });
        if (response.success) {
          success('Area updated successfully');
          await fetchAreas(selectedLocation.id);
          // Only update locations list, don't reload the page
          const locationsResponse = await api.get('/delivery-locations');
          if (locationsResponse.success) {
            setLocations(locationsResponse.data.locations);
          }
          setAreaFormData({ name: '', price: '', isActive: true });
          setEditingArea(null);
        }
      } else {
        const response = await api.post('/delivery-areas', {
          name: areaFormData.name.trim(),
          price: parseFloat(areaFormData.price),
          deliveryLocationId: selectedLocation.id,
          isActive: areaFormData.isActive
        });
        if (response.success) {
          success('Area created successfully');
          await fetchAreas(selectedLocation.id);
          // Only update locations list, don't reload the page
          const locationsResponse = await api.get('/delivery-locations');
          if (locationsResponse.success) {
            setLocations(locationsResponse.data.locations);
          }
          setAreaFormData({ name: '', price: '', isActive: true });
        }
      }
      return false;
    } catch (err) {
      error(err.response?.data?.message || 'Error saving area');
      return false;
    }
  };

  const handleEditArea = (area) => {
    setEditingArea(area);
    setAreaFormData({
      name: area.name,
      price: area.price.toString(),
      isActive: area.isActive
    });
  };

  const handleDeleteArea = async () => {
    if (!deleteAreaConfirm.area) return;

    try {
      const response = await api.delete(`/delivery-areas/${deleteAreaConfirm.area.id}`);
      if (response.success) {
        success('Area deleted successfully');
        await fetchAreas(selectedLocation.id);
        // Only update locations list, don't reload the page
        const locationsResponse = await api.get('/delivery-locations');
        if (locationsResponse.success) {
          setLocations(locationsResponse.data.locations);
        }
        setDeleteAreaConfirm({ isOpen: false, area: null });
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error deleting area');
      setDeleteAreaConfirm({ isOpen: false, area: null });
    }
  };

  const toggleAreaActive = async (area) => {
    try {
      const response = await api.put(`/delivery-areas/${area.id}`, {
        isActive: !area.isActive
      });
      if (response.success) {
        success(`Area ${!area.isActive ? 'activated' : 'deactivated'} successfully`);
        await fetchAreas(selectedLocation.id);
        // Only update locations list, don't reload the page
        const locationsResponse = await api.get('/delivery-locations');
        if (locationsResponse.success) {
          setLocations(locationsResponse.data.locations);
        }
      }
    } catch (err) {
      error('Error updating area status');
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
                <CardRow style={{ marginTop: '4px' }}>
                  <CardLabel>Areas:</CardLabel>
                  <CardValue>{location.areas?.length || 0}</CardValue>
                </CardRow>
              </CardContent>
              <CardActions>
                <ActionButton
                  onClick={() => handleOpenAreaModal(location)}
                  title="Manage Areas"
                  style={{ color: '#667eea' }}
                >
                  <FiMapPin />
                </ActionButton>
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

      {/* Area Management Modal */}
      {showAreaModal && selectedLocation && (
        <ModalOverlay onClick={handleCloseAreaModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <ModalHeader>
              <ModalTitle>Manage Areas - {selectedLocation.name}</ModalTitle>
              <CloseButton onClick={handleCloseAreaModal}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleAreaSubmit} style={{ padding: '16px' }} noValidate>
              <FormGroup>
                <Label>Area Name *</Label>
                <Input
                  type="text"
                  value={areaFormData.name}
                  onChange={(e) => setAreaFormData({ ...areaFormData, name: e.target.value })}
                  placeholder="e.g., Block A, Zone 1, etc."
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Delivery Fee (₦) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={areaFormData.price}
                  onChange={(e) => setAreaFormData({ ...areaFormData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={areaFormData.isActive}
                    onChange={(e) => setAreaFormData({ ...areaFormData, isActive: e.target.checked })}
                    style={{ marginRight: '8px' }}
                  />
                  Active (visible to customers)
                </Label>
              </FormGroup>

              <ButtonGroup>
                {editingArea && (
                  <CancelButton 
                    type="button" 
                    onClick={() => {
                      setEditingArea(null);
                      setAreaFormData({ name: '', isActive: true });
                    }}
                  >
                    Cancel Edit
                  </CancelButton>
                )}
                <SubmitButton type="submit">
                  {editingArea ? 'Update Area' : 'Add Area'}
                </SubmitButton>
              </ButtonGroup>
            </Form>

            <div style={{ padding: '0 16px 16px', maxHeight: '400px', overflowY: 'auto' }}>
              <Label style={{ marginBottom: '8px', display: 'block' }}>Areas ({areas.length})</Label>
              {loadingAreas ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <LoadingSpinner />
                </div>
              ) : areas.length === 0 ? (
                <EmptyMessage style={{ margin: 0, padding: '16px' }}>
                  No areas yet. Add your first area above.
                </EmptyMessage>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '8px' 
                }}>
                  {areas.map((area) => (
                    <div
                      key={area.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '8px',
                        background: '#f9fafb',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 500, 
                          color: '#374151',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {area.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                          <span style={{ fontSize: '10px', color: '#667eea', fontWeight: 600 }}>
                            ₦{parseFloat(area.price).toFixed(2)}
                          </span>
                          <StatusBadge
                            $active={area.isActive}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleAreaActive(area);
                            }}
                            title={`Click to ${area.isActive ? 'deactivate' : 'activate'}`}
                            style={{ fontSize: '8px', padding: '2px 6px', flexShrink: 0 }}
                          >
                            {area.isActive ? 'Active' : 'Inactive'}
                          </StatusBadge>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <ActionButton
                          type="button"
                          $edit
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditArea(area);
                          }}
                          title="Edit"
                          style={{ width: '24px', height: '24px' }}
                        >
                          <FiEdit size={14} />
                        </ActionButton>
                        <ActionButton
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteAreaConfirm({ isOpen: true, area });
                          }}
                          title="Delete"
                          style={{ width: '24px', height: '24px' }}
                        >
                          <FiTrash2 size={14} />
                        </ActionButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      <ConfirmModal
        isOpen={deleteAreaConfirm.isOpen}
        onClose={() => setDeleteAreaConfirm({ isOpen: false, area: null })}
        onConfirm={handleDeleteArea}
        title="Delete Delivery Area"
        message={`Are you sure you want to delete "${deleteAreaConfirm.area?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Container>
  );
};

export default DeliveryLocations;

