
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    CreditCard,
    MapPin,
    ShieldCheck,
    ShoppingBag,
    AlertCircle,
    PackageCheck,
} from 'lucide-react';

import { Container } from '../components/ui/Container';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../data/catalog';

const CHECKOUT_SELECTION_KEY = '2427-checkout-selection';

type CheckoutDetails = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
};

const initialDetails: CheckoutDetails = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
};

function getItemKey(
    productId: string,
    color: string,
    size: string
) {
    return JSON.stringify([productId, color, size]);
}

function loadCheckoutSelection(): string[] | null {
    try {
        const saved = sessionStorage.getItem(
            CHECKOUT_SELECTION_KEY
        );

        if (!saved) return null;

        const parsed: unknown = JSON.parse(saved);

        if (
            Array.isArray(parsed) &&
            parsed.every(
                (item): item is string =>
                    typeof item === 'string'
            )
        ) {
            return parsed;
        }

        return null;
    } catch {
        return null;
    }
}

export function CheckoutPage() {
    const navigate = useNavigate();

    const {
        cart,
        openOverlay,
    } = useStore();

    const [selectedKeys] = useState<string[] | null>(
        loadCheckoutSelection
    );

    const [details, setDetails] =
        useState<CheckoutDetails>(initialDetails);

    const [paymentMethod, setPaymentMethod] =
        useState<'cod' | 'online'>('cod');

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] =
        useState('');

    // Products selected from Cart Drawer
    const checkoutItems = useMemo(() => {
        if (selectedKeys === null) {
            return cart;
        }

        return cart.filter((item) =>
            selectedKeys.includes(
                getItemKey(
                    item.product.id,
                    item.selectedColor,
                    item.selectedSize
                )
            )
        );
    }, [cart, selectedKeys]);

    // Calculations
    const subtotal = useMemo(
        () =>
            checkoutItems.reduce(
                (total, item) =>
                    total +
                    item.product.price * item.quantity,
                0
            ),
        [checkoutItems]
    );

    const itemCount = checkoutItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const updateField = (
        field: keyof CheckoutDetails,
        value: string
    ) => {
        setDetails((previous) => ({
            ...previous,
            [field]: value,
        }));

        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError('');
        setSuccessMessage('');

        if (checkoutItems.length === 0) {
            setError(
                'No products are selected for checkout.'
            );
            return;
        }

        if (details.fullName.trim().length < 2) {
            setError('Please enter your full name.');
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                details.email.trim()
            )
        ) {
            setError('Please enter a valid email address.');
            return;
        }

        if (
            !/^[6-9]\d{9}$/.test(
                details.phone.trim()
            )
        ) {
            setError(
                'Please enter a valid 10-digit Indian mobile number.'
            );
            return;
        }

        if (
            details.address.trim().length < 10
        ) {
            setError(
                'Please enter a complete delivery address.'
            );
            return;
        }

        if (
            !/^\d{6}$/.test(
                details.pincode.trim()
            )
        ) {
            setError(
                'Please enter a valid 6-digit PIN code.'
            );
            return;
        }

        if (
            !details.city.trim() ||
            !details.state.trim()
        ) {
            setError(
                'Please enter your city and state.'
            );
            return;
        }

        setSuccessMessage(
            'Your checkout details have been validated successfully. This is a demo checkout. No order has been placed and no payment has been collected.'
        );
    };

    // Empty Cart or No Selected Products
    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-elan-ivory py-16">
                <Container>
                    <div className="mx-auto max-w-xl rounded-3xl border border-[#E8E1D7] bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F2F4EF]">
                            <ShoppingBag
                                size={36}
                                className="text-elan-sage"
                            />
                        </div>

                        <h1 className="mt-6 font-display text-3xl font-medium text-elan-ink">
                            No Products Selected
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-elan-muted">
                            Your checkout is empty. Add products
                            to your bag or select items to
                            continue.
                        </p>

                        <div className="mt-7 flex flex-wrap justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => openOverlay('cart')}
                                className="rounded-xl bg-elan-ink px-6 py-3 text-sm font-semibold text-elan-ivory hover:bg-elan-ink-hover"
                            >
                                Open Shopping Bag
                            </button>

                            <Link
                                to="/"
                                className="rounded-xl border border-[#E8E1D7] px-6 py-3 text-sm font-semibold text-elan-sage hover:border-[#637666]"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-elan-ivory py-8 sm:py-12">
            <Container>
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-elan-sage hover:text-elan-ink"
                >
                    <ArrowLeft size={16} />
                    Back to Shopping
                </button>

                {/* Page Header */}
                <div className="mb-9">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-elan-sage">
                        2427 ÉLAN
                    </p>

                    <h1 className="mt-2 font-display text-3xl font-medium text-elan-ink sm:text-4xl">
                        Checkout Preview
                    </h1>

                    <p className="mt-3 text-sm text-elan-muted">
                        Complete your delivery details and
                        review your selected products.
                    </p>
                    <p className="mt-3 rounded-xl border border-[#E8E1D7] bg-white p-4 text-xs leading-5 text-[#6B5425]">
                        Client demo only. Prices and inventory are sample data; shipping, taxes, delivery and returns are not confirmed. Form details are not submitted, no order is placed, and no payment is collected.
                    </p>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                    {/* Left: Checkout Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Delivery Details */}
                        <section className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2F4EF] text-elan-sage">
                                    <MapPin size={21} />
                                </div>

                                <div>
                                    <h2 className="font-display text-xl font-medium text-elan-ink">
                                        Delivery Information
                                    </h2>

                                    <p className="mt-1 text-xs text-elan-muted">
                                        Enter your shipping address
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Full Name */}
                                <div>
                                    <label
                                        htmlFor="checkout-name"
                                        className="mb-2 block text-xs font-semibold text-elan-ink"
                                    >
                                        Full Name *
                                    </label>

                                    <input
                                        id="checkout-name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={details.fullName}
                                        onChange={(event) =>
                                            updateField(
                                                'fullName',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter full name"
                                        className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-elan-ivory px-4 text-sm outline-none focus:border-elan-sage"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="checkout-email"
                                        className="mb-2 block text-xs font-semibold text-elan-ink"
                                    >
                                        Email Address *
                                    </label>

                                    <input
                                        id="checkout-email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={details.email}
                                        onChange={(event) =>
                                            updateField(
                                                'email',
                                                event.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-elan-ivory px-4 text-sm outline-none focus:border-elan-sage"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="checkout-phone"
                                        className="mb-2 block text-xs font-semibold text-elan-ink"
                                    >
                                        Mobile Number *
                                    </label>

                                    <input
                                        id="checkout-phone"
                                        type="tel"
                                        autoComplete="tel"
                                        inputMode="numeric"
                                        required
                                        maxLength={10}
                                        value={details.phone}
                                        onChange={(event) =>
                                            updateField(
                                                'phone',
                                                event.target.value
                                            )
                                        }
                                        placeholder="10-digit mobile number"
                                        className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-elan-ivory px-4 text-sm outline-none focus:border-elan-sage"
                                    />
                                </div>

                                {/* PIN Code */}
                                <div>
                                    <label
                                        htmlFor="checkout-pincode"
                                        className="mb-2 block text-xs font-semibold text-elan-ink"
                                    >
                                        PIN Code *
                                    </label>

                                    <input
                                        id="checkout-pincode"
                                        type="text"
                                        autoComplete="postal-code"
                                        inputMode="numeric"
                                        required
                                        maxLength={6}
                                        value={details.pincode}
                                        onChange={(event) =>
                                            updateField(
                                                'pincode',
                                                event.target.value
                                            )
                                        }
                                        placeholder="6-digit PIN code"
                                        className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-elan-ivory px-4 text-sm outline-none focus:border-elan-sage"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label
                                        htmlFor="checkout-city"
                                        className="mb-2 block text-xs font-semibold text-elan-ink"
                                    >
                                        City *
                                    </label>

                                    <input
                                        id="checkout-city"
                                        type="text"
                                        autoComplete="address-level2"
                                        required
                                        value={details.city}
                                        onChange={(event) =>
                                            updateField(
                                                'city',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter city"
                                        className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-elan-ivory px-4 text-sm outline-none focus:border-elan-sage"
                                    />
                                </div>

                                {/* State */}
                                <div>
                                    <label
                                        htmlFor="checkout-state"
                                        className="mb-2 block text-xs font-semibold text-elan-ink"
                                    >
                                        State *
                                    </label>

                                    <input
                                        id="checkout-state"
                                        type="text"
                                        autoComplete="address-level1"
                                        required
                                        value={details.state}
                                        onChange={(event) =>
                                            updateField(
                                                'state',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter state"
                                        className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-elan-ivory px-4 text-sm outline-none focus:border-elan-sage"
                                    />
                                </div>

                                {/* Address */}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="checkout-address"
                                        className="mb-2 block text-xs font-semibold text-elan-ink"
                                    >
                                        Complete Address *
                                    </label>

                                    <textarea
                                        id="checkout-address"
                                        required
                                        rows={3}
                                        autoComplete="street-address"
                                        value={details.address}
                                        onChange={(event) =>
                                            updateField(
                                                'address',
                                                event.target.value
                                            )
                                        }
                                        placeholder="House number, street, area, landmark"
                                        className="w-full rounded-xl border border-[#E8E1D7] bg-elan-ivory px-4 py-3 text-sm outline-none focus:border-elan-sage"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2F4EF] text-elan-sage">
                                    <CreditCard size={21} />
                                </div>

                                <div>
                                    <h2 className="font-display text-xl font-medium text-elan-ink">
                                        Payment Method
                                    </h2>

                                    <p className="mt-1 text-xs text-elan-muted">
                                        Select your preferred option
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === 'cod'
                                            ? 'border-[#637666] bg-[#F2F4EF]'
                                            : 'border-[#E8E1D7]'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() =>
                                            setPaymentMethod('cod')
                                        }
                                        className="accent-[#637666]"
                                    />

                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-elan-ink">
                                            Cash on Delivery (demo selection)
                                        </p>

                                        <p className="mt-1 text-xs text-elan-muted">
                                            Availability and delivery terms are not confirmed
                                        </p>
                                    </div>
                                </label>

                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === 'online'
                                            ? 'border-[#637666] bg-[#F2F4EF]'
                                            : 'border-[#E8E1D7]'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === 'online'}
                                        onChange={() =>
                                            setPaymentMethod('online')
                                        }
                                        className="accent-[#637666]"
                                    />

                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-elan-ink">
                                            Online Payment (demo selection)
                                        </p>

                                        <p className="mt-1 text-xs text-elan-muted">
                                            No payment provider is connected
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="mt-4 flex items-start gap-2 rounded-xl bg-elan-ivory p-3">
                                <ShieldCheck
                                    size={16}
                                    className="mt-0.5 shrink-0 text-elan-sage"
                                />

                                <p className="text-xs leading-5 text-elan-muted">
                                    Payment methods are for demo
                                    purposes. No actual COD order or
                                    online payment is processed.
                                </p>
                            </div>
                        </section>

                        {/* Place Order Demo */}
                        <section className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7">
                            <div className="mb-4 flex items-center gap-2">
                                <PackageCheck
                                    size={19}
                                    className="text-elan-sage"
                                />

                                <h2 className="font-display text-lg font-medium text-elan-ink">
                                    Review Your Checkout
                                </h2>
                            </div>

                            <button
                                type="submit"
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-elan-ink px-5 py-3.5 text-sm font-semibold text-elan-ivory transition-colors hover:bg-elan-ink-hover"
                            >
                                Review Checkout Details
                                <ArrowRight size={18} />
                            </button>

                            {error && (
                                <div
                                    role="alert"
                                    className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-6 text-red-700"
                                >
                                    <AlertCircle
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span>{error}</span>
                                </div>
                            )}

                            {successMessage && (
                                <div
                                    role="status"
                                    className="mt-4 flex items-start gap-2 rounded-xl border border-[#CBD8CA] bg-[#F2F4EF] p-4 text-xs leading-6 text-elan-sage"
                                >
                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span>{successMessage}</span>
                                </div>
                            )}

                            <p className="mt-4 text-center text-xs text-elan-muted">
                                Demo checkout only — no real order
                                or payment.
                            </p>
                        </section>
                    </form>

                    {/* Right: Order Summary */}
                    <aside className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-6 lg:sticky lg:top-24">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-xl font-medium text-elan-ink">
                                Order Summary
                            </h2>

                            <span className="rounded-full bg-[#F2F4EF] px-3 py-1 text-xs font-semibold text-elan-sage">
                                {itemCount} items
                            </span>
                        </div>

                        {/* Products */}
                        <div className="mt-5 max-h-[350px] space-y-4 overflow-y-auto">
                            {checkoutItems.map((item) => {
                                const key = getItemKey(
                                    item.product.id,
                                    item.selectedColor,
                                    item.selectedSize
                                );

                                return (
                                    <div
                                        key={key}
                                        className="flex gap-3 border-b border-[#EEE7DE] pb-4"
                                    >
                                        <Link
                                            to={`/product/${item.product.slug}`}
                                            className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-elan-ivory p-2"
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                to={`/product/${item.product.slug}`}
                                                className="line-clamp-2 text-sm font-semibold text-elan-ink hover:text-elan-sage"
                                            >
                                                {item.product.name}
                                            </Link>

                                            <p className="mt-1 text-xs text-elan-muted">
                                                Size: {item.selectedSize}
                                            </p>

                                            <p className="mt-1 text-xs text-elan-muted">
                                                Color: {item.selectedColor}
                                            </p>

                                            <p className="mt-1 text-xs text-elan-muted">
                                                Quantity: {item.quantity}
                                            </p>

                                            <p className="mt-2 text-sm font-bold text-elan-ink">
                                                {formatINR(
                                                    item.product.price *
                                                    item.quantity
                                                )}
                                            </p>
                                            {item.product.isDemoPrice && (
                                                <p className="mt-1 text-[11px] text-elan-muted">Sample price — not approved for sale</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Price Breakdown */}
                        <div className="mt-5 space-y-3 text-sm">
                            <div className="flex justify-between text-elan-muted">
                                <span>Subtotal</span>
                                <span>{formatINR(subtotal)}</span>
                            </div>

                            <div className="flex justify-between text-elan-muted">
                                <span>Shipping and payment</span>
                                <span>Not calculated</span>
                            </div>

                            <p className="rounded-lg bg-[#F2F4EF] p-3 text-xs leading-5 text-elan-sage">
                                Shipping rates and payment processing are unavailable until store policies are approved.
                            </p>

                            <div className="flex justify-between border-t border-[#EEE7DE] pt-4 text-base font-bold text-elan-ink">
                                <span>Merchandise subtotal</span>

                                <span>{formatINR(subtotal)}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => openOverlay('cart')}
                            className="mt-6 w-full rounded-xl border border-[#E8E1D7] px-4 py-3 text-xs font-semibold text-elan-sage transition-colors hover:border-[#637666]"
                        >
                            Edit Shopping Bag
                        </button>

                        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-elan-muted">
                            <ShieldCheck
                                size={16}
                                className="text-elan-sage"
                            />

                            Checkout preview only
                        </div>
                    </aside>
                </div>
            </Container>
        </div>
    );
}
