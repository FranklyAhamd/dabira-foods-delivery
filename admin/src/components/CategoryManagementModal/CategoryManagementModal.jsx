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
  width: 100%;
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 4px 0;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #FF6B35;
`;

const CheckboxLabel = styled.label`
  font-size: 11px;
  color: #374151;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
`;

const CategoryManagementModal = ({ isOpen, onClose, categories, onCategoriesChange }) => {
  const { success, error } = useToast();
  const [localCategories, setLocalCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editIsTakeaway, setEditIsTakeaway] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newIsTakeaway, setNewIsTakeaway] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, category: null });

  useEffect(() => {
    if (isOpen) {
      // Normalize categories - handle both string and object formats
      const normalized = categories.map(cat => 
        typeof cat === 'string' ? { name: cat, isTakeaway: false } : cat
      );
      setLocalCategories(normalized);
      setEditingCategory(null);
      setEditValue('');
      setEditIsTakeaway(false);
      setShowAddForm(false);
      setNewCategory('');
      setNewIsTakeaway(false);
    }
  }, [isOpen, categories]);

  const handleEdit = (category) => {
    const catObj = typeof category === 'string' ? { name: category, isTakeaway: false } : category;
    setEditingCategory(catObj.name);
    setEditValue(catObj.name);
    setEditIsTakeaway(catObj.isTakeaway || false);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
    setEditIsTakeaway(false);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      error('Category name cannot be empty');
      return;
    }

    const categoryName = typeof editingCategory === 'string' ? editingCategory : editingCategory.name;
    const isNameChanged = editValue.trim() !== categoryName;

    // Check if new name already exists (only if name changed)
    if (isNameChanged && localCategories.some(cat => {
      const catName = typeof cat === 'string' ? cat : cat.name;
      return catName.toLowerCase() === editValue.trim().toLowerCase() && catName !== categoryName;
    })) {
      error('Category with this name already exists');
      return;
    }

    try {
      // Update category - if name changed, update menu items too
      const response = await api.put('/menu/update-category', {
        oldCategory: categoryName,
        newCategory: editValue.trim(),
        isTakeaway: editIsTakeaway
      });

      if (response.success) {
        // Also save/update the category in Category model
        await api.post('/menu/category', {
          name: editValue.trim(),
          isTakeaway: editIsTakeaway
        });

        success('Category updated successfully');
        const updated = localCategories.map(cat => {
          const catName = typeof cat === 'string' ? cat : cat.name;
          if (catName === categoryName) {
            return { name: editValue.trim(), isTakeaway: editIsTakeaway };
          }
          return typeof cat === 'string' ? { name: cat, isTakeaway: false } : cat;
        });
        setLocalCategories(updated);
        onCategoriesChange(updated);
        handleCancelEdit();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error updating category');
    }
  };

  const handleDeleteClick = (category) => {
    const catName = typeof category === 'string' ? category : category.name;
    setDeleteConfirm({ isOpen: true, category: catName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.category) return;

    try {
      // Delete from backend
      const response = await api.delete('/menu/category', {
        data: { name: deleteConfirm.category }
      });

      if (response.success) {
        // Remove from local list
        const updated = localCategories.filter(cat => {
          const catName = typeof cat === 'string' ? cat : cat.name;
          return catName !== deleteConfirm.category;
        });
        setLocalCategories(updated);
        onCategoriesChange(updated);
        success('Category removed successfully');
        setDeleteConfirm({ isOpen: false, category: null });
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error deleting category');
      setDeleteConfirm({ isOpen: false, category: null });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      error('Category name cannot be empty');
      return;
    }

    if (localCategories.some(cat => {
      const catName = typeof cat === 'string' ? cat : cat.name;
      return catName.toLowerCase() === newCategory.trim().toLowerCase();
    })) {
      error('Category with this name already exists');
      return;
    }

    try {
      // Save category to backend
      await api.post('/menu/category', {
        name: newCategory.trim(),
        isTakeaway: newIsTakeaway
      });

      const newCat = { name: newCategory.trim(), isTakeaway: newIsTakeaway };
      const updated = [...localCategories, newCat].sort((a, b) => {
        const aName = typeof a === 'string' ? a : a.name;
        const bName = typeof b === 'string' ? b : b.name;
        return aName.localeCompare(bName);
      });
      setLocalCategories(updated);
      onCategoriesChange(updated);
      setNewCategory('');
      setNewIsTakeaway(false);
      setShowAddForm(false);
      success('Category added successfully');
    } catch (err) {
      error(err.response?.data?.message || 'Error adding category');
    }
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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                        setNewIsTakeaway(false);
                      }
                    }}
                    autoFocus
                  />
                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      id="new-takeaway"
                      checked={newIsTakeaway}
                      onChange={(e) => setNewIsTakeaway(e.target.checked)}
                    />
                    <CheckboxLabel htmlFor="new-takeaway">
                      This is a takeaway category
                    </CheckboxLabel>
                  </CheckboxContainer>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
                  <SaveButton onClick={handleAddCategory}>Add</SaveButton>
                  <CancelEditButton onClick={() => {
                    setShowAddForm(false);
                    setNewCategory('');
                    setNewIsTakeaway(false);
                  }}>Cancel</CancelEditButton>
                </div>
              </AddForm>
            )}

            {localCategories.length === 0 ? (
              <EmptyMessage>No categories yet. Add your first category!</EmptyMessage>
            ) : (
              <CategoryList>
                {localCategories.map((category) => {
                  const categoryName = typeof category === 'string' ? category : category.name;
                  return (
                  <CategoryItem key={categoryName}>
                    {editingCategory === (typeof category === 'string' ? category : category.name) ? (
                      <EditForm style={{ flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                          <EditInput
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                            style={{ flex: 1 }}
                          />
                          <SaveButton onClick={handleSaveEdit}>Save</SaveButton>
                          <CancelEditButton onClick={handleCancelEdit}>Cancel</CancelEditButton>
                        </div>
                        <CheckboxContainer>
                          <Checkbox
                            type="checkbox"
                            id={`takeaway-${editValue}`}
                            checked={editIsTakeaway}
                            onChange={(e) => setEditIsTakeaway(e.target.checked)}
                          />
                          <CheckboxLabel htmlFor={`takeaway-${editValue}`}>
                            This is a takeaway category
                          </CheckboxLabel>
                        </CheckboxContainer>
                      </EditForm>
                    ) : (
                      <>
                        <CategoryName>
                          {typeof category === 'string' ? category : category.name}
                          {(typeof category === 'object' && category.isTakeaway) && (
                            <span style={{ marginLeft: '6px', fontSize: '9px', color: '#FF6B35', fontWeight: '600' }}>
                              (Takeaway)
                            </span>
                          )}
                        </CategoryName>
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
                  );
                })}
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

