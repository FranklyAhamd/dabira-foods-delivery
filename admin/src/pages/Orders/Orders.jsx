import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import api, { API_URL } from '../../config/api';
import {
  Container,
  PageTitle,
  FilterBar,
  FilterButton,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  StatusSelect,
  EmptyMessage,
  LoadingContainer,
  LoadingSpinner,
  OrderDetailsModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  DetailSection,
  DetailRow,
  DetailLabel,
  DetailValue,
  ItemsList,
  ItemRow
} from './OrdersStyles';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  useEffect(() => {
    fetchOrders();
    setupSocket();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [selectedStatus, orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/all');
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      alert('Error fetching orders');
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

    socket.on('order:new', (order) => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on('order:updated', (updatedOrder) => {
      setOrders(prev => prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
    });

    return () => socket.disconnect();
  };

  const filterOrders = () => {
    if (selectedStatus === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus
      });

      if (response.success) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      alert('Error updating order status');
    }
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
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <PageTitle>Orders Management</PageTitle>

      <FilterBar>
        {statuses.map(status => (
          <FilterButton
            key={status}
            $active={selectedStatus === status}
            onClick={() => setSelectedStatus(status)}
          >
            {status.replace(/_/g, ' ')}
          </FilterButton>
        ))}
      </FilterBar>

      {filteredOrders.length > 0 ? (
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Order ID</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Phone</TableHeader>
              <TableHeader>Items</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: 'pointer', color: '#2196F3' }}
                >
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerPhone}</TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>₦{order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <StatusBadge color={getStatusColor(order.status)}>
                    {order.status.replace(/_/g, ' ')}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusSelect
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </StatusSelect>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyMessage>No orders found</EmptyMessage>
      )}

      {selectedOrder && (
        <ModalOverlay onClick={() => setSelectedOrder(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Order Details</ModalTitle>
              <CloseButton onClick={() => setSelectedOrder(null)}>&times;</CloseButton>
            </ModalHeader>

            <DetailSection>
              <h3>Order Information</h3>
              <DetailRow>
                <DetailLabel>Order ID:</DetailLabel>
                <DetailValue>#{selectedOrder.id.slice(0, 8)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Date:</DetailLabel>
                <DetailValue>{formatDate(selectedOrder.createdAt)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <DetailValue>
                  <StatusBadge color={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.replace(/_/g, ' ')}
                  </StatusBadge>
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Payment Status:</DetailLabel>
                <DetailValue style={{ color: selectedOrder.paymentStatus === 'PAID' ? '#4CAF50' : '#FFA500' }}>
                  {selectedOrder.paymentStatus}
                </DetailValue>
              </DetailRow>
            </DetailSection>

            <DetailSection>
              <h3>Customer Information</h3>
              <DetailRow>
                <DetailLabel>Name:</DetailLabel>
                <DetailValue>{selectedOrder.customerName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Phone:</DetailLabel>
                <DetailValue>{selectedOrder.customerPhone}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Delivery Address:</DetailLabel>
                <DetailValue>{selectedOrder.deliveryAddress}</DetailValue>
              </DetailRow>
              {selectedOrder.notes && (
                <DetailRow>
                  <DetailLabel>Notes:</DetailLabel>
                  <DetailValue>{selectedOrder.notes}</DetailValue>
                </DetailRow>
              )}
            </DetailSection>

            <DetailSection>
              <h3>Order Items</h3>
              <ItemsList>
                {selectedOrder.items.map((item) => (
                  <ItemRow key={item.id}>
                    <span>{item.menuItem.name}</span>
                    <span>x{item.quantity}</span>
                    <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                  </ItemRow>
                ))}
              </ItemsList>
              <DetailRow style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #e0e0e0' }}>
                <DetailLabel style={{ fontSize: '18px', fontWeight: 'bold' }}>Total:</DetailLabel>
                <DetailValue style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF6B35' }}>
                  ₦{selectedOrder.totalAmount.toFixed(2)}
                </DetailValue>
              </DetailRow>
            </DetailSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Orders;


