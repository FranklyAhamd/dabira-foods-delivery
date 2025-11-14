import React, { useState, useEffect, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSettings, FiSearch } from 'react-icons/fi';
import api from '../../config/api';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import CategoryManagementModal from '../../components/CategoryManagementModal/CategoryManagementModal';
import {
  Container,
  Table,
  TableHeader,
  TableRow,
  TableCell,
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
  Select,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  EmptyMessage,
  LoadingContainer,
  LoadingSpinner,
  AvailableBadge,
  FloatingAddButton,
  CategoryManageButton,
  SearchBar,
  SearchInput,
  FilterContainer,
  FilterSelect
} from './MenuManagementStyles';

const MenuManagement = () => {
  const { success, error } = useToast();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    available: true,
    maxPortionsPerTakeaway: ''
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      if (response.success) {
        setMenuItems(response.data.menuItems);
      }
    } catch (err) {
      error('Error fetching menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/menu/categories');
      if (response.success) {
        // Categories are now objects with { name, isTakeaway }
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Check if selected category is a takeaway category
  const isSelectedCategoryTakeaway = () => {
    if (!formData.category) return false;
    const selectedCat = categories.find(cat => {
      const catName = typeof cat === 'string' ? cat : cat.name;
      return catName === formData.category;
    });
    return selectedCat && typeof selectedCat === 'object' && selectedCat.isTakeaway;
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image || '',
        available: item.available,
        maxPortionsPerTakeaway: item.maxPortionsPerTakeaway || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        image: '',
        available: true,
        maxPortionsPerTakeaway: ''
      });
    }
    setShowModal(true);
    // Refresh categories when opening modal to get latest categories
    fetchCategories();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate maxPortionsPerTakeaway for takeaway categories
    if (isSelectedCategoryTakeaway() && !formData.maxPortionsPerTakeaway) {
      error('Maximum portions per takeaway is required for takeaway categories');
      return;
    }

    try {
      const submitData = {
        ...formData,
        maxPortionsPerTakeaway: isSelectedCategoryTakeaway() && formData.maxPortionsPerTakeaway 
          ? parseInt(formData.maxPortionsPerTakeaway) 
          : null
      };

      if (editingItem) {
        const response = await api.put(`/menu/${editingItem.id}`, submitData);
        if (response.success) {
          success('Menu item updated successfully');
          fetchMenuItems();
          handleCloseModal();
        }
      } else {
        const response = await api.post('/menu', submitData);
        if (response.success) {
          success('Menu item created successfully');
          fetchMenuItems();
          handleCloseModal();
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error saving menu item');
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteConfirm({ isOpen: true, item: { id, name } });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.item) return;
    
    try {
      const response = await api.delete(`/menu/${deleteConfirm.item.id}`);
      if (response.success) {
        success('Menu item deleted successfully');
        fetchMenuItems();
      }
    } catch (err) {
      error('Error deleting menu item');
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const response = await api.put(`/menu/${item.id}`, {
        available: !item.available
      });
      if (response.success) {
        fetchMenuItems();
      }
    } catch (err) {
      error('Error updating availability');
    }
  };

  // Filter menu items based on search and category
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    const cats = [...new Set(menuItems.map(item => item.category))].sort();
    return cats;
  }, [menuItems]);

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
      <FilterContainer>
        <SearchBar>
          <FiSearch size={16} />
          <SearchInput
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        <FilterSelect
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </FilterSelect>
      </FilterContainer>

      {filteredMenuItems.length > 0 ? (
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
            {filteredMenuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>₦{item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <AvailableBadge 
                    as="button"
                    $available={item.available}
                    onClick={() => handleToggleAvailability(item)}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </AvailableBadge>
                </TableCell>
                <TableCell>
                  <ActionButton onClick={() => handleOpenModal(item)} $edit>
                    <FiEdit />
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteClick(item.id, item.name)}>
                    <FiTrash2 />
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      ) : menuItems.length === 0 ? (
        <EmptyMessage>No menu items yet. Add your first item!</EmptyMessage>
      ) : (
        <EmptyMessage>No menu items found matching your search criteria.</EmptyMessage>
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
                <Label>Category *</Label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {categories.length > 0 ? (
                    <Select
                      value={formData.category}
                      onChange={(e) => {
                        const newCategory = e.target.value;
                        // Check if new category is takeaway
                        const selectedCat = categories.find(cat => {
                          const catName = typeof cat === 'string' ? cat : cat.name;
                          return catName === newCategory;
                        });
                        const isTakeaway = selectedCat && typeof selectedCat === 'object' && selectedCat.isTakeaway;
                        
                        setFormData({ 
                          ...formData, 
                          category: newCategory,
                          // Clear maxPortionsPerTakeaway if category is not takeaway
                          maxPortionsPerTakeaway: isTakeaway ? formData.maxPortionsPerTakeaway : ''
                        });
                      }}
                      required
                      style={{ flex: 1 }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => {
                        const catName = typeof category === 'string' ? category : category.name;
                        const isTakeaway = typeof category === 'object' && category.isTakeaway;
                        return (
                          <option key={catName} value={catName}>
                            {catName}{isTakeaway ? ' (Takeaway)' : ''}
                          </option>
                        );
                      })}
                    </Select>
                  ) : (
                    <Input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Enter category (e.g., Burgers, Pizza, Drinks)"
                      required
                      style={{ flex: 1 }}
                    />
                  )}
                  <CategoryManageButton
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    title="Manage Categories"
                  >
                    <FiSettings size={16} />
                  </CategoryManageButton>
                </div>
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

              {isSelectedCategoryTakeaway() && (
                <FormGroup>
                  <Label>Maximum Portions Per Takeaway *</Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.maxPortionsPerTakeaway}
                    onChange={(e) => setFormData({ ...formData, maxPortionsPerTakeaway: e.target.value })}
                    placeholder="e.g., 3"
                    required
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Maximum number of portions that can fit in one takeaway plate
                  </div>
                </FormGroup>
              )}

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

      <FloatingAddButton onClick={() => handleOpenModal()}>
        <FiPlus size={24} />
      </FloatingAddButton>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Menu Item"
        message={deleteConfirm.item ? `Are you sure you want to delete "${deleteConfirm.item.name}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <CategoryManagementModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        onCategoriesChange={(updatedCategories) => {
          setCategories(updatedCategories);
          // If the selected category was renamed or deleted, handle it
          if (formData.category) {
            const categoryExists = updatedCategories.some(cat => {
              const catName = typeof cat === 'string' ? cat : cat.name;
              return catName === formData.category;
            });
            if (!categoryExists) {
              // Category was deleted, clear selection and maxPortionsPerTakeaway
              setFormData({ ...formData, category: '', maxPortionsPerTakeaway: '' });
            }
          }
        }}
      />
    </Container>
  );
};

export default MenuManagement;


