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

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
`;

export const StatCard = styled.div`
  background: white;
  padding: 10px 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.15s;
  border: 1px solid #e5e7eb;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }
`;

export const StatIcon = styled.div`
  font-size: 20px;
  color: #FF6B35;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
`;

export const StatLabel = styled.div`
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const Section = styled.div`
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
`;

export const SectionTitle = styled.h2`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 6px 8px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  height: 22px;
  background-color: #f9fafb;
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

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 16px;
  color: #9ca3af;
  font-size: 11px;
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

export const PopularItemCard = styled.div`
  background-color: #f9fafb;
  padding: 8px 10px;
  border-radius: 4px;
  border-left: 3px solid #FF6B35;
  border: 1px solid #e5e7eb;
`;

export const ItemName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
`;

export const ItemStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 9px;
  color: #6b7280;
`;

















