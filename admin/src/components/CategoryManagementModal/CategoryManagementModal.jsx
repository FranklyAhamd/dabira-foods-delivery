import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import api from '../../config/api';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2001;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.15s;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #FF6B35;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  height: 28px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;

  &:hover {
    background-color: #E55A2B;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  transition: all 0.15s;
  height: 22px;
  min-height: 22px;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`;

const CategoryName = styled.span`
  font-size: 11px;
  color: #374151;
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  padding: 2px;
  background-color: transparent;
  color: ${props => props.$edit ? '#2563eb' : '#ef4444'};
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
    background-color: ${props => props.$edit ? 'rgba(37, 99, 235, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EditForm = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 2px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 11px;
  height: 18px;
  transition: all 0.15s;
  min-width: 0;

  &:focus {
    border-color: #FF6B35;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
  }
`;

const SaveButton = styled.button`
  padding: 2px 8px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  height: 18px;
  flex-shrink: 0;

  &:hover {
    background-color: #059669;
  }
`;

const CancelEditButton = styled.button`
  padding: 2px 8px;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  height: 18px;
  flex-shrink: 0;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const AddForm = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 13px;
`;

const CategoryManagementModal = ({ isOpen, onClose, categories, onCategoriesChange }) => {
  const { success, error } = useToast();
  const [localCategories, setLocalCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, category: null });

  useEffect(() => {
    if (isOpen) {
      setLocalCategories([...categories]);
      setEditingCategory(null);
      setEditValue('');
      setShowAddForm(false);
      setNewCategory('');
    }
  }, [isOpen, categories]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setEditValue(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      error('Category name cannot be empty');
      return;
    }

    if (editValue.trim() === editingCategory) {
      handleCancelEdit();
      return;
    }

    // Check if new name already exists
    if (localCategories.some(cat => cat.toLowerCase() === editValue.trim().toLowerCase() && cat !== editingCategory)) {
      error('Category with this name already exists');
      return;
    }

    try {
      // Update all menu items with the old category to the new category
      const response = await api.put('/menu/update-category', {
        oldCategory: editingCategory,
        newCategory: editValue.trim()
      });

      if (response.success) {
        success('Category updated successfully');
        const updated = localCategories.map(cat => 
          cat === editingCategory ? editValue.trim() : cat
        );
        setLocalCategories(updated);
        onCategoriesChange(updated);
        handleCancelEdit();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error updating category');
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm({ isOpen: true, category });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.category) return;

    try {
      // Check if category is in use
      const menuResponse = await api.get('/menu');
      if (menuResponse.success) {
        const itemsUsingCategory = menuResponse.data.menuItems.filter(
          item => item.category === deleteConfirm.category
        );

        if (itemsUsingCategory.length > 0) {
          error(`Cannot delete category. ${itemsUsingCategory.length} menu item(s) are using this category.`);
          setDeleteConfirm({ isOpen: false, category: null });
          return;
        }
      }

      // If no items use it, just remove from local list
      const updated = localCategories.filter(cat => cat !== deleteConfirm.category);
      setLocalCategories(updated);
      onCategoriesChange(updated);
      success('Category removed successfully');
      setDeleteConfirm({ isOpen: false, category: null });
    } catch (err) {
      error(err.response?.data?.message || 'Error deleting category');
      setDeleteConfirm({ isOpen: false, category: null });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      error('Category name cannot be empty');
      return;
    }

    if (localCategories.some(cat => cat.toLowerCase() === newCategory.trim().toLowerCase())) {
      error('Category with this name already exists');
      return;
    }

    const updated = [...localCategories, newCategory.trim()].sort();
    setLocalCategories(updated);
    onCategoriesChange(updated);
    setNewCategory('');
    setShowAddForm(false);
    success('Category added successfully');
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Manage Categories</ModalTitle>
            <CloseButton onClick={onClose} aria-label="Close">
              <FiX size={18} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            {!showAddForm ? (
              <AddButton onClick={() => setShowAddForm(true)}>
                <FiPlus /> Add New Category
              </AddButton>
            ) : (
              <AddForm>
                <EditInput
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddCategory();
                    if (e.key === 'Escape') {
                      setShowAddForm(false);
                      setNewCategory('');
                    }
                  }}
                  autoFocus
                />
                <SaveButton onClick={handleAddCategory}>Add</SaveButton>
                <CancelEditButton onClick={() => {
                  setShowAddForm(false);
                  setNewCategory('');
                }}>Cancel</CancelEditButton>
              </AddForm>
            )}

            {localCategories.length === 0 ? (
              <EmptyMessage>No categories yet. Add your first category!</EmptyMessage>
            ) : (
              <CategoryList>
                {localCategories.map((category) => (
                  <CategoryItem key={category}>
                    {editingCategory === category ? (
                      <EditForm>
                        <EditInput
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <SaveButton onClick={handleSaveEdit}>Save</SaveButton>
                        <CancelEditButton onClick={handleCancelEdit}>Cancel</CancelEditButton>
                      </EditForm>
                    ) : (
                      <>
                        <CategoryName>{category}</CategoryName>
                        <CategoryActions>
                          <ActionButton $edit onClick={() => handleEdit(category)}>
                            <FiEdit />
                          </ActionButton>
                          <ActionButton onClick={() => handleDeleteClick(category)}>
                            <FiTrash2 />
                          </ActionButton>
                        </CategoryActions>
                      </>
                    )}
                  </CategoryItem>
                ))}
              </CategoryList>
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, category: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={deleteConfirm.category ? `Are you sure you want to delete "${deleteConfirm.category}"? This will only work if no menu items are using this category.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default CategoryManagementModal;

