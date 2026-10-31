import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  MEN_CATEGORIES,
  PRODUCTS,
  WOMEN_CATEGORIES,
  type CategoryInfo,
  type CategorySlug,
  type Product,
} from '../data/catalog';
import { apiRequest } from '../lib/api';

interface ApiProduct {
  catalogId?: string;
  sku?: string;
  name?: string;
  subtitle?: string;
  price?: number;
  compareAt?: number;
  fabric?: string;
  fabricDetails?: string;
  colors?: string[];
  sizes?: string[];
  badge?: string;
  description?: string;
  features?: string[];
  isDemoContent?: boolean;
  inStock?: boolean;
  stockCount?: number;
}

interface ApiCategory {
  slug?: string;
  title?: string;
  tagline?: string;
  description?: string;
}

interface CatalogContextValue {
  products: Product[];
  categories: CategoryInfo[];
  isLoading: boolean;
  error: string | null;
}

const LOCAL_CATEGORIES = [...MEN_CATEGORIES, ...WOMEN_CATEGORIES];
const LOCAL_PRODUCTS_BY_ID = new Map(PRODUCTS.map((product) => [product.id, product]));
const CatalogContext = createContext<CatalogContextValue | null>(null);

function applyApiProduct(product: ApiProduct): Product | null {
  if (!product.catalogId) return null;
  const local = LOCAL_PRODUCTS_BY_ID.get(product.catalogId);
  if (!local) return null;

  const validSizes = Array.isArray(product.sizes)
    ? product.sizes.filter((size): size is string => typeof size === 'string')
    : [];
  const validColors = Array.isArray(product.colors)
    ? product.colors.filter((color): color is string => typeof color === 'string')
    : [];
  const colors = validColors.length
    ? validColors.map((name) => ({
      name,
      hex: local.colors.find((color) => color.name.toLowerCase() === name.toLowerCase())?.hex ?? '#888888',
    }))
    : local.colors;

  const supportedBadges: Product['badge'][] = [
    'Bestseller',
    'New',
    'Bundle Save 20%',
    'Bundle Value',
    'Limited',
    'Special Offer',
  ];

  return {
    ...local,
    code: product.sku || local.code,
    name: product.name || local.name,
    subtitle: product.subtitle || local.subtitle,
    price: typeof product.price === 'number' &&
      Number.isSafeInteger(product.price) &&
      product.price >= 0
      ? product.price
      : local.price,
    compareAt: typeof product.compareAt === 'number' && Number.isSafeInteger(product.compareAt)
      ? product.compareAt
      : local.compareAt,
    fabric: product.fabric || local.fabric,
    fabricBadge: product.fabricDetails || local.fabricBadge,
    colors,
    sizes: validSizes.length ? validSizes : local.sizes,
    badge: supportedBadges.includes(product.badge as Product['badge'])
      ? product.badge as Product['badge']
      : local.badge,
    description: product.description || local.description,
    features: Array.isArray(product.features)
      ? product.features.filter((feature): feature is string => typeof feature === 'string')
      : local.features,
    isDemoContent: typeof product.isDemoContent === 'boolean'
      ? product.isDemoContent
      : local.isDemoContent,
    isDemoPrice: product.isDemoContent === true
      ? true
      : product.isDemoContent === false
        ? false
        : local.isDemoPrice,
    inventoryStatus: product.isDemoContent === true
      ? 'demo'
      : product.isDemoContent === false
        ? product.inStock === true && (product.stockCount === undefined || product.stockCount > 0)
          ? 'in_stock'
          : 'out_of_stock'
        : 'unverified',
  };
}

async function loadApiProducts(): Promise<ApiProduct[]> {
  const products: ApiProduct[] = [];
  const limit = 50;
  for (let page = 1; page <= 20; page += 1) {
    const result = await apiRequest<ApiProduct[]>(`/products?page=${page}&limit=${limit}`);
    products.push(...result);
    if (result.length < limit) return products;
  }
  throw new Error('Catalog exceeded the supported pagination limit.');
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [apiProducts, setApiProducts] = useState<ApiProduct[] | null>(null);
  const [apiCategories, setApiCategories] = useState<ApiCategory[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      loadApiProducts(),
      apiRequest<ApiCategory[]>('/categories'),
    ])
      .then(([products, categories]) => {
        if (!active) return;
        setApiProducts(products);
        setApiCategories(categories);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : 'Catalog API request failed.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const mappedProducts = apiProducts?.map(applyApiProduct).filter(
      (product): product is Product => product !== null
    ) ?? [];
    const productsById = new Map(mappedProducts.map((product) => [product.id, product]));
    const products = apiProducts?.length
      ? PRODUCTS.map((local) => productsById.get(local.id) ?? {
        ...local,
        isDemoContent: true,
        isDemoPrice: true,
        inventoryStatus: 'demo' as const,
      })
      : PRODUCTS.map((local) => ({
        ...local,
        isDemoPrice: local.isDemoContent ? true : local.isDemoPrice,
        inventoryStatus: local.isDemoContent ? 'demo' as const : 'unverified' as const,
      }));

    const mappedCategories = new Map(
      (apiCategories ?? [])
        .filter((category): category is ApiCategory & { slug: string } => typeof category.slug === 'string')
        .map((category) => [category.slug, category])
    );
    const categories = LOCAL_CATEGORIES.map((local) => {
      const fromApi = mappedCategories.get(local.slug);
      if (!fromApi) return local;
      return {
        ...local,
        title: fromApi.title || local.title,
        tagline: fromApi.tagline || local.tagline,
        description: fromApi.description || local.description,
      };
    });

    return { products, categories, isLoading, error };
  }, [apiProducts, apiCategories, isLoading, error]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within a CatalogProvider.');
  return context;
}

export function isCategorySlug(value: string): value is CategorySlug {
  return LOCAL_CATEGORIES.some((category) => category.slug === value) ||
    ['new-arrivals', 'bestsellers', 'bundles', 'offers', 'sale'].includes(value);
}
