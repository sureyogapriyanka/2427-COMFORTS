import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, BarChart3, Boxes, History, Package, RefreshCw, Search, ShoppingBag, Users } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { apiRequest } from '../lib/api';
import { formatINR } from '../data/catalog';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { ProductImage } from '../components/product/ProductImage';

interface AdminSummary {
  products: number;
  categories: number;
  customers: number;
  orders: number;
  paidRevenue: number;
}

interface AdminProduct {
  _id: string;
  catalogId?: string;
  name: string;
  sku: string;
  category: string;
  sizes: string[];
  images: string[];
  sizeInventory?: { size: string; quantity: number }[];
  lowStockThreshold?: number;
  isDemoContent: boolean;
  inventoryStatus: 'unconfirmed' | 'low_stock' | 'out_of_stock' | 'in_stock';
}

interface InventorySummary {
  totalProducts: number;
  confirmedStockUnits: number;
  lowStockVariants: number;
  soldOutVariants: number;
  unconfirmedVariants: number;
}

interface InventoryResponse {
  products: AdminProduct[];
  summary: InventorySummary;
  categories: string[];
  sizes: string[];
}

interface InventoryHistoryEntry {
  productId: string;
  catalogId?: string;
  sku: string;
  productName: string;
  size: string;
  previousQuantity: number | null;
  newQuantity: number;
  reason: string;
  adminId: string;
  adminEmail: string;
  createdAt: string;
}

