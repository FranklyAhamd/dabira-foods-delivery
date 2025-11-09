import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api, { API_URL } from '../../config/api';
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiDollarSign, 
  FiCalendar,
  FiTrendingUp
} from 'react-icons/fi';
import {
  Container,
  PageTitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatInfo,
  StatValue,
  StatLabel,
  Section,
  SectionTitle,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  EmptyMessage,
  LoadingContainer,
  LoadingSpinner,
  PopularItemCard,
  ItemName,
  ItemStats
} from './DashboardStyles';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    setupSocket();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/orders/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get('/orders/all');
      if (response.success) {
        setRecentOrders(response.data.orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const socketUrl = API_URL.replace('/api', '');
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'], // Allow both transports
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000
    });
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join:admin');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('order:new', () => {
      fetchStats();
      fetchRecentOrders();
    });

    socket.on('order:paid', () => {
      fetchStats();
      fetchRecentOrders();
    });

    return () => socket.disconnect();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'CONFIRMED':
        return '#2196F3';
      case 'IN_PROGRESS':
        return '#9C27B0';
      case 'OUT_FOR_DELIVERY':
        return '#FF6B35';
      case 'DELIVERED':
        return '#4CAF50';
      default:
        return '#999';
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
      <PageTitle>Nigerian Food Dashboard</PageTitle>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FiPackage size={24} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.totalOrders || 0}</StatValue>
            <StatLabel>Total Orders</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FiClock size={24} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.pendingOrders || 0}</StatValue>
            <StatLabel>Pending Orders</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FiCheckCircle size={24} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.completedOrders || 0}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FiDollarSign size={24} />
          </StatIcon>
          <StatInfo>
            <StatValue>₦{stats?.totalRevenue?.toFixed(2) || '0.00'}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FiCalendar size={24} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.todayOrders || 0}</StatValue>
            <StatLabel>Today's Orders</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>Recent Orders</SectionTitle>
        {recentOrders.length > 0 ? (
          <Table>
            <thead>
              <TableRow>
                <TableHeader>Order ID</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Items</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => navigate('/orders')}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>#{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>₦{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge color={getStatusColor(order.status)}>
                      {order.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyMessage>No recent orders</EmptyMessage>
        )}
      </Section>

      <Section>
        <SectionTitle>Popular Items</SectionTitle>
        {stats?.popularItems && stats.popularItems.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
            {stats.popularItems.map((item) => (
              <PopularItemCard key={item.id}>
                <ItemName>{item.name}</ItemName>
                <ItemStats>
                  <span>Orders: {item.orderCount}</span>
                  <span>Total Sold: {item.totalQuantity}</span>
                </ItemStats>
              </PopularItemCard>
            ))}
          </div>
        ) : (
          <EmptyMessage>No data available</EmptyMessage>
        )}
      </Section>
    </Container>
  );
};

export default Dashboard;











