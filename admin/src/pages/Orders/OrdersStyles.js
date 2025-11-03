import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  padding: 30px;
  overflow-y: auto;
  height: calc(100vh - 80px);
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.$active ? '#FF6B35' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: 2px solid ${props => props.$active ? '#FF6B35' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #FF6B35;
    color: ${props => props.$active ? 'white' : '#FF6B35'};
  }
`;

export const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 2px solid #e0e0e0;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #fafafa;
  }
`;

export const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${props => props.color || '#999'};
  color: white;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const StatusSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s;

  &:focus {
    border-color: #FF6B35;
  }
`;

export const EmptyMessage = styled.div`
  background: white;
  padding: 60px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #999;
  font-size: 18px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FF6B35;
  border-radius: 50%;
  width: 50px;
  height: 50px;
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
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #333;
  }
`;

export const DetailSection = styled.div`
  padding: 25px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const DetailLabel = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 600;
`;

export const DetailValue = styled.span`
  font-size: 14px;
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 15px;
`;

export const ItemsList = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
`;

export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 6px;
  font-size: 14px;

  span:first-child {
    flex: 1;
    font-weight: 500;
  }

  span:nth-child(2) {
    color: #666;
    margin: 0 15px;
  }

  span:last-child {
    font-weight: bold;
    color: #FF6B35;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;