interface AdminOrder {
  _id: string;
  orderNumber: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface AdminCategory {
  _id: string;
  title: string;
  slug: string;
  gender: string;
}

function AdminInventoryProduct({
  product,
  onAdjust,
  onThresholdChange,
}: {
  product: AdminProduct;
  onAdjust: (id: string, body: { size: string; quantity?: number; adjustment?: number; reason: string }) => Promise<void>;
  onThresholdChange: (id: string, threshold: number) => Promise<void>;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? '');
  const [quantity, setQuantity] = useState(String(
    product.sizeInventory?.find((variant) => variant.size === product.sizes[0])?.quantity ?? '',
  ));
  const [restockAmount, setRestockAmount] = useState('1');
  const [reason, setReason] = useState('');
  const [threshold, setThreshold] = useState(String(product.lowStockThreshold ?? 10));
  const inventory = useMemo(
    () => Object.fromEntries((product.sizeInventory ?? []).map(({ size, quantity: count }) => [size, count])),
    [product.sizeInventory],
  );
  const hasUnconfirmedVariant = product.isDemoContent !== false ||
    product.sizes.some((size) => inventory[size] === undefined);
  const sizeQuantity = inventory[selectedSize];
  const statusLabel = product.isDemoContent !== false || selectedSize && sizeQuantity === undefined
    ? 'Unconfirmed'
    : sizeQuantity === 0
      ? 'Sold Out'
      : sizeQuantity !== undefined && sizeQuantity <= (product.lowStockThreshold ?? 10)
        ? `Low stock · ${sizeQuantity} left`
        : 'Confirmed';
  const disabled = product.isDemoContent !== false || !selectedSize;

  const saveQuantity = async () => {
    const parsed = Number(quantity);
    if (!quantity.trim() || !Number.isSafeInteger(parsed) || parsed < 0 || !reason.trim()) return;
    await onAdjust(product._id, { size: selectedSize, quantity: parsed, reason: reason.trim() });
    setQuantity('');
    setReason('');
  };

  const restock = async () => {
    const parsed = Number(restockAmount);
    if (!Number.isSafeInteger(parsed) || parsed < 1 || !reason.trim()) return;
    if (!window.confirm(`Add ${parsed} unit(s) to ${product.name} in size ${selectedSize}?`)) return;
    await onAdjust(product._id, { size: selectedSize, adjustment: parsed, reason: reason.trim() });
    setReason('');
  };

  return (
    <article className="grid gap-4 border-t border-[#EEE7DE] py-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
      <div className="flex min-w-0 items-start gap-3">
        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-elan-ivory">
          <ProductImage src={product.images?.[0] ?? ''} alt={`${product.name} product`} className="h-full w-full object-contain p-1" />
        </div>
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-elan-ink">{product.name}</h3>
          <p className="mt-1 break-all text-xs text-elan-muted">{product.sku}{product.catalogId ? ` · ${product.catalogId}` : ''}</p>
          <p className="mt-1 text-xs text-elan-muted">{product.category}</p>
          <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
            product.inventoryStatus === 'out_of_stock'
              ? 'bg-red-50 text-red-800'
              : product.inventoryStatus === 'low_stock'
                ? 'bg-amber-50 text-amber-900'
                : 'bg-elan-ivory text-elan-muted'
          }`}>
            {product.isDemoContent !== false ? 'Unconfirmed' : product.inventoryStatus.replaceAll('_', ' ')}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2" aria-label={`${product.name} size inventory`}>
          {product.sizes.map((size) => {
            const count = inventory[size];
            const label = product.isDemoContent || count === undefined
              ? 'Unconfirmed'
              : count === 0
                ? 'Sold Out'
                : count <= (product.lowStockThreshold ?? 10)
                  ? `Low · ${count}`
                  : String(count);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={selectedSize === size}
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity(count === undefined ? '' : String(count));
                }}
                className={`rounded-lg border px-2.5 py-2 text-left text-xs ${
                  selectedSize === size ? 'border-elan-ink bg-elan-ink text-white' : 'border-[#E8E1D7] bg-white text-elan-ink'
                }`}
              >
                <span className="block font-semibold">{size}</span>
                <span className="mt-0.5 block text-[10px]">{label}</span>
              </button>
            );
          })}
          {!product.sizes.length && <span className="text-xs text-elan-muted">No size variants configured.</span>}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-elan-ink">
            Set confirmed quantity
            <input
              aria-label={`Set quantity for ${product.name} size ${selectedSize}`}
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled={disabled}
              className="mt-1.5 h-10 w-full rounded-lg border border-[#D8D0C5] px-3 text-sm disabled:bg-elan-ivory"
            />
          </label>
          <label className="text-xs font-medium text-elan-ink">
            Restock quantity
            <input
              aria-label={`Restock amount for ${product.name} size ${selectedSize}`}
              type="number"
              min="1"
              step="1"
              value={restockAmount}
              onChange={(event) => setRestockAmount(event.target.value)}
              disabled={disabled}
              className="mt-1.5 h-10 w-full rounded-lg border border-[#D8D0C5] px-3 text-sm disabled:bg-elan-ivory"
            />
          </label>
        </div>
        <label className="mt-3 block text-xs font-medium text-elan-ink">
          Adjustment reason
          <input
            aria-label={`Reason for ${product.name} inventory update`}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={300}
            disabled={disabled}
            placeholder="Required for the stock history"
            className="mt-1.5 h-10 w-full rounded-lg border border-[#D8D0C5] px-3 text-sm disabled:bg-elan-ivory"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => void saveQuantity()} disabled={disabled || !quantity.trim() || !reason.trim()} className="min-h-10 rounded-lg bg-elan-ink px-4 text-xs font-semibold text-elan-ivory disabled:cursor-not-allowed disabled:opacity-50">
            Save quantity
          </button>
          <button type="button" onClick={() => void restock()} disabled={disabled || !reason.trim()} className="min-h-10 rounded-lg border border-[#D8D0C5] bg-white px-4 text-xs font-semibold text-elan-ink disabled:cursor-not-allowed disabled:opacity-50">
            Confirm restock
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-elan-muted">
          {product.isDemoContent !== false
            ? 'Preview product inventory is unconfirmed. Approved product data is required before stock can be entered.'
            : `${statusLabel}. Threshold: ${product.lowStockThreshold ?? 10}.`}
          {hasUnconfirmedVariant && !product.isDemoContent ? ' Some size variants remain unconfirmed.' : ''}
        </p>
        {product.isDemoContent === false && (
          <div className="mt-2 flex items-end gap-2">
            <label className="text-[11px] font-medium text-elan-muted">
              Low-stock threshold
              <input
                aria-label={`Low-stock threshold for ${product.name}`}
                type="number"
                min="1"
                max="10000"
                step="1"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
                className="mt-1 block h-9 w-28 rounded-lg border border-[#D8D0C5] px-2 text-sm text-elan-ink"
              />
            </label>
            <button type="button" onClick={() => {
              const parsed = Number(threshold);
              if (Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= 10000) {
                void onThresholdChange(product._id, parsed);
              }
            }} className="min-h-9 rounded-lg border border-[#D8D0C5] px-3 text-[11px] font-semibold text-elan-ink">
              Save threshold
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { openOverlay } = useStore();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [inventory, setInventory] = useState<InventoryResponse | null>(null);
  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistoryEntry[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [inventorySuccess, setInventorySuccess] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (user?.role !== 'admin') return;
    setLoading(true);
    setError('');
    try {
      const [nextSummary, inventoryData, history, orderPage, nextCategories] = await Promise.all([
        apiRequest<AdminSummary>('/admin/overview'),
        apiRequest<InventoryResponse>('/admin/inventory?limit=100'),
        apiRequest<InventoryHistoryEntry[]>('/admin/inventory/history?limit=100'),
        apiRequest<AdminOrder[]>('/admin/orders?limit=50'),
        apiRequest<AdminCategory[]>('/admin/categories'),
      ]);
      setSummary(nextSummary);
      setInventory(inventoryData);
      setInventoryHistory(history);
      setOrders(orderPage);
      setCategories(nextCategories);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load the administrator dashboard.');
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (authLoading) return;
    if (user?.role === 'admin') {
      void loadDashboard();
    } else {
      setSummary(null);
      setInventory(null);
      setInventoryHistory([]);
      setOrders([]);
      setCategories([]);
      setError('');
      setLoading(false);
    }
  }, [authLoading, user?.role, loadDashboard]);

  const updateInventory = async (
    productId: string,
    adjustment: { size: string; quantity?: number; adjustment?: number; reason: string },
  ) => {
    try {
      await apiRequest(`/admin/products/${productId}/inventory`, {
        method: 'PATCH',
        body: JSON.stringify(adjustment),
      });
      setError('');
      setInventorySuccess('Inventory saved and added to the stock history.');
      await loadDashboard();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Inventory update failed.');
      setInventorySuccess('');
    }
  };

  const updateThreshold = async (productId: string, lowStockThreshold: number) => {
    try {
      await apiRequest(`/admin/products/${productId}/inventory/threshold`, {
        method: 'PATCH',
        body: JSON.stringify({ lowStockThreshold }),
      });
      setError('');
      setInventorySuccess('Low-stock threshold updated.');
      await loadDashboard();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Threshold update failed.');
      setInventorySuccess('');
    }
  };

  const updateOrderStatus = async (orderId: string, orderStatus: string) => {
    try {
      await apiRequest(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ orderStatus }),
      });
      await loadDashboard();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Order status update failed.');
    }
  };

  const summaryCards = summary ? [
    { label: 'Active products', value: summary.products, icon: Package },
    { label: 'Categories', value: summary.categories, icon: ShoppingBag },
    { label: 'Customer accounts', value: summary.customers, icon: Users },
    { label: 'Stored orders', value: summary.orders, icon: BarChart3 },
    { label: 'Recorded paid revenue', value: formatINR(summary.paidRevenue), icon: BarChart3 },
  ] : [];
  const visibleInventory = inventory?.products.filter((product) => {
    const query = inventorySearch.trim().toLowerCase();
    const matchesQuery = !query ||
      [product.name, product.sku, product.catalogId ?? ''].some((field) => field.toLowerCase().includes(query));
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesSize = !sizeFilter || product.sizes.includes(sizeFilter);
      const inventoryBySize = new Map((product.sizeInventory ?? []).map(({ size, quantity }) => [size, quantity]));
      const threshold = product.lowStockThreshold ?? 10;
      const matchesStatus = !statusFilter ||
        (statusFilter === 'unconfirmed'
          ? product.isDemoContent !== false || product.sizes.some((size) => inventoryBySize.get(size) === undefined)
          : statusFilter === 'low_stock'
            ? product.isDemoContent === false && product.sizes.some((size) => {
              const count = inventoryBySize.get(size);
              return count !== undefined && count > 0 && count <= threshold;
            })
            : statusFilter === 'out_of_stock'
              ? product.isDemoContent === false && product.sizes.length > 0 && product.sizes.every((size) => inventoryBySize.get(size) === 0)
              : product.inventoryStatus === statusFilter);
    return matchesQuery && matchesCategory && matchesSize && matchesStatus;
  }) ?? [];
  const inventorySummaryCards = inventory ? [
    { label: 'Products', value: inventory.summary.totalProducts, icon: Package },
    { label: 'Confirmed units', value: inventory.summary.confirmedStockUnits, icon: Boxes },
    { label: 'Low-stock sizes', value: inventory.summary.lowStockVariants, icon: AlertCircle },
    { label: 'Sold-out sizes', value: inventory.summary.soldOutVariants, icon: ShoppingBag },
    { label: 'Unconfirmed sizes', value: inventory.summary.unconfirmedVariants, icon: BarChart3 },
  ] : [];

  return (
    <div className="min-h-screen bg-elan-ivory py-10 sm:py-14">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-elan-sage">2427 ÉLAN</p>
            <h1 className="mt-2 font-display text-3xl text-elan-ink sm:text-4xl">Admin dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-elan-muted">
              Protected store operations for owner-provisioned administrators. Demo catalog prices and inventory are not approved for sale.
            </p>
          </div>
          {user?.role === 'admin' && (
            <button type="button" onClick={() => void loadDashboard()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8D0C5] bg-white px-4 text-sm font-semibold">
              <RefreshCw size={16} /> Refresh
            </button>
          )}
        </div>

        {error && (
          <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {authLoading ? (
          <p role="status" className="py-16 text-center text-sm text-elan-muted">Checking administrator access…</p>
        ) : !user ? (
          <section className="mt-8 rounded-2xl border border-[#E8E1D7] bg-white p-6 sm:p-8" aria-labelledby="admin-sign-in-heading">
            <h2 id="admin-sign-in-heading" className="font-display text-xl text-elan-ink">Administrator sign-in required</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-elan-muted">
              This dashboard is restricted to owner-provisioned administrator accounts. Public registration does not grant administrator access.
            </p>
            <button type="button" onClick={() => openOverlay('auth')} className="mt-5 min-h-11 rounded-xl bg-elan-ink px-5 text-sm font-semibold text-elan-ivory">
              Sign in
            </button>
          </section>
        ) : user.role !== 'admin' ? (
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8" role="status">
            <h2 className="font-display text-xl text-elan-ink">Administrator access is restricted</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6B5425]">
              This account does not have administrator permissions. Contact the store owner if access is required.
            </p>
          </section>
        ) : loading ? (
          <p role="status" className="py-16 text-center text-sm text-elan-muted">Loading dashboard data…</p>
        ) : summary ? (
          <>
            <section aria-label="Store overview" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {summaryCards.map(({ label, value, icon: Icon }) => (
                <article key={label} className="rounded-2xl border border-[#E8E1D7] bg-white p-5">
                  <Icon size={19} className="text-elan-sage" />
                  <p className="mt-4 text-xs text-elan-muted">{label}</p>
                  <p className="mt-1 text-xl font-semibold text-elan-ink">{value}</p>
                </article>
              ))}
            </section>

            <section className="mt-10 rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7" aria-labelledby="inventory-heading">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 id="inventory-heading" className="font-display text-2xl text-elan-ink">Inventory management</h2>
                  <p className="mt-1 max-w-3xl text-xs leading-5 text-elan-muted">Stock is recorded separately for each size. Demo products stay unconfirmed and cannot receive inventory until approved product data is supplied.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-elan-ivory px-3 py-2 text-xs text-elan-muted"><Search size={14} /> Search and filter inventory</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Inventory filters">
                <label className="text-xs font-medium text-elan-muted">
                  Product / SKU / ID
                  <input value={inventorySearch} onChange={(event) => setInventorySearch(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#D8D0C5] px-3 text-sm text-elan-ink" placeholder="Search inventory" />
                </label>
                <label className="text-xs font-medium text-elan-muted">
                  Category
                  <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#D8D0C5] bg-white px-3 text-sm text-elan-ink">
                    <option value="">All categories</option>
                    {(inventory?.categories ?? []).map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium text-elan-muted">
                  Size
                  <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#D8D0C5] bg-white px-3 text-sm text-elan-ink">
                    <option value="">All sizes</option>
                    {(inventory?.sizes ?? []).map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium text-elan-muted">
                  Inventory status
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#D8D0C5] bg-white px-3 text-sm text-elan-ink">
                    <option value="">All statuses</option>
                    <option value="low_stock">Low stock</option>
                    <option value="out_of_stock">Out of stock</option>
                    <option value="unconfirmed">Unconfirmed stock</option>
                    <option value="in_stock">In stock</option>
                  </select>
                </label>
              </div>
              {inventorySuccess && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-900">{inventorySuccess}</p>}
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Inventory summary">
                {inventorySummaryCards.map(({ label, value, icon: Icon }) => (
                  <article key={label} className="rounded-xl border border-[#EEE7DE] bg-[#FBFAF8] p-4">
                    <Icon size={17} className="text-elan-sage" />
                    <p className="mt-2 text-[11px] text-elan-muted">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-elan-ink">{value}</p>
                  </article>
                ))}
              </div>
              <div className="mt-4 divide-y divide-[#EEE7DE]">
                {visibleInventory.map((product) => (
                  <AdminInventoryProduct key={product._id} product={product} onAdjust={updateInventory} onThresholdChange={updateThreshold} />
                ))}
                {inventory && !visibleInventory.length && <p className="py-8 text-center text-sm text-elan-muted">{inventory.products.length ? 'No inventory products match these filters.' : 'No catalog products are stored yet.'}</p>}
              </div>
              {inventory && (
                <p className="mt-3 text-right text-xs text-elan-muted">Showing {visibleInventory.length} of {inventory.products.length} products on this inventory page.</p>
              )}
            </section>

            <section className="mt-8 rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7" aria-labelledby="inventory-history-heading">
              <div className="flex items-center gap-2">
                <History size={19} className="text-elan-sage" />
                <h2 id="inventory-history-heading" className="font-display text-2xl text-elan-ink">Stock adjustment history</h2>
              </div>
              <p className="mt-1 text-xs leading-5 text-elan-muted">Recent authorized changes are recorded atomically with the stock update.</p>
              <div className="mt-4 space-y-3">
                {inventoryHistory.map((entry, index) => (
                  <article key={`${entry.productId}-${entry.createdAt}-${entry.size}-${index}`} className="rounded-xl border border-[#EEE7DE] p-4">
                    <div className="flex flex-wrap justify-between gap-2">
                      <p className="text-sm font-semibold text-elan-ink">{entry.productName} · {entry.size}</p>
                      <time className="text-xs text-elan-muted" dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
                    </div>
                    <p className="mt-1 text-xs text-elan-muted">
                      {entry.previousQuantity === null ? 'Unconfirmed' : entry.previousQuantity}
                      {' → '}{entry.newQuantity} units · {entry.sku}{entry.catalogId ? ` · ${entry.catalogId}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-elan-ink">{entry.reason}</p>
                    <p className="mt-1 text-[11px] text-elan-muted">Updated by {entry.adminEmail}</p>
                  </article>
                ))}
                {!inventoryHistory.length && <p className="rounded-xl bg-elan-ivory p-4 text-sm text-elan-muted">No inventory adjustments have been recorded.</p>}
              </div>
            </section>

            <section className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7">
                <h2 className="font-display text-2xl text-elan-ink">Orders</h2>
                <div className="mt-4 space-y-3">
                  {orders.map((order) => (
                    <div key={order._id} className="rounded-xl border border-[#EEE7DE] p-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-sm font-semibold">{order.orderNumber}</span>
                        <span className="text-sm">{formatINR(order.total)}</span>
                      </div>
                      <p className="mt-1 text-xs text-elan-muted">{order.paymentStatus} · {new Date(order.createdAt).toLocaleDateString()}</p>
                      <label className="mt-3 flex items-center gap-2 text-xs text-elan-muted">
                        Status
                        <select
                          value={order.orderStatus}
                          onChange={(event) => void updateOrderStatus(order._id, event.target.value)}
                          className="min-h-10 rounded-lg border border-[#D8D0C5] px-2 text-sm text-elan-ink"
                        >
                          <option value={order.orderStatus}>{order.orderStatus}</option>
                          {order.orderStatus === 'placed' && <><option value="confirmed">confirmed</option><option value="cancelled">cancelled</option></>}
                          {order.orderStatus === 'confirmed' && <><option value="shipped">shipped</option><option value="cancelled">cancelled</option></>}
                          {order.orderStatus === 'shipped' && <option value="delivered">delivered</option>}
                        </select>
                      </label>
                    </div>
                  ))}
                  {!orders.length && <p className="rounded-xl bg-elan-ivory p-4 text-sm leading-6 text-elan-muted">No stored orders. Order placement remains disabled until fulfillment rules are approved.</p>}
                </div>
              </div>
              <div className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7">
                <h2 className="font-display text-2xl text-elan-ink">Categories</h2>
                <ul className="mt-4 divide-y divide-[#EEE7DE]">
                  {categories.map((category) => (
                    <li key={category._id} className="flex justify-between gap-3 py-3 text-sm">
                      <span>{category.title}</span>
                      <span className="text-xs text-elan-muted">{category.gender} · {category.slug}</span>
                    </li>
                  ))}
                  {!categories.length && <li className="py-6 text-sm text-elan-muted">No categories are stored yet.</li>}
                </ul>
              </div>
            </section>
          </>
        ) : user.role === 'admin' ? (
          <section className="mt-8 rounded-2xl border border-[#E8E1D7] bg-white p-6 text-center" role="status">
            <h2 className="font-display text-xl text-elan-ink">Dashboard data could not be loaded</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-elan-muted">
              {error || 'The administrator API returned no dashboard data.'} Check the server connection and try again.
            </p>
            <button type="button" onClick={() => void loadDashboard()} className="mt-5 min-h-11 rounded-xl border border-[#D8D0C5] bg-white px-4 text-sm font-semibold">
              Try again
            </button>
          </section>
        ) : null}
      </Container>
    </div>
  );
}
