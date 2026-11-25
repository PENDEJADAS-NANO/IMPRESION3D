import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Calculator,
  Layers,
  Store,
  Settings,
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Zap,
  Package,
  Smartphone,
  CreditCard,
  Banknote,
  Send,
  FileText,
  RefreshCw,
  ChevronRight,
  X,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Sliders,
  Box,
  Tag
} from 'lucide-react';

// ============================================================================
// DATOS INICIALES REALISTAS (TALLER BAMBU LAB A1 + AMS EN BOGOTÁ, COLOMBIA)
// ============================================================================
const STORAGE_KEY = 'impresion3d_pos_studio_v1';

const INITIAL_DATA = {
  config: {
    businessName: 'Pendejadas 3D Studio',
    nit: '901.845.312-4',
    city: 'Bogotá D.C., Colombia',
    whatsapp: '573001234567',
    kwhPrice: 860, // Tarifa promedio estrato 4/comercial Bogotá COP/kWh
    printerName: 'Bambu Lab A1 + AMS Lite',
    printerPowerKw: 0.14, // Consumo promedio real en impresión PLA/PETG
    printerDepreciationPerHour: 1800, // Desgaste boquilla, correas, cama (COP/h)
    defaultFailureRate: 8, // 8% margen por fallos/purgas
    defaultRetailMargin: 130, // 130% margen sobre costo producción
    defaultWholesaleMargin: 65, // 65% margen al por mayor
    dianEnabled: true,
    dianProvider: 'Alegra / Siigo API',
    dianResolution: '18764098231104',
    dianPrefix: 'FE3D',
    nextInvoiceNumber: 1048,
  },
  filaments: [
    {
      id: 'fil-1',
      brand: 'Bambu Lab',
      material: 'PLA Basic',
      colorName: 'Negro Mate',
      colorHex: '#1e293b',
      initialWeight: 1000,
      remainingWeight: 680,
      rollCost: 98000,
      amsSlot: 'AMS 1',
    },
    {
      id: 'fil-2',
      brand: 'eSUN',
      material: 'PLA+',
      colorName: 'Blanco Hueso',
      colorHex: '#f8fafc',
      initialWeight: 1000,
      remainingWeight: 145, // Alerta stock bajo (<200g)
      rollCost: 85000,
      amsSlot: 'AMS 2',
    },
    {
      id: 'fil-3',
      brand: 'Sunlu',
      material: 'PLA Silk',
      colorName: 'Tricolor Neón (Morado/Azul/Verde)',
      colorHex: '#8b5cf6',
      initialWeight: 1000,
      remainingWeight: 820,
      rollCost: 112000,
      amsSlot: 'AMS 3',
    },
    {
      id: 'fil-4',
      brand: 'Bambu Lab',
      material: 'PETG Translúcido',
      colorName: 'Naranja Fuego',
      colorHex: '#f97316',
      initialWeight: 1000,
      remainingWeight: 510,
      rollCost: 105000,
      amsSlot: 'AMS 4',
    },
    {
      id: 'fil-5',
      brand: 'eSUN',
      material: 'PLA+',
      colorName: 'Dorado Metálico',
      colorHex: '#eab308',
      initialWeight: 1000,
      remainingWeight: 180, // Alerta stock bajo
      rollCost: 92000,
      amsSlot: 'Estante',
    },
  ],
  supplies: [
    { id: 'sup-1', name: 'Argolla Llavero Reforzada + Cadena', unitCost: 450, stock: 180 },
    { id: 'sup-2', name: 'Imán Neodimio 8x3mm (Par)', unitCost: 900, stock: 64 },
    { id: 'sup-3', name: 'Base Acrílica / Cinta Doble Faz 3M', unitCost: 1200, stock: 35 },
    { id: 'sup-4', name: 'Bolsa Celofán + Tarjeta Personalizada', unitCost: 600, stock: 210 },
    { id: 'sup-5', name: 'Caja Kraft Regalo + Viruta', unitCost: 2400, stock: 28 },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Axolote Articulado Tricolor Silk',
      category: 'Llaveros Articulados',
      sku: '3D-AXO-01',
      price: 16000,
      wholesalePrice: 11500,
      productionCost: 5400,
      stock: 14,
      printTimeMinutes: 55,
      weightGrams: 24,
      colorHex: '#8b5cf6',
      description: 'Flexi axolote articulado impreso en PLA Silk multicolor con argolla metálica.',
      featured: true,
    },
    {
      id: 'prod-2',
      name: 'Dragón Cristal Articulado 30cm',
      category: 'Decoración / Accesorios',
      sku: '3D-DRG-02',
      price: 48000,
      wholesalePrice: 35000,
      productionCost: 18200,
      stock: 4,
      printTimeMinutes: 210,
      weightGrams: 115,
      colorHex: '#f97316',
      description: 'Dragón articulado de escamas con acabado translúcido naranja fuego.',
      featured: true,
    },
    {
      id: 'prod-3',
      name: 'Portamedallas Running / Ciclismo Personalizado',
      category: 'Portamedallas',
      sku: '3D-MED-03',
      price: 42000,
      wholesalePrice: 31000,
      productionCost: 15800,
      stock: 6,
      printTimeMinutes: 165,
      weightGrams: 98,
      colorHex: '#1e293b',
      description: 'Soporte de pared en relieve 3D bicolor para 15+ medallas. Incluye chazos.',
      featured: true,
    },
    {
      id: 'prod-4',
      name: 'Muñeco Chibi Grado Personalizado (Birrete)',
      category: 'Muñecos Chibi Grado',
      sku: '3D-CHI-04',
      price: 55000,
      wholesalePrice: 42000,
      productionCost: 21500,
      stock: 3,
      printTimeMinutes: 240,
      weightGrams: 130,
      colorHex: '#eab308',
      description: 'Figura estilo chibi con toga, birrete y diploma dorado en caja de regalo.',
      featured: true,
    },
    {
      id: 'prod-5',
      name: 'Llavero Casco F1 / Moto Articulado',
      category: 'Llaveros Articulados',
      sku: '3D-MOT-05',
      price: 18000,
      wholesalePrice: 13000,
      productionCost: 6100,
      stock: 11,
      printTimeMinutes: 65,
      weightGrams: 28,
      colorHex: '#f8fafc',
      description: 'Mini casco con visera móvil impreso multicolor en AMS.',
      featured: false,
    },
    {
      id: 'prod-6',
      name: 'Soporte Audífonos Low-Poly Escritorio',
      category: 'Decoración / Accesorios',
      sku: '3D-AUD-06',
      price: 36000,
      wholesalePrice: 26000,
      productionCost: 13900,
      stock: 5,
      printTimeMinutes: 180,
      weightGrams: 110,
      colorHex: '#1e293b',
      description: 'Base geométrica robusta en PLA Negro Mate para diademas gamer o estudio.',
      featured: false,
    },
  ],
  orders: [
    {
      id: 'PED-1047',
      date: '2026-11-24 17:40',
      customerName: 'Camila Rodríguez',
      customerPhone: '3114567890',
      customerAddress: 'Chapinero Alto, Bogotá',
      items: [
        { productId: 'prod-4', name: 'Muñeco Chibi Grado Personalizado (Birrete)', qty: 1, price: 55000, cost: 21500 },
        { productId: 'prod-1', name: 'Axolote Articulado Tricolor Silk', qty: 1, price: 16000, cost: 5400 },
      ],
      discount: 0,
      total: 71000,
      totalCost: 26900,
      paymentMethod: 'Nequi / Daviplata',
      status: 'Imprimiendo',
      source: 'WhatsApp',
      dianInvoice: {
        number: 'FE3D-1047',
        cufe: '9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0987654321fedcba9876543210',
      },
    },
    {
      id: 'PED-1046',
      date: '2026-11-24 14:15',
      customerName: 'Andrés Felipe Gómez',
      customerPhone: '3209876543',
      customerAddress: 'Cedritos, Calle 140, Bogotá',
      items: [
        { productId: 'prod-3', name: 'Portamedallas Running / Ciclismo Personalizado', qty: 2, price: 42000, cost: 15800 },
      ],
      discount: 4000,
      total: 80000,
      totalCost: 31600,
      paymentMethod: 'Bold Datáfono',
      status: 'Listo',
      source: 'POS Local',
      dianInvoice: {
        number: 'FE3D-1046',
        cufe: '4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0987654321abcd12',
      },
    },
    {
      id: 'PED-1045',
      date: '2026-11-23 19:05',
      customerName: 'Valentina Torres',
      customerPhone: '3007654321',
      customerAddress: 'Salitre Occidental, Bogotá',
      items: [
        { productId: 'prod-2', name: 'Dragón Cristal Articulado 30cm', qty: 1, price: 48000, cost: 18200 },
        { productId: 'prod-5', name: 'Llavero Casco F1 / Moto Articulado', qty: 2, price: 18000, cost: 6100 },
      ],
      discount: 0,
      total: 84000,
      totalCost: 30400,
      paymentMethod: 'Transferencia PSE',
      status: 'Entregado',
      source: 'Catálogo Web',
      dianInvoice: null,
    },
    {
      id: 'PED-1044',
      date: '2026-11-22 11:20',
      customerName: 'Julián Castañeda',
      customerPhone: '3152345678',
      customerAddress: 'Usaquén, Bogotá',
      items: [
        { productId: 'prod-1', name: 'Axolote Articulado Tricolor Silk', qty: 5, price: 11500, cost: 5400 },
      ],
      discount: 0,
      total: 57500,
      totalCost: 27000,
      paymentMethod: 'Efectivo',
      status: 'Entregado',
      source: 'POS Local',
      dianInvoice: {
        number: 'FE3D-1044',
        cufe: '7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0987659988',
      },
    },
  ],
};

