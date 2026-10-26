import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, BarChart3, Package, RefreshCw, ShoppingBag, Users } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { apiRequest } from '../lib/api';
import { formatINR } from '../data/catalog';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

interface AdminSummary {
  products: number;
  categories: number;
  customers: number;
  orders: number;
  paidRevenue: number;
}

interface AdminProduct {
  _id: string;
  name: string;
  sku: string;
  price: number;
  inStock: boolean;
  stockCount?: number;
  isDemoContent: boolean;
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

export function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { openOverlay } = useStore();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (user?.role !== 'admin') return;
    setLoading(true);
    setError('');
    try {
      const [nextSummary, productPage, orderPage, nextCategories] = await Promise.all([
        apiRequest<AdminSummary>('/admin/overview'),
        apiRequest<AdminProduct[]>('/admin/products?limit=50'),
        apiRequest<AdminOrder[]>('/admin/orders?limit=50'),
        apiRequest<AdminCategory[]>('/admin/categories'),
      ]);
      setSummary(nextSummary);
      setProducts(productPage);
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
      setProducts([]);
      setOrders([]);
      setCategories([]);
      setError('');
      setLoading(false);
    }
  }, [authLoading, user?.role, loadDashboard]);

  const updateInventory = async (product: AdminProduct, input: string) => {
    const stockCount = Number(input);
    if (!Number.isInteger(stockCount) || stockCount < 0) {
      setError('Inventory must be a non-negative whole number.');
      return;
    }
    try {
      const updated = await apiRequest<AdminProduct>(`/admin/products/${product._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ stockCount, inStock: stockCount > 0 }),
      });
      setProducts((current) => current.map((item) => item._id === updated._id ? updated : item));
      setError('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Inventory update failed.');
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 sm:py-14">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#637666]">2427 ÉLAN</p>
            <h1 className="mt-2 font-display text-3xl text-[#1F2022] sm:text-4xl">Admin dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77736E]">
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
          <p role="status" className="py-16 text-center text-sm text-[#77736E]">Checking administrator access…</p>
        ) : !user ? (
          <section className="mt-8 rounded-2xl border border-[#E8E1D7] bg-white p-6 sm:p-8" aria-labelledby="admin-sign-in-heading">
            <h2 id="admin-sign-in-heading" className="font-display text-xl text-[#1F2022]">Administrator sign-in required</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#77736E]">
              This dashboard is restricted to owner-provisioned administrator accounts. Public registration does not grant administrator access.
            </p>
            <button type="button" onClick={() => openOverlay('auth')} className="mt-5 min-h-11 rounded-xl bg-[#1F2022] px-5 text-sm font-semibold text-white">
              Sign in
            </button>
          </section>
        ) : user.role !== 'admin' ? (
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8" role="status">
            <h2 className="font-display text-xl text-[#1F2022]">Administrator access is restricted</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6B5425]">
              This account does not have administrator permissions. Contact the store owner if access is required.
            </p>
          </section>
        ) : loading ? (
          <p role="status" className="py-16 text-center text-sm text-[#77736E]">Loading dashboard data…</p>
        ) : summary ? (
          <>
            <section aria-label="Store overview" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {summaryCards.map(({ label, value, icon: Icon }) => (
                <article key={label} className="rounded-2xl border border-[#E8E1D7] bg-white p-5">
                  <Icon size={19} className="text-[#637666]" />
                  <p className="mt-4 text-xs text-[#77736E]">{label}</p>
                  <p className="mt-1 text-xl font-semibold text-[#1F2022]">{value}</p>
                </article>
              ))}
            </section>

            <section className="mt-10 rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7">
              <h2 className="font-display text-2xl text-[#1F2022]">Inventory</h2>
              <p className="mt-1 text-xs leading-5 text-[#77736E]">Updates affect stored inventory only; no stock has been inferred from the demo catalog.</p>
              <div className="mt-5 divide-y divide-[#EEE7DE]">
                {products.map((product) => (
                  <div key={product._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1F2022]">{product.name}</p>
                      <p className="mt-1 text-xs text-[#77736E]">{product.sku} · {formatINR(product.price)}{product.isDemoContent ? ' · Demo catalog data; price and inventory unverified' : ''}</p>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-[#77736E]">
                      Units
                      <input
                        aria-label={`Inventory units for ${product.name}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={product.stockCount ?? 0}
                        disabled={product.isDemoContent}
                        className="h-10 w-24 rounded-lg border border-[#D8D0C5] px-3 text-sm text-[#1F2022]"
                        onBlur={(event) => {
                          if (Number(event.currentTarget.value) !== (product.stockCount ?? 0)) {
                            void updateInventory(product, event.currentTarget.value);
                          }
                        }}
                      />
                    </label>
                  </div>
                ))}
                {!products.length && <p className="py-8 text-center text-sm text-[#77736E]">No catalog products are stored yet. Products will appear here after they are added to the catalog.</p>}
              </div>
            </section>

            <section className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7">
                <h2 className="font-display text-2xl text-[#1F2022]">Orders</h2>
                <div className="mt-4 space-y-3">
                  {orders.map((order) => (
                    <div key={order._id} className="rounded-xl border border-[#EEE7DE] p-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-sm font-semibold">{order.orderNumber}</span>
                        <span className="text-sm">{formatINR(order.total)}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#77736E]">{order.paymentStatus} · {new Date(order.createdAt).toLocaleDateString()}</p>
                      <label className="mt-3 flex items-center gap-2 text-xs text-[#77736E]">
                        Status
                        <select
                          value={order.orderStatus}
                          onChange={(event) => void updateOrderStatus(order._id, event.target.value)}
                          className="min-h-10 rounded-lg border border-[#D8D0C5] px-2 text-sm text-[#1F2022]"
                        >
                          <option value={order.orderStatus}>{order.orderStatus}</option>
                          {order.orderStatus === 'placed' && <><option value="confirmed">confirmed</option><option value="cancelled">cancelled</option></>}
                          {order.orderStatus === 'confirmed' && <><option value="shipped">shipped</option><option value="cancelled">cancelled</option></>}
                          {order.orderStatus === 'shipped' && <option value="delivered">delivered</option>}
                        </select>
                      </label>
                    </div>
                  ))}
                  {!orders.length && <p className="rounded-xl bg-[#FAF8F5] p-4 text-sm leading-6 text-[#77736E]">No stored orders. Order placement remains disabled until fulfillment rules are approved.</p>}
                </div>
              </div>
              <div className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7">
                <h2 className="font-display text-2xl text-[#1F2022]">Categories</h2>
                <ul className="mt-4 divide-y divide-[#EEE7DE]">
                  {categories.map((category) => (
                    <li key={category._id} className="flex justify-between gap-3 py-3 text-sm">
                      <span>{category.title}</span>
                      <span className="text-xs text-[#77736E]">{category.gender} · {category.slug}</span>
                    </li>
                  ))}
                  {!categories.length && <li className="py-6 text-sm text-[#77736E]">No categories are stored yet.</li>}
                </ul>
              </div>
            </section>
          </>
        ) : user.role === 'admin' ? (
          <section className="mt-8 rounded-2xl border border-[#E8E1D7] bg-white p-6 text-center" role="status">
            <h2 className="font-display text-xl text-[#1F2022]">Dashboard data could not be loaded</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#77736E]">
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
