const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicineRoutse');
const orderRoutes = require('./routes/order'); // Import new routes

app.use(express.json()); 
app.use(cors());         

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes); // Use new order routes

// ... (rest of the file)