// ============================================================================
// UTILIDADES DE FORMATO Y CÁLCULO
// ============================================================================
const formatCOP = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));
};

const generateMockCUFE = () => {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const CATEGORIES = [
  'Todas',
  'Llaveros Articulados',
  'Portamedallas',
  'Muñecos Chibi Grado',
  'Decoración / Accesorios',
];

const ORDER_STATUSES = [
  'Pendiente por imprimir',
  'Imprimiendo',
  'Listo',
  'Entregado',
];

// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================
export default function App() {
  // Estado principal con persistencia en localStorage
  const [appData, setAppData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error cargando localStorage:', e);
    }
    return INITIAL_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.error('Error guardando localStorage:', e);
    }
  }, [appData]);

  // Navegación entre módulos
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | pos | calculator | inventory | catalog | settings
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3400);
  };

  const handleResetDemoData = () => {
    setAppData(INITIAL_DATA);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Datos de ejemplo restaurados correctamente', 'info');
  };

  // ==========================================================================
  // MÉTRICAS GLOBALES DEL DASHBOARD
  // ==========================================================================
  const dashboardStats = useMemo(() => {
    const totalSales = appData.orders.reduce((acc, o) => acc + o.total, 0);
    const totalCost = appData.orders.reduce((acc, o) => acc + (o.totalCost || 0), 0);
    const netProfit = totalSales - totalCost;
    const pendingOrders = appData.orders.filter(
      (o) => o.status === 'Pendiente por imprimir' || o.status === 'Imprimiendo'
    );
    const lowFilaments = appData.filaments.filter((f) => f.remainingWeight < 200);

    // Ventas por categoría
    const categoryTotals = {};
    appData.orders.forEach((order) => {
      order.items.forEach((item) => {
        const prod = appData.products.find((p) => p.id === item.productId);
        const cat = prod ? prod.category : 'Otros';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + item.price * item.qty;
      });
    });

    return {
      totalSales,
      netProfit,
      marginPercent: totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0,
      pendingCount: pendingOrders.length,
      pendingOrders,
      lowFilaments,
      categoryTotals,
    };
  }, [appData]);

  // ==========================================================================
  // MÓDULO 2: ESTADO Y LÓGICA DEL PUNTO DE VENTA (POS)
  // ==========================================================================
  const [posSearch, setPosSearch] = useState('');
  const [posCategory, setPosCategory] = useState('Todas');
  const [posCart, setPosCart] = useState([]);
  const [posDiscount, setPosDiscount] = useState(0);
  const [posCustomer, setPosCustomer] = useState({
    name: '',
    phone: '',
    address: 'Bogotá D.C.',
  });
  const [posPayment, setPosPayment] = useState('Nequi / Daviplata');
  const [posEmitDian, setPosEmitDian] = useState(true);
  const [posOrderStatus, setPosOrderStatus] = useState('Pendiente por imprimir');
  const [posSubView, setPosSubView] = useState('register'); // register | orders
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState(null);

  const filteredPosProducts = useMemo(() => {
    return appData.products.filter((p) => {
      const matchesCat = posCategory === 'Todas' || p.category === posCategory;
      const matchesQuery =
        p.name.toLowerCase().includes(posSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(posSearch.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [appData.products, posCategory, posSearch]);

  const addToPosCart = (product) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          cost: product.productionCost,
          qty: 1,
        },
      ];
    });
  };

  const updatePosCartQty = (productId, delta) => {
    setPosCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const posSubtotal = posCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const posTotal = Math.max(0, posSubtotal - Number(posDiscount || 0));
  const posTotalCost = posCart.reduce((acc, item) => acc + item.cost * item.qty, 0);

  const handleCompletePosSale = () => {
    if (posCart.length === 0) {
      showToast('Agrega al menos un producto al carrito', 'error');
      return;
    }

    const invoiceNum = `${appData.config.dianPrefix}-${appData.config.nextInvoiceNumber}`;
    const newOrderId = `PED-${appData.config.nextInvoiceNumber}`;

    const newOrder = {
      id: newOrderId,
      date: new Date().toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: posCustomer.name.trim() || 'Cliente Mostrador',
      customerPhone: posCustomer.phone.trim() || '3000000000',
      customerAddress: posCustomer.address.trim() || 'Bogotá D.C.',
      items: posCart,
      discount: Number(posDiscount || 0),
      total: posTotal,
      totalCost: posTotalCost,
      paymentMethod: posPayment,
      status: posOrderStatus,
      source: 'POS Local',
      dianInvoice: posEmitDian
        ? {
            number: invoiceNum,
            cufe: generateMockCUFE(),
          }
        : null,
    };

    // Descontar stock de productos vendidos si ya estaban en stock
    const updatedProducts = appData.products.map((prod) => {
      const soldItem = posCart.find((c) => c.productId === prod.id);
      if (soldItem) {
        return { ...prod, stock: Math.max(0, prod.stock - soldItem.qty) };
      }
      return prod;
    });

    setAppData((prev) => ({
      ...prev,
      products: updatedProducts,
      orders: [newOrder, ...prev.orders],
      config: {
        ...prev.config,
        nextInvoiceNumber: posEmitDian ? prev.config.nextInvoiceNumber + 1 : prev.config.nextInvoiceNumber,
      },
    }));

    setPosCart([]);
    setPosDiscount(0);
    setPosCustomer({ name: '', phone: '', address: 'Bogotá D.C.' });
    setSelectedInvoiceModal(newOrder);
    showToast(`Venta ${newOrder.id} registrada con éxito`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setAppData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    }));
    showToast(`Pedido ${orderId} actualizado a "${newStatus}"`);
  };

  // ==========================================================================
  // MÓDULO 3: CALCULADORA DE COSTOS 3D (SOPORTE MULTI-FILAMENTO AMS)
  // ==========================================================================
  const [calcProjectName, setCalcProjectName] = useState('Llavero Tortuga Articulada AMS');
  const [calcCategory, setCalcCategory] = useState('Llaveros Articulados');
  const [calcHours, setCalcHours] = useState(1);
  const [calcMinutes, setCalcMinutes] = useState(15);
  const [calcSlots, setCalcSlots] = useState([
    { filamentId: 'fil-1', partGrams: 18, purgeGrams: 6 },
    { filamentId: 'fil-3', partGrams: 9, purgeGrams: 5 },
  ]);
  const [calcSelectedSupplies, setCalcSelectedSupplies] = useState([
    { supplyId: 'sup-1', qty: 1 },
    { supplyId: 'sup-4', qty: 1 },
  ]);
  const [calcFailureRate, setCalcFailureRate] = useState(appData.config.defaultFailureRate);
  const [calcRetailMargin, setCalcRetailMargin] = useState(appData.config.defaultRetailMargin);
  const [calcWholesaleMargin, setCalcWholesaleMargin] = useState(appData.config.defaultWholesaleMargin);
  const [calcDeductFilament, setCalcDeductFilament] = useState(false);

  const addCalcSlot = () => {
    if (calcSlots.length >= 4) {
      showToast('Bambu Lab AMS soporta hasta 4 bobinas simultáneas', 'info');
      return;
    }
    const nextFil = appData.filaments[calcSlots.length % appData.filaments.length];
    setCalcSlots([...calcSlots, { filamentId: nextFil.id, partGrams: 10, purgeGrams: 4 }]);
  };

  const removeCalcSlot = (index) => {
    if (calcSlots.length <= 1) return;
    setCalcSlots(calcSlots.filter((_, idx) => idx !== index));
  };

  const updateCalcSlot = (index, field, value) => {
    setCalcSlots((prev) =>
      prev.map((slot, idx) => (idx === index ? { ...slot, [field]: value } : slot))
    );
  };

  const toggleCalcSupply = (supplyId) => {
    setCalcSelectedSupplies((prev) => {
      const exists = prev.find((s) => s.supplyId === supplyId);
      if (exists) {
        return prev.filter((s) => s.supplyId !== supplyId);
      }
      return [...prev, { supplyId, qty: 1 }];
    });
  };

  const updateCalcSupplyQty = (supplyId, qty) => {
    setCalcSelectedSupplies((prev) =>
      prev.map((s) => (s.supplyId === supplyId ? { ...s, qty: Math.max(1, Number(qty)) } : s))
    );
  };

  const calcBreakdown = useMemo(() => {
    const totalHours = Number(calcHours || 0) + Number(calcMinutes || 0) / 60;

    // 1. Costo de filamentos (pieza + purga/torre)
    let totalGrams = 0;
    let totalPurgeGrams = 0;
    let filamentCost = 0;

    calcSlots.forEach((slot) => {
      const fil = appData.filaments.find((f) => f.id === slot.filamentId);
      const costPerGram = fil ? fil.rollCost / fil.initialWeight : 95;
      const pGrams = Number(slot.partGrams || 0);
      const tGrams = Number(slot.purgeGrams || 0);
      totalGrams += pGrams + tGrams;
      totalPurgeGrams += tGrams;
      filamentCost += (pGrams + tGrams) * costPerGram;
    });

    // 2. Energía eléctrica
    const energyKwh = totalHours * appData.config.printerPowerKw;
    const energyCost = energyKwh * appData.config.kwhPrice;

    // 3. Desgaste / Amortización de máquina
    const machineCost = totalHours * appData.config.printerDepreciationPerHour;

    // 4. Insumos y empaque
    let suppliesCost = 0;
    calcSelectedSupplies.forEach((item) => {
      const sup = appData.supplies.find((s) => s.id === item.supplyId);
      if (sup) {
        suppliesCost += sup.unitCost * item.qty;
      }
    });

    // Subtotal operativo + margen de fallo
    const baseSubtotal = filamentCost + energyCost + machineCost + suppliesCost;
    const failureBuffer = baseSubtotal * (Number(calcFailureRate || 0) / 100);
    const totalProductionCost = baseSubtotal + failureBuffer;

    // Precios sugeridos (redondeados al múltiplo de $500 COP más cercano)
    const rawRetail = totalProductionCost * (1 + Number(calcRetailMargin || 0) / 100);
    const suggestedRetailPrice = Math.ceil(rawRetail / 500) * 500;

    const rawWholesale = totalProductionCost * (1 + Number(calcWholesaleMargin || 0) / 100);
    const suggestedWholesalePrice = Math.ceil(rawWholesale / 500) * 500;

    return {
      totalHours,
      totalMinutes: Math.round(totalHours * 60),
      totalGrams,
      totalPurgeGrams,
      filamentCost,
      energyCost,
      machineCost,
      suppliesCost,
      failureBuffer,
      totalProductionCost,
      suggestedRetailPrice,
      suggestedWholesalePrice,
      retailProfit: suggestedRetailPrice - totalProductionCost,
    };
  }, [
    calcHours,
    calcMinutes,
    calcSlots,
    calcSelectedSupplies,
    calcFailureRate,
    calcRetailMargin,
    calcWholesaleMargin,
    appData.filaments,
    appData.supplies,
    appData.config,
  ]);

  const handleSaveCalculatedProduct = () => {
    if (!calcProjectName.trim()) {
      showToast('Escribe un nombre para el producto', 'error');
      return;
    }

    const primaryFilament = appData.filaments.find((f) => f.id === calcSlots[0]?.filamentId);
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: calcProjectName.trim(),
      category: calcCategory,
      sku: `3D-${Math.floor(100 + Math.random() * 900)}`,
      price: calcBreakdown.suggestedRetailPrice,
      wholesalePrice: calcBreakdown.suggestedWholesalePrice,
      productionCost: Math.round(calcBreakdown.totalProductionCost),
      stock: 1,
      printTimeMinutes: calcBreakdown.totalMinutes,
      weightGrams: calcBreakdown.totalGrams,
      colorHex: primaryFilament ? primaryFilament.colorHex : '#6366f1',
      description: `Pieza impresa en 3D (${calcBreakdown.totalGrams}g, ${calcHours}h ${calcMinutes}m) en ${appData.config.printerName}.`,
      featured: true,
    };

    let updatedFilaments = appData.filaments;
    if (calcDeductFilament) {
      updatedFilaments = appData.filaments.map((fil) => {
        const usedSlot = calcSlots.find((s) => s.filamentId === fil.id);
        if (usedSlot) {
          const used = Number(usedSlot.partGrams || 0) + Number(usedSlot.purgeGrams || 0);
          return { ...fil, remainingWeight: Math.max(0, fil.remainingWeight - used) };
        }
        return fil;
      });
    }

    setAppData((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products],
      filaments: updatedFilaments,
    }));

    showToast(
      `Producto "${newProduct.name}" guardado en el catálogo por ${formatCOP(newProduct.price)}`
    );
  };

  // ==========================================================================
  // MÓDULO 4: INVENTARIO DE FILAMENTOS Y MATERIALES
  // ==========================================================================
  const [invSubTab, setInvSubTab] = useState('filaments'); // filaments | supplies | products
  const [showFilamentModal, setShowFilamentModal] = useState(false);
  const [newFilamentForm, setNewFilamentForm] = useState({
    brand: 'Bambu Lab',
    material: 'PLA Basic',
    colorName: '',
    colorHex: '#10b981',
    initialWeight: 1000,
    remainingWeight: 1000,
    rollCost: 95000,
    amsSlot: 'Estante',
  });

  const handleAddFilament = (e) => {
    e.preventDefault();
    if (!newFilamentForm.colorName.trim()) {
      showToast('Ingresa el nombre del color de la bobina', 'error');
      return;
    }
    const created = {
      ...newFilamentForm,
      id: `fil-${Date.now()}`,
      initialWeight: Number(newFilamentForm.initialWeight),
      remainingWeight: Number(newFilamentForm.remainingWeight),
      rollCost: Number(newFilamentForm.rollCost),
    };
    setAppData((prev) => ({
      ...prev,
      filaments: [created, ...prev.filaments],
    }));
    setShowFilamentModal(false);
    setNewFilamentForm({
      brand: 'Bambu Lab',
      material: 'PLA Basic',
      colorName: '',
      colorHex: '#10b981',
      initialWeight: 1000,
      remainingWeight: 1000,
      rollCost: 95000,
      amsSlot: 'Estante',
    });
    showToast('Nueva bobina de filamento agregada al inventario');
  };

  const handleRefillFilament = (id) => {
    setAppData((prev) => ({
      ...prev,
      filaments: prev.filaments.map((f) =>
        f.id === id ? { ...f, remainingWeight: f.initialWeight } : f
      ),
    }));
    showToast('Bobina recargada al 100% (1000g)');
  };

  const handleAdjustFilamentGrams = (id, delta) => {
    setAppData((prev) => ({
      ...prev,
      filaments: prev.filaments.map((f) =>
        f.id === id
          ? { ...f, remainingWeight: Math.max(0, Math.min(f.initialWeight, f.remainingWeight + delta)) }
          : f
      ),
    }));
  };

  const handleAdjustSupplyStock = (id, delta) => {
    setAppData((prev) => ({
      ...prev,
      supplies: prev.supplies.map((s) =>
        s.id === id ? { ...s, stock: Math.max(0, s.stock + delta) } : s
      ),
    }));
  };

  // ==========================================================================
  // MÓDULO 5: CATÁLOGO PÚBLICO Y CHECKOUT WHATSAPP
  // ==========================================================================
  const [storeCategory, setStoreCategory] = useState('Todas');
  const [storeCart, setStoreCart] = useState([
    { productId: 'prod-1', name: 'Axolote Articulado Tricolor Silk', price: 16000, cost: 5400, qty: 1 },
  ]);
  const [storeCustomer, setStoreCustomer] = useState({
    name: 'Sebastián Mejía',
    phone: '3128904567',
    neighborhood: 'Colina Campestre, Bogotá',
    notes: 'Empaque para regalo por favor',
  });
  const [whatsappPreviewModal, setWhatsappPreviewModal] = useState(null);

  const addToStoreCart = (prod) => {
    setStoreCart((prev) => {
      const found = prev.find((i) => i.productId === prod.id);
      if (found) {
        return prev.map((i) => (i.productId === prod.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          cost: prod.productionCost,
          qty: 1,
        },
      ];
    });
    showToast(`"${prod.name}" agregado a tu pedido`);
  };

  const storeTotal = storeCart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const storeTotalCost = storeCart.reduce((acc, i) => acc + i.cost * i.qty, 0);

  const handlePlaceWhatsappOrder = () => {
    if (storeCart.length === 0) {
      showToast('El carrito de la tienda está vacío', 'error');
      return;
    }
    if (!storeCustomer.name.trim()) {
      showToast('Por favor ingresa tu nombre para el pedido', 'error');
      return;
    }

    const orderId = `PED-${appData.config.nextInvoiceNumber}`;
    const itemsLines = storeCart
      .map((i) => `• ${i.qty}x ${i.name} — ${formatCOP(i.price * i.qty)}`)
      .join('\n');

    const messageText = `¡Hola *${appData.config.businessName}*! 👋 Quiero confirmar el siguiente pedido desde su catálogo web:\n\n*Pedido:* #${orderId}\n*Cliente:* ${storeCustomer.name}\n*Entrega en:* ${storeCustomer.neighborhood}\n\n*Detalle:*\n${itemsLines}\n\n*Total a pagar:* ${formatCOP(storeTotal)}\n${storeCustomer.notes ? `*Nota:* ${storeCustomer.notes}\n` : ''}\n¿Me confirman disponibilidad y datos de Nequi/Bold para transferir? 🚀`;

    const waUrl = `https://wa.me/${appData.config.whatsapp}?text=${encodeURIComponent(messageText)}`;

    // Registrar pedido en el POS en estado "Pendiente por imprimir"
    const newWebOrder = {
      id: orderId,
      date: new Date().toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: storeCustomer.name,
      customerPhone: storeCustomer.phone || '3000000000',
      customerAddress: storeCustomer.neighborhood || 'Bogotá',
      items: storeCart,
      discount: 0,
      total: storeTotal,
      totalCost: storeTotalCost,
      paymentMethod: 'Por confirmar (WhatsApp)',
      status: 'Pendiente por imprimir',
      source: 'Catálogo Web',
      dianInvoice: null,
    };

    setAppData((prev) => ({
      ...prev,
      orders: [newWebOrder, ...prev.orders],
      config: {
        ...prev.config,
        nextInvoiceNumber: prev.config.nextInvoiceNumber + 1,
      },
    }));

    setWhatsappPreviewModal({
      orderId,
      messageText,
      waUrl,
    });
    setStoreCart([]);
    showToast(`Pedido ${orderId} creado en el POS y listo para WhatsApp`);
  };

  // ==========================================================================
  // ELEMENTOS DE NAVEGACIÓN
  // ==========================================================================
  const navItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'pos', label: 'POS y Pedidos', icon: ShoppingBag, badge: dashboardStats.pendingCount },
    { id: 'calculator', label: 'Calculadora 3D', icon: Calculator },
    { id: 'inventory', label: 'Inventario', icon: Layers, badge: dashboardStats.lowFilaments.length },
    { id: 'catalog', label: 'Tienda Web', icon: Store },
    { id: 'settings', label: 'Ajustes / DIAN', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : toast.type === 'info'
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-emerald-600 text-white border-emerald-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* ====================================================================
          BARRA LATERAL DE NAVEGACIÓN (ESCRITORIO)
      ==================================================================== */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-900 text-slate-100 border-r border-slate-800 z-30">
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-md">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-base tracking-tight truncate">
              {appData.config.businessName}
            </h1>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Bambu Lab A1 + AMS
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      isActive
                        ? 'bg-white text-indigo-700'
                        : item.id === 'inventory'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleResetDemoData}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar datos demo
          </button>
          <p className="text-[11px] text-center text-slate-500">
            Bogotá, Colombia • Moneda COP $
          </p>
        </div>
      </aside>

      {/* ====================================================================
          ENCABEZADO MÓVIL SUPERIOR
      ==================================================================== */}
      <header className="md:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">{appData.config.businessName}</h1>
            <span className="text-[11px] text-emerald-400">POS & Estudio 3D</span>
          </div>
        </div>
        <button
          onClick={handleResetDemoData}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          title="Restaurar datos demo"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      {/* ====================================================================
          CONTENIDO PRINCIPAL (DINÁMICO SEGÚN PESTAÑA)
      ==================================================================== */}
      <main className="flex-1 md:pl-64 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* ----------------------------------------------------------------
              1. MÓDULO DASHBOARD / RESUMEN GENERAL
          ---------------------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Cabecera */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Panel de Control del Taller</h2>
                  <p className="text-sm text-slate-500">
                    Resumen operativo, cola de impresión en {appData.config.printerName} y ventas en Bogotá.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('pos');
                      setPosSubView('register');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Venta
                  </button>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-sm font-semibold transition"
                  >
                    <Calculator className="w-4 h-4 text-indigo-600" />
                    Cotizar Pieza 3D
                  </button>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
                  >
                    <Store className="w-4 h-4" />
                    Catálogo Público
                  </button>
                </div>
              </div>

              {/* Tarjetas KPI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Ventas Acumuladas
                    </span>
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-slate-900">
                    {formatCOP(dashboardStats.totalSales)}
                  </p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">
                    {appData.orders.length} pedidos registrados
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Ganancia Neta Est.
                    </span>
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <Banknote className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-emerald-600">
                    {formatCOP(dashboardStats.netProfit)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Margen promedio real: <strong className="text-slate-700">{dashboardStats.marginPercent}%</strong>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Cola de Impresión
                    </span>
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                      <Printer className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-slate-900">
                    {dashboardStats.pendingCount} pedidos
                  </p>
                  <p className="mt-1 text-xs text-sky-600 font-medium">
                    Pendientes o en cama caliente
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Alertas Filamento
                    </span>
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-amber-600">
                    {dashboardStats.lowFilaments.length} bobinas
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Con menos de 200g disponibles
                  </p>
                </div>
              </div>

              {/* Segunda Fila: Cola de Producción y Ventas por Categoría */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Estado de la impresora y pedidos activos */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <h3 className="font-bold text-slate-900">
                        Cola de Producción ({appData.config.printerName})
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('pos');
                        setPosSubView('orders');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Ver todos los pedidos →
                    </button>
                  </div>

                  {dashboardStats.pendingOrders.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-sm text-slate-500">
                        ¡Cama libre! No hay pedidos pendientes por imprimir en este momento.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dashboardStats.pendingOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{order.id}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                                {order.source}
                              </span>
                              <span className="text-xs text-slate-500">• {order.customerName}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              {order.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                            >
                              {ORDER_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                            <span className="font-bold text-sm text-slate-900">
                              {formatCOP(order.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Estado de los 4 slots del AMS */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Bobinas Cargadas en AMS Lite
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {appData.filaments.slice(0, 4).map((fil) => {
                        const pct = Math.round((fil.remainingWeight / fil.initialWeight) * 100);
                        return (
                          <div
                            key={fil.id}
                            className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                                style={{ backgroundColor: fil.colorHex }}
                              ></span>
                              <span className="text-xs font-bold text-slate-800 truncate">
                                {fil.amsSlot}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 truncate mt-1">{fil.colorName}</p>
                            <div className="mt-2">
                              <div className="flex justify-between text-[11px] font-medium mb-1">
                                <span className={fil.remainingWeight < 200 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                                  {fil.remainingWeight}g
                                </span>
                                <span className="text-slate-400">{pct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    fil.remainingWeight < 200 ? 'bg-rose-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Ventas por Categoría */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Ventas por Categoría</h3>
                    <p className="text-xs text-slate-500 mb-5">
                      Distribución de ingresos por línea de producto
                    </p>
                    <div className="space-y-4">
                      {Object.entries(dashboardStats.categoryTotals).map(([cat, amount]) => {
                        const share =
                          dashboardStats.totalSales > 0
                            ? Math.round((amount / dashboardStats.totalSales) * 100)
                            : 0;
                        return (
                          <div key={cat}>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-slate-700 truncate pr-2">{cat}</span>
                              <span className="text-slate-900">{formatCOP(amount)}</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${share}%` }}
                              ></div>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 text-right">{share}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {dashboardStats.lowFilaments.length > 0 && (
                    <div className="mt-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Reponer Filamento Pronto
                      </div>
                      <ul className="text-xs text-amber-700 space-y-1">
                        {dashboardStats.lowFilaments.map((f) => (
                          <li key={f.id}>
                            • {f.brand} {f.colorName}: <strong>{f.remainingWeight}g</strong> restantes
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => setActiveTab('inventory')}
                        className="mt-2.5 w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition"
                      >
                        Ir a Inventario
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              2. MÓDULO PUNTO DE VENTA (POS) Y PEDIDOS
          ---------------------------------------------------------------- */}
          {activeTab === 'pos' && (
            <div className="space-y-5">
              {/* Barra superior de sub-vistas POS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Punto de Venta (POS)</h2>
                  <p className="text-sm text-slate-500">
                    Ventas rápidas en mostrador, pedidos personalizados y facturación electrónica DIAN.
                  </p>
                </div>
                <div className="inline-flex p-1 rounded-xl bg-slate-200/80 self-start">
                  <button
                    onClick={() => setPosSubView('register')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                      posSubView === 'register'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Caja Registradora
                  </button>
                  <button
                    onClick={() => setPosSubView('orders')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      posSubView === 'orders'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Historial y Cola ({appData.orders.length})
                  </button>
                </div>
              </div>

              {posSubView === 'register' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Catálogo de Productos POS (7 columnas) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Buscador y Filtros */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={posSearch}
                          onChange={(e) => setPosSearch(e.target.value)}
                          placeholder="Buscar llavero, dragón, portamedallas o SKU..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setPosCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                              posCategory === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grid de Productos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {filteredPosProducts.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => addToPosCart(prod)}
                          className="text-left bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {prod.category}
                              </span>
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  prod.stock > 3
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                Stock: {prod.stock}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 mt-2.5">
                              <span
                                className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                                style={{ backgroundColor: prod.colorHex }}
                              ></span>
                              <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                                {prod.name}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {prod.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-base font-extrabold text-slate-900">
                                {formatCOP(prod.price)}
                              </span>
                              <span className="block text-[10px] text-slate-400">
                                {prod.weightGrams}g • {prod.printTimeMinutes} min
                              </span>
                            </div>
                            <span className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition">
                              <Plus className="w-4 h-4" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Carrito Lateral Interactivo (5 columnas) */}
                  <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-indigo-600" />
                          Orden Actual
                        </h3>
                        {posCart.length > 0 && (
                          <button
                            onClick={() => setPosCart([])}
                            className="text-xs text-rose-600 hover:underline font-medium"
                          >
                            Vaciar
                          </button>
                        )}
                      </div>

                      {/* Lista de ítems en carrito */}
                      {posCart.length === 0 ? (
                        <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                          <p className="text-xs text-slate-500">
                            Selecciona productos de la izquierda para armar la venta.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                          {posCart.map((item) => (
                            <div
                              key={item.productId}
                              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {formatCOP(item.price)} c/u
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => updatePosCartQty(item.productId, -1)}
                                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center text-xs font-bold">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => updatePosCartQty(item.productId, 1)}
                                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-right min-w-[72px]">
                                <p className="text-xs font-extrabold text-slate-900">
                                  {formatCOP(item.price * item.qty)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Datos del Cliente */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Datos del Cliente
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Nombre completo"
                            value={posCustomer.name}
                            onChange={(e) =>
                              setPosCustomer({ ...posCustomer, name: e.target.value })
                            }
                            className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <input
                            type="text"
                            placeholder="WhatsApp (ej. 310...)"
                            value={posCustomer.phone}
                            onChange={(e) =>
                              setPosCustomer({ ...posCustomer, phone: e.target.value })
                            }
                            className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Barrio / Dirección en Bogotá"
                          value={posCustomer.address}
                          onChange={(e) =>
                            setPosCustomer({ ...posCustomer, address: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Método de pago y estado de producción */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Método de Pago
                          </label>
                          <select
                            value={posPayment}
                            onChange={(e) => setPosPayment(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          >
                            <option>Nequi / Daviplata</option>
                            <option>Bold Datáfono</option>
                            <option>Transferencia PSE</option>
                            <option>Efectivo</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Estado Inicial
                          </label>
                          <select
                            value={posOrderStatus}
                            onChange={(e) => setPosOrderStatus(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Descuento y Factura Electrónica DIAN */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-600 font-medium">Descuento $:</label>
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={posDiscount}
                            onChange={(e) => setPosDiscount(e.target.value)}
                            className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                          />
                        </div>

                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={posEmitDian}
                            onChange={(e) => setPosEmitDian(e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            Factura DIAN (CUFE)
                          </span>
                        </label>
                      </div>

                      {/* Totales */}
                      <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Subtotal</span>
                          <span>{formatCOP(posSubtotal)}</span>
                        </div>
                        {Number(posDiscount) > 0 && (
                          <div className="flex justify-between text-xs text-emerald-400">
                            <span>Descuento</span>
                            <span>-{formatCOP(posDiscount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-extrabold pt-1 border-t border-slate-800">
                          <span>Total a Cobrar</span>
                          <span className="text-emerald-400">{formatCOP(posTotal)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCompletePosSale}
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Registrar Venta y Generar Tirilla
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Sub-vista: Historial de Ventas y Pedidos */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          <th className="py-3.5 px-4">Pedido / Fecha</th>
                          <th className="py-3.5 px-4">Cliente / Entrega</th>
                          <th className="py-3.5 px-4">Detalle</th>
                          <th className="py-3.5 px-4">Pago</th>
                          <th className="py-3.5 px-4">Estado Producción</th>
                          <th className="py-3.5 px-4 text-right">Total</th>
                          <th className="py-3.5 px-4 text-center">Tirilla / DIAN</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {appData.orders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/80">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-900 block">{order.id}</span>
                              <span className="text-slate-400 text-[11px]">{order.date}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">
                                {order.customerName}
                              </span>
                              <span className="text-slate-500 text-[11px]">
                                {order.customerAddress}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <p className="text-slate-700 truncate">
                                {order.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                              </p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                {order.source}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-700">
                              {order.paymentMethod}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg font-semibold border text-xs ${
                                  order.status === 'Entregado'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : order.status === 'Listo'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    : order.status === 'Imprimiendo'
                                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {ORDER_STATUSES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                              {formatCOP(order.total)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedInvoiceModal(order)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 font-semibold transition"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                {order.dianInvoice ? order.dianInvoice.number : 'Ver'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------
              3. MÓDULO CALCULADORA DE COSTOS 3D (INTEGRADA AL INVENTARIO)
          ---------------------------------------------------------------- */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Calculadora de Costos 3D Multi-Filamento (AMS)
                </h2>
                <p className="text-sm text-slate-500">
                  Calcula costos reales con tus bobinas de inventario, purgas de cambio de color, energía Bogotá ({formatCOP(appData.config.kwhPrice)}/kWh) y márgenes.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Panel Izquierdo: Parámetros de Impresión (7 columnas) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Datos de la Pieza y Tiempo */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <Printer className="w-4 h-4 text-indigo-600" />
                      1. Datos del Proyecto y Tiempo de Máquina
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Nombre de la Pieza / Producto
                        </label>
                        <input
                          type="text"
                          value={calcProjectName}
                          onChange={(e) => setCalcProjectName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Categoría en Catálogo
                        </label>
                        <select
                          value={calcCategory}
                          onChange={(e) => setCalcCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                        >
                          {CATEGORIES.filter((c) => c !== 'Todas').map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Horas de Impresión
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={calcHours}
                          onChange={(e) => setCalcHours(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Minutos
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={calcMinutes}
                          onChange={(e) => setCalcMinutes(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Tasa Fallo / Riesgo (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={calcFailureRate}
                          onChange={(e) => setCalcFailureRate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filamentos Multi-Color AMS */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        2. Filamentos Utilizados (Hasta 4 colores AMS)
                      </h3>
                      <button
                        onClick={addCalcSlot}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Añadir Color
                      </button>
                    </div>

                    <div className="space-y-3">
                      {calcSlots.map((slot, idx) => {
                        const fil = appData.filaments.find((f) => f.id === slot.filamentId);
                        const costPerGram = fil ? fil.rollCost / fil.initialWeight : 0;
                        const slotTotalGrams =
                          Number(slot.partGrams || 0) + Number(slot.purgeGrams || 0);

                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <span
                                  className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                                  style={{ backgroundColor: fil?.colorHex || '#6366f1' }}
                                ></span>
                                <select
                                  value={slot.filamentId}
                                  onChange={(e) =>
                                    updateCalcSlot(idx, 'filamentId', e.target.value)
                                  }
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                                >
                                  {appData.filaments.map((f) => (
                                    <option key={f.id} value={f.id}>
                                      {f.brand} {f.material} — {f.colorName} ({formatCOP(f.rollCost / f.initialWeight)}/g)
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {calcSlots.length > 1 && (
                                <button
                                  onClick={() => removeCalcSlot(idx)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-2.5 items-center">
                              <div>
                                <label className="block text-[11px] text-slate-500 mb-0.5">
                                  Gramos Pieza (g)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={slot.partGrams}
                                  onChange={(e) =>
                                    updateCalcSlot(idx, 'partGrams', e.target.value)
                                  }
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-slate-500 mb-0.5">
                                  Purga / Torre (g)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={slot.purgeGrams}
                                  onChange={(e) =>
                                    updateCalcSlot(idx, 'purgeGrams', e.target.value)
                                  }
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                                />
                              </div>
                              <div className="text-right">
                                <span className="block text-[11px] text-slate-400">
                                  {slotTotalGrams}g total
                                </span>
                                <span className="text-xs font-extrabold text-slate-800">
                                  {formatCOP(slotTotalGrams * costPerGram)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Insumos Adicionales y Empaques */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-indigo-600" />
                      3. Herrajes, Imanes y Empaque
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {appData.supplies.map((sup) => {
                        const selected = calcSelectedSupplies.find((s) => s.supplyId === sup.id);
                        return (
                          <div
                            key={sup.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                              selected
                                ? 'border-indigo-500 bg-indigo-50/50'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={!!selected}
                                onChange={() => toggleCalcSupply(sup.id)}
                                className="rounded text-indigo-600"
                              />
                              <div className="truncate">
                                <p className="text-xs font-semibold text-slate-800 truncate">
                                  {sup.name}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {formatCOP(sup.unitCost)} c/u
                                </p>
                              </div>
                            </label>
                            {selected && (
                              <input
                                type="number"
                                min="1"
                                value={selected.qty}
                                onChange={(e) => updateCalcSupplyQty(sup.id, e.target.value)}
                                className="w-14 px-2 py-1 rounded-lg border border-indigo-300 text-xs font-bold text-center bg-white"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Panel Derecho: Desglose de Costos y Precios Sugeridos (5 columnas) */}
                <div className="lg:col-span-5">
                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg sticky top-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
                          Estructura de Costos
                        </span>
                        <h3 className="text-lg font-bold mt-0.5 truncate max-w-[260px]">
                          {calcProjectName || 'Nueva Pieza 3D'}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Peso Total</span>
                        <span className="font-bold text-sm text-emerald-400">
                          {calcBreakdown.totalGrams}g ({calcBreakdown.totalPurgeGrams}g purga)
                        </span>
                      </div>
                    </div>

                    {/* Desglose línea por línea */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Filamento ({calcBreakdown.totalGrams}g)</span>
                        <span className="font-semibold">{formatCOP(calcBreakdown.filamentCost)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>
                          Energía ({appData.config.printerPowerKw}kW × {calcBreakdown.totalHours.toFixed(2)}h)
                        </span>
                        <span className="font-semibold">{formatCOP(calcBreakdown.energyCost)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Desgaste y amortización máquina</span>
                        <span className="font-semibold">{formatCOP(calcBreakdown.machineCost)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Insumos y empaque</span>
                        <span className="font-semibold">{formatCOP(calcBreakdown.suppliesCost)}</span>
                      </div>
                      <div className="flex justify-between text-amber-300">
                        <span>Colchón de fallos ({calcFailureRate}%)</span>
                        <span className="font-semibold">{formatCOP(calcBreakdown.failureBuffer)}</span>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                        <span>Costo Total de Producción</span>
                        <span className="text-lg text-white">
                          {formatCOP(calcBreakdown.totalProductionCost)}
                        </span>
                      </div>
                    </div>

                    {/* Sliders de Márgenes */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Margen Venta al Detal</span>
                          <span className="font-bold text-emerald-400">{calcRetailMargin}%</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="300"
                          step="5"
                          value={calcRetailMargin}
                          onChange={(e) => setCalcRetailMargin(e.target.value)}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Margen Por Mayor (6+ uds)</span>
                          <span className="font-bold text-indigo-400">{calcWholesaleMargin}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="200"
                          step="5"
                          value={calcWholesaleMargin}
                          onChange={(e) => setCalcWholesaleMargin(e.target.value)}
                          className="w-full accent-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Tarjetas de Precios Finales */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                        <span className="text-[11px] font-semibold text-emerald-300 block">
                          Precio Sugerido Detal
                        </span>
                        <span className="text-xl font-extrabold text-emerald-400 block mt-0.5">
                          {formatCOP(calcBreakdown.suggestedRetailPrice)}
                        </span>
                        <span className="text-[10px] text-emerald-200/80">
                          Utilidad: +{formatCOP(calcBreakdown.retailProfit)}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
                        <span className="text-[11px] font-semibold text-indigo-300 block">
                          Precio Por Mayor
                        </span>
                        <span className="text-xl font-extrabold text-indigo-300 block mt-0.5">
                          {formatCOP(calcBreakdown.suggestedWholesalePrice)}
                        </span>
                        <span className="text-[10px] text-indigo-200/80">
                          Redondeado COP $500
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcDeductFilament}
                        onChange={(e) => setCalcDeductFilament(e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span>Descontar estos gramos del inventario de bobinas al guardar</span>
                    </label>

                    <button
                      onClick={handleSaveCalculatedProduct}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Guardar como Producto en el Catálogo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              4. MÓDULO INVENTARIO DE FILAMENTOS Y MATERIALES
          ---------------------------------------------------------------- */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Inventario de Filamentos e Insumos
                  </h2>
                  <p className="text-sm text-slate-500">
                    Control de gramos restantes por bobina, costo por gramo y stock de herrajes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1 rounded-xl bg-slate-200/80">
                    <button
                      onClick={() => setInvSubTab('filaments')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                        invSubTab === 'filaments'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Bobinas ({appData.filaments.length})
                    </button>
                    <button
                      onClick={() => setInvSubTab('supplies')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                        invSubTab === 'supplies'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Insumos y Empaques ({appData.supplies.length})
                    </button>
                  </div>

                  {invSubTab === 'filaments' && (
                    <button
                      onClick={() => setShowFilamentModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva Bobina
                    </button>
                  )}
                </div>
              </div>

              {invSubTab === 'filaments' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appData.filaments.map((fil) => {
                    const pct = Math.round((fil.remainingWeight / fil.initialWeight) * 100);
                    const isLow = fil.remainingWeight < 200;
                    const costPerGram = fil.rollCost / fil.initialWeight;

                    return (
                      <div
                        key={fil.id}
                        className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between ${
                          isLow ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full border-2 border-slate-200 shadow-inner shrink-0"
                                style={{ backgroundColor: fil.colorHex }}
                              ></div>
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                                  {fil.brand} • {fil.material}
                                </span>
                                <h3 className="font-bold text-slate-900 text-sm">
                                  {fil.colorName}
                                </h3>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {fil.amsSlot}
                            </span>
                          </div>

                          {/* Barra de progreso de gramos */}
                          <div className="mt-5">
                            <div className="flex justify-between items-baseline mb-1.5">
                              <span
                                className={`text-sm font-extrabold ${
                                  isLow ? 'text-rose-600' : 'text-slate-900'
                                }`}
                              >
                                {fil.remainingWeight}g{' '}
                                <span className="text-xs font-normal text-slate-400">
                                  / {fil.initialWeight}g
                                </span>
                              </span>
                              <span
                                className={`text-xs font-bold ${
                                  isLow ? 'text-rose-600' : 'text-emerald-600'
                                }`}
                              >
                                {pct}%
                              </span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isLow
                                    ? 'bg-rose-500'
                                    : pct < 45
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                            {isLow && (
                              <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Stock bajo (&lt;200g). Pedir repuesto pronto.
                              </p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                            <span>Costo rollo: {formatCOP(fil.rollCost)}</span>
                            <span className="font-bold text-slate-700">
                              {formatCOP(costPerGram)} / gramo
                            </span>
                          </div>
                        </div>

                        {/* Controles rápidos de ajuste o recarga */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAdjustFilamentGrams(fil.id, -25)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                              title="Descontar 25g de uso"
                            >
                              -25g
                            </button>
                            <button
                              onClick={() => handleAdjustFilamentGrams(fil.id, 25)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                            >
                              +25g
                            </button>
                          </div>

                          <button
                            onClick={() => handleRefillFilament(fil.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Rollo Nuevo
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Pestaña Secundaria: Insumos y Empaques */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {appData.supplies.map((sup) => (
                      <div
                        key={sup.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{sup.name}</h4>
                          <p className="text-xs text-slate-500">
                            Costo unitario: <strong className="text-slate-700">{formatCOP(sup.unitCost)}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              sup.stock < 30
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {sup.stock} unidades
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAdjustSupplyStock(sup.id, -5)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleAdjustSupplyStock(sup.id, 10)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold"
                            >
                              +10
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------
              5. MÓDULO CATÁLOGO PÚBLICO Y CHECKOUT WHATSAPP
          ---------------------------------------------------------------- */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              <div className="bg-indigo-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1">
                    <Smartphone className="w-3.5 h-3.5" />
                    Vista Previa Tienda Online en Tiempo Real
                  </span>
                  <h2 className="text-xl font-bold">
                    Así ven tus clientes tu catálogo desde su celular
                  </h2>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Cualquier producto que agregues en la Calculadora 3D aparece aquí automáticamente y envía pedidos al POS.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Escaparate Público (7 columnas) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Banner de tienda */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-md">
                    <h3 className="text-2xl font-extrabold">{appData.config.businessName}</h3>
                    <p className="text-sm text-indigo-100 mt-1">
                      Regalos personalizados, llaveros articulados y figuras 3D hechas en Bogotá 🇨🇴
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 text-xs">
                      <span className="px-3 py-1 rounded-full bg-white/15 font-medium">
                        🚚 Envíos Bogotá mismo día / siguiente día
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/15 font-medium">
                        💳 Nequi • Daviplata • Bold • PSE
                      </span>
                    </div>
                  </div>

                  {/* Filtro de categorías tienda */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setStoreCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                          storeCategory === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Tarjetas de producto para el cliente */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {appData.products
                      .filter((p) => storeCategory === 'Todas' || p.category === storeCategory)
                      .map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            {/* Ilustración visual generada con color del filamento */}
                            <div
                              className="h-28 flex items-center justify-center relative"
                              style={{
                                background: `linear-gradient(135deg, ${prod.colorHex}22, ${prod.colorHex}55)`,
                              }}
                            >
                              <div
                                className="w-14 h-14 rounded-2xl shadow-md flex items-center justify-center text-white"
                                style={{ backgroundColor: prod.colorHex }}
                              >
                                <Box className="w-7 h-7" />
                              </div>
                              <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 text-[11px] font-bold text-slate-800 shadow-sm">
                                {prod.stock > 0 ? 'Disponible' : 'Bajo pedido (24h)'}
                              </span>
                            </div>

                            <div className="p-4">
                              <span className="text-[11px] font-semibold text-indigo-600">
                                {prod.category}
                              </span>
                              <h4 className="font-bold text-slate-900 text-base mt-0.5">
                                {prod.name}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">{prod.description}</p>
                            </div>
                          </div>

                          <div className="px-4 pb-4 pt-2 flex items-center justify-between">
                            <span className="text-lg font-extrabold text-slate-900">
                              {formatCOP(prod.price)}
                            </span>
                            <button
                              onClick={() => addToStoreCart(prod)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                            >
                              <Plus className="w-4 h-4" />
                              Agregar
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Checkout WhatsApp del Cliente (5 columnas) */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        Tu Carrito de Pedido
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {storeCart.reduce((acc, i) => acc + i.qty, 0)} ítems
                      </span>
                    </div>

                    {storeCart.length === 0 ? (
                      <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500">
                          Agrega productos del catálogo para probar el pedido por WhatsApp.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {storeCart.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-emerald-700 font-semibold">
                                {formatCOP(item.price * item.qty)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  setStoreCart((prev) =>
                                    prev
                                      .map((i) =>
                                        i.productId === item.productId
                                          ? { ...i, qty: Math.max(0, i.qty - 1) }
                                          : i
                                      )
                                      .filter((i) => i.qty > 0)
                                  )
                                }
                                className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-xs font-bold">{item.qty}</span>
                              <button
                                onClick={() =>
                                  setStoreCart((prev) =>
                                    prev.map((i) =>
                                      i.productId === item.productId
                                        ? { ...i, qty: i.qty + 1 }
                                        : i
                                    )
                                  )
                                }
                                className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulario de envío cliente */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-700">Datos para la entrega</p>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        value={storeCustomer.name}
                        onChange={(e) =>
                          setStoreCustomer({ ...storeCustomer, name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Celular / WhatsApp"
                        value={storeCustomer.phone}
                        onChange={(e) =>
                          setStoreCustomer({ ...storeCustomer, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Barrio y dirección en Bogotá"
                        value={storeCustomer.neighborhood}
                        onChange={(e) =>
                          setStoreCustomer({ ...storeCustomer, neighborhood: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Personalización (color, nombre, nota)"
                        value={storeCustomer.notes}
                        onChange={(e) =>
                          setStoreCustomer({ ...storeCustomer, notes: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Total Pedido</span>
                      <span className="text-xl font-extrabold text-slate-900">
                        {formatCOP(storeTotal)}
                      </span>
                    </div>

                    <button
                      onClick={handlePlaceWhatsappOrder}
                      className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-slate-950 font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Pedir por WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              6. MÓDULO CONFIGURACIÓN Y FACTURACIÓN ELECTRÓNICA DIAN
          ---------------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Configuración del Taller y Facturación DIAN
                </h2>
                <p className="text-sm text-slate-500">
                  Parámetros de energía, desgaste de impresora, márgenes y conexión tributaria Colombia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Datos del negocio y máquina */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    Parámetros Operativos y Energía
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Nombre Comercial del Taller
                    </label>
                    <input
                      type="text"
                      value={appData.config.businessName}
                      onChange={(e) =>
                        setAppData({
                          ...appData,
                          config: { ...appData.config, businessName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        NIT / RUT
                      </label>
                      <input
                        type="text"
                        value={appData.config.nit}
                        onChange={(e) =>
                          setAppData({
                            ...appData,
                            config: { ...appData.config, nit: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        WhatsApp Pedidos
                      </label>
                      <input
                        type="text"
                        value={appData.config.whatsapp}
                        onChange={(e) =>
                          setAppData({
                            ...appData,
                            config: { ...appData.config, whatsapp: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Tarifa Energía (COP/kWh)
                      </label>
                      <input
                        type="number"
                        value={appData.config.kwhPrice}
                        onChange={(e) =>
                          setAppData({
                            ...appData,
                            config: { ...appData.config, kwhPrice: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Desgaste Máquina (COP/h)
                      </label>
                      <input
                        type="number"
                        value={appData.config.printerDepreciationPerHour}
                        onChange={(e) =>
                          setAppData({
                            ...appData,
                            config: {
                              ...appData.config,
                              printerDepreciationPerHour: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Facturación Electrónica DIAN */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Facturación Electrónica DIAN
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      Habilitado
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Proveedor Tecnológico / Puente API
                    </label>
                    <select
                      value={appData.config.dianProvider}
                      onChange={(e) =>
                        setAppData({
                          ...appData,
                          config: { ...appData.config, dianProvider: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      <option>Alegra / Siigo API</option>
                      <option>Facturatech Colombia</option>
                      <option>Software Propio DIAN (XML UBL 2.1)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Número Resolución DIAN
                    </label>
                    <input
                      type="text"
                      value={appData.config.dianResolution}
                      onChange={(e) =>
                        setAppData({
                          ...appData,
                          config: { ...appData.config, dianResolution: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Prefijo Autorizado
                      </label>
                      <input
                        type="text"
                        value={appData.config.dianPrefix}
                        onChange={(e) =>
                          setAppData({
                            ...appData,
                            config: { ...appData.config, dianPrefix: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Consecutivo Actual
                      </label>
                      <input
                        type="number"
                        value={appData.config.nextInvoiceNumber}
                        onChange={(e) =>
                          setAppData({
                            ...appData,
                            config: {
                              ...appData.config,
                              nextInvoiceNumber: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('Configuración guardada localmente')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ====================================================================
          BARRA INFERIOR DE NAVEGACIÓN (MÓVIL)
      ==================================================================== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 flex justify-around py-1.5 px-1 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition relative ${
                isActive ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[58px]">{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute top-0.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ====================================================================
          MODAL 1: AGREGAR NUEVA BOBINA DE FILAMENTO
      ==================================================================== */}
      {showFilamentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Registrar Nueva Bobina</h3>
              <button
                onClick={() => setShowFilamentModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFilament} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Marca</label>
                  <select
                    value={newFilamentForm.brand}
                    onChange={(e) =>
                      setNewFilamentForm({ ...newFilamentForm, brand: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option>Bambu Lab</option>
                    <option>eSUN</option>
                    <option>Sunlu</option>
                    <option>Creality</option>
                    <option>Polymaker</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Material</label>
                  <select
                    value={newFilamentForm.material}
                    onChange={(e) =>
                      setNewFilamentForm({ ...newFilamentForm, material: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option>PLA Basic</option>
                    <option>PLA+</option>
                    <option>PLA Silk</option>
                    <option>PETG</option>
                    <option>TPU 95A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">
                    Nombre del Color
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Verde Esmeralda"
                    value={newFilamentForm.colorName}
                    onChange={(e) =>
                      setNewFilamentForm({ ...newFilamentForm, colorName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Muestra</label>
                  <input
                    type="color"
                    value={newFilamentForm.colorHex}
                    onChange={(e) =>
                      setNewFilamentForm({ ...newFilamentForm, colorHex: e.target.value })
                    }
                    className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">
                    Peso Neto (gramos)
                  </label>
                  <input
                    type="number"
                    value={newFilamentForm.initialWeight}
                    onChange={(e) =>
                      setNewFilamentForm({
                        ...newFilamentForm,
                        initialWeight: e.target.value,
                        remainingWeight: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">
                    Costo Rollo (COP)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={newFilamentForm.rollCost}
                    onChange={(e) =>
                      setNewFilamentForm({ ...newFilamentForm, rollCost: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Ubicación / Slot</label>
                <select
                  value={newFilamentForm.amsSlot}
                  onChange={(e) =>
                    setNewFilamentForm({ ...newFilamentForm, amsSlot: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option>Estante</option>
                  <option>AMS 1</option>
                  <option>AMS 2</option>
                  <option>AMS 3</option>
                  <option>AMS 4</option>
                  <option>Secadora</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilamentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Guardar Bobina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: TIRILLA DE VENTA / FACTURA ELECTRÓNICA DIAN
      ==================================================================== */}
      {selectedInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {appData.config.businessName}
                </h3>
                <p className="text-slate-500">NIT: {appData.config.nit}</p>
                <p className="text-slate-500">{appData.config.city}</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-slate-700">
              <p>
                <strong>Comprobante:</strong> {selectedInvoiceModal.id}
              </p>
              {selectedInvoiceModal.dianInvoice && (
                <p className="text-emerald-700 font-bold">
                  Factura Electrónica: {selectedInvoiceModal.dianInvoice.number}
                </p>
              )}
              <p>
                <strong>Fecha:</strong> {selectedInvoiceModal.date}
              </p>
              <p>
                <strong>Cliente:</strong> {selectedInvoiceModal.customerName}
              </p>
              <p>
                <strong>Entrega:</strong> {selectedInvoiceModal.customerAddress}
              </p>
              <p>
                <strong>Pago:</strong> {selectedInvoiceModal.paymentMethod}
              </p>
            </div>

            <div className="border-y border-dashed border-slate-300 py-3 space-y-2">
              {selectedInvoiceModal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-bold">{formatCOP(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-bold text-slate-900">
              <span>TOTAL PAGADO</span>
              <span>{formatCOP(selectedInvoiceModal.total)}</span>
            </div>

            {selectedInvoiceModal.dianInvoice && (
              <div className="p-2.5 rounded-lg bg-slate-100 text-[10px] break-all text-slate-600">
                <strong className="block text-slate-800 mb-0.5">CUFE DIAN VALIDADO:</strong>
                {selectedInvoiceModal.dianInvoice.cufe}
              </div>
            )}

            <button
              onClick={() => setSelectedInvoiceModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-sans font-bold text-xs"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: VISTA PREVIA DE MENSAJE WHATSAPP GENERADO
      ==================================================================== */}
      {whatsappPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                Pedido #{whatsappPreviewModal.orderId} Listo
              </h3>
              <button
                onClick={() => setWhatsappPreviewModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              El pedido ya quedó guardado en tu <strong>POS y Cola de Impresión</strong>. Así se enviará el mensaje al chat de WhatsApp:
            </p>

            <pre className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-800 whitespace-pre-wrap font-sans">
              {whatsappPreviewModal.messageText}
            </pre>

            <div className="flex gap-2">
              <a
                href={whatsappPreviewModal.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir WhatsApp (wa.me)
              </a>
              <button
                onClick={() => setWhatsappPreviewModal(null)}
                className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}