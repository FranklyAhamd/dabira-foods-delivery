const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create/Update admin user
  console.log('Creating/updating admin user...');
  const hashedPassword = await bcrypt.hash('dabira', 10);
  
  // Check if old admin exists
  const oldAdmin = await prisma.user.findUnique({
    where: { email: 'admin@dabirafood.com' }
  });
  
  const newAdmin = await prisma.user.findUnique({
    where: { email: 'agidioja@gmail.com' }
  });
  
  if (oldAdmin && !newAdmin) {
    // Update old admin to new email and password
    await prisma.user.update({
      where: { email: 'admin@dabirafood.com' },
      data: {
        email: 'agidioja@gmail.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });
    console.log('✅ Old admin updated to new credentials');
  } else if (oldAdmin && newAdmin) {
    // Both exist, just update the old one's password in case it's different
    await prisma.user.update({
      where: { email: 'admin@dabirafood.com' },
      data: {
        password: hashedPassword
      }
    });
    console.log('✅ Old admin password updated (keeping both for now)');
  }
  
  // Create or update new admin user
  const admin = await prisma.user.upsert({
    where: { email: 'agidioja@gmail.com' },
    update: {
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    },
    create: {
      email: 'agidioja@gmail.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+234 123 456 7890'
    }
  });
  console.log('✅ Admin user ready');

  // Create sample customer
  console.log('Creating sample customer...');
  const customerPassword = await bcrypt.hash('customer123', 10);
  
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'John Doe',
      role: 'CUSTOMER',
      phone: '+234 987 654 3210'
    }
  });
  console.log('✅ Sample customer created');

  // Create sample menu items
  console.log('Creating menu items...');
  const menuItems = [
    {
      name: 'Classic Burger',
      description: 'Juicy beef patty with fresh lettuce, tomato, onions, pickles, and our special sauce on a toasted sesame bun',
      price: 2500,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Cheese Burger',
      description: 'Classic burger topped with melted cheddar cheese',
      price: 2800,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, ripe tomatoes, and fragrant basil on our signature crispy crust',
      price: 3500,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni with mozzarella cheese on tomato sauce',
      price: 4000,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'BBQ Chicken Wings',
      description: 'Crispy wings tossed in tangy BBQ sauce, served with ranch dip',
      price: 2000,
      category: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Mozzarella Sticks',
      description: 'Golden fried mozzarella sticks with marinara sauce',
      price: 1500,
      category: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing, parmesan cheese, and crunchy croutons',
      price: 1800,
      category: 'Salads',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Greek Salad',
      description: 'Fresh vegetables with feta cheese, olives, and olive oil dressing',
      price: 2000,
      category: 'Salads',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Grilled Chicken Pasta',
      description: 'Penne pasta with grilled chicken in creamy Alfredo sauce',
      price: 3200,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Spaghetti Bolognese',
      description: 'Classic spaghetti with rich meat sauce',
      price: 2800,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Coca Cola',
      description: 'Refreshing cold Coca Cola (330ml)',
      price: 500,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 800,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Iced Tea',
      description: 'Refreshing iced lemon tea',
      price: 600,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Chocolate Brownie',
      description: 'Warm chocolate brownie with vanilla ice cream',
      price: 1200,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=400&fit=crop',
      available: true
    },
    {
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake with berry compote',
      price: 1500,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=400&fit=crop',
      available: true
    }
  ];

  let createdCount = 0;
  let updatedCount = 0;
  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name }
    });
    
    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: item
      });
      updatedCount++;
    } else {
      await prisma.menuItem.create({
        data: item
      });
      createdCount++;
    }
  }
  console.log(`✅ ${createdCount} menu items created, ${updatedCount} updated`);

  // Create settings
  console.log('Creating settings...');
  await prisma.settings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      restaurantName: 'Dabira Foods',
      restaurantAddress: '123 Food Street, Lagos, Nigeria',
      restaurantPhone: '+234 800 123 4567',
      restaurantEmail: 'info@dabirafood.com',
      deliveryFee: 500,
      minimumOrder: 1000,
      openingTime: '09:00',
      closingTime: '22:00'
    }
  });
  console.log('✅ Settings created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('═══════════════════════════════════════');
  console.log('Admin Login Credentials:');
  console.log('  Email: agidioja@gmail.com');
  console.log('  Password: dabira');
  console.log('');
  console.log('Customer Login Credentials:');
  console.log('  Email: customer@example.com');
  console.log('  Password: customer123');
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });








