import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  padding: 16px;
  overflow-y: auto;
  height: calc(100vh - 80px);
  background: #f8f9fa;
`;

export const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

export const FilterButton = styled.button`
  padding: 4px 12px;
  height: 22px;
  background-color: ${props => props.$active ? '#FF6B35' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  border: 1px solid ${props => props.$active ? '#FF6B35' : '#d1d5db'};
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover {
    border-color: #FF6B35;
    color: ${props => props.$active ? 'white' : '#FF6B35'};
    background-color: ${props => props.$active ? '#E55A2B' : 'transparent'};
  }
`;

export const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  font-size: 11px;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 6px 8px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  height: 22px;
  white-space: nowrap;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 4px 8px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 11px;
  color: #374151;
  height: 22px;
  vertical-align: middle;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  background-color: ${props => props.color || '#9ca3af'};
  color: white;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
`;

export const StatusSelect = styled.select`
  padding: 2px 6px;
  height: 22px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 10px;
  background-color: white;
  cursor: pointer;
  transition: all 0.15s;
  color: #374151;

  &:focus {
    border-color: #FF6B35;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
  }
`;

export const EmptyMessage = styled.div`
  background: white;
  padding: 24px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
  border: 1px solid #e5e7eb;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const LoadingSpinner = styled.div`
  border: 3px solid #f3f4f6;
  border-top: 3px solid #FF6B35;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: ${spin} 1s linear infinite;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 6px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #e5e7eb;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

export const ModalTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const CloseButton = styled.button`
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

export const DetailSection = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;

  h3 {
    font-size: 11px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  min-height: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.span`
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  min-width: 100px;
`;

export const DetailValue = styled.span`
  font-size: 11px;
  color: #1a1a1a;
  text-align: right;
  flex: 1;
  margin-left: 12px;
  font-weight: 500;
`;

export const ItemsList = styled.div`
  background-color: #f9fafb;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
`;

export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  margin-bottom: 4px;
  background-color: white;
  border-radius: 3px;
  font-size: 10px;
  min-height: 20px;
  border: 1px solid #f3f4f6;

  span:first-child {
    flex: 1;
    font-weight: 500;
    color: #374151;
  }

  span:nth-child(2) {
    color: #6b7280;
    margin: 0 8px;
    font-size: 9px;
  }

  span:last-child {
    font-weight: 600;
    color: #FF6B35;
    font-size: 10px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;


