import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import {
  Container,
  PageTitle,
  Header,
  AddButton,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ActionButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  EmptyMessage,
  LoadingContainer,
  LoadingSpinner,
  AvailableBadge
} from './MenuManagementStyles';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      if (response.success) {
        setMenuItems(response.data.menuItems);
      }
    } catch (error) {
      alert('Error fetching menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image || '',
        available: item.available
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        available: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        const response = await api.put(`/menu/${editingItem.id}`, formData);
        if (response.success) {
          alert('Menu item updated successfully');
          fetchMenuItems();
          handleCloseModal();
        }
      } else {
        const response = await api.post('/menu', formData);
        if (response.success) {
          alert('Menu item created successfully');
          fetchMenuItems();
          handleCloseModal();
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving menu item');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await api.delete(`/menu/${id}`);
        if (response.success) {
          alert('Menu item deleted successfully');
          fetchMenuItems();
        }
      } catch (error) {
        alert('Error deleting menu item');
      }
    }
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
      <Header>
        <PageTitle>Menu Management</PageTitle>
        <AddButton onClick={() => handleOpenModal()}>+ Add New Item</AddButton>
      </Header>

      {menuItems.length > 0 ? (
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Available</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>₦{item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <AvailableBadge $available={item.available}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </AvailableBadge>
                </TableCell>
                <TableCell>
                  <ActionButton onClick={() => handleOpenModal(item)} $edit>
                    Edit
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(item.id, item.name)}>
                    Delete
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyMessage>No menu items yet. Add your first item!</EmptyMessage>
      )}

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description *</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Category *</Label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Burgers, Pizza, Drinks"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Price (₦) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Image URL</Label>
                <Input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>

              <FormGroup>
                <Label>Available</Label>
                <Select
                  value={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default MenuManagement;


