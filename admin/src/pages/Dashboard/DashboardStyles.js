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
  margin-bottom: 30px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

export const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const StatIcon = styled.div`
  font-size: 48px;
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #333;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;

export const Section = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #f0f0f0;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

export const TableCell = styled.td`
  padding: 15px 12px;
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
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
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

export const PopularItemCard = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #FF6B35;
`;

export const ItemName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

export const ItemStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
  color: #666;
`;














