import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from "../../store/cartSlice";
import {
  AUTH_STATUS,
  addAddress,
  clearAuthError,
} from "../../store/authSlice";
import { CHECKOUT_MODE, createCheckoutSession } from "../../api/checkout";
import { createOrder } from "../../api/orders";
import {
  EMPTY_ADDRESS,
  formatAddressLines,
  getAddresses,
  getDefaultAddress,
  validateAddress,
} from "../../utils/addresses";
import "./CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const user = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);

  const addresses = useMemo(() => getAddresses(user), [user]);
  const defaultAddress = useMemo(() => getDefaultAddress(user), [user]);

  const [selectedAddressId, setSelectedAddressId] = useState(
    () => defaultAddress?.id ?? "",
  );
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    ...EMPTY_ADDRESS,
    fullName: user?.name ?? "",
    isDefault: addresses.length === 0,
  });
  const [addressFieldError, setAddressFieldError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedAddressId && defaultAddress?.id) {
      setSelectedAddressId(defaultAddress.id);
      return;
    }
    if (
      selectedAddressId &&
      !addresses.some((address) => address.id === selectedAddressId)
    ) {
      setSelectedAddressId(defaultAddress?.id ?? "");
    }
  }, [addresses, defaultAddress, selectedAddressId]);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ?? null;
  const isSavingAddress = authStatus === AUTH_STATUS.LOADING;

  const handleAddressFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setAddressFieldError("");
  };

  const handleAddAddress = async (event) => {
    event.preventDefault();
    const validationError = validateAddress(addressForm);
    if (validationError) {
      setAddressFieldError(validationError);
      return;
    }

    dispatch(clearAuthError());
    const result = await dispatch(
      addAddress({
        ...addressForm,
        label: addressForm.label.trim() || "Home",
        isDefault: addressForm.isDefault || addresses.length === 0,
      }),
    );

    if (addAddress.fulfilled.match(result)) {
      const previousIds = new Set(addresses.map((address) => address.id));
      const newest =
        getAddresses(result.payload).find(
          (address) => !previousIds.has(address.id),
        ) ?? getDefaultAddress(result.payload);

      setSelectedAddressId(newest?.id ?? "");
      setShowNewAddress(false);
      setAddressForm({
        ...EMPTY_ADDRESS,
        fullName: user?.name ?? "",
        isDefault: false,
      });
      setAddressFieldError("");
      setError("");
    }
  };

  const handlePay = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");

    if (!selectedAddress) {
      setError("Select a shipping address before paying.");
      setProcessing(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email =
      String(formData.get("email") ?? "").trim() || user?.email || "";

    try {
      const session = await createCheckoutSession(items);

      const savedOrder = await createOrder({
        id: session.id,
        email,
        userId: user?.id ?? null,
        status: session.paymentStatus,
        currency: session.currency,
        amountTotal: session.amountTotal,
        count,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          id: selectedAddress.id,
          label: selectedAddress.label,
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        },
        createdAt: new Date().toISOString(),
      });

      navigate("/checkout/success", {
        replace: true,
        state: {
          order: {
            id: savedOrder.id,
            amountTotal: savedOrder.amountTotal,
            count: savedOrder.count,
          },
        },
      });
    } catch (err) {
      setError(
        err.message || "Payment could not be completed. Please try again.",
      );
      setProcessing(false);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__topbar">
        <Link to="/cart" className="checkout__back">
          ← Back to cart
        </Link>
        <span className="checkout__brand">Shopzy</span>
      </div>

      {CHECKOUT_MODE === "mock" && (
        <p className="checkout__test-banner" role="status">
          Test mode — this is a mock Stripe checkout. No real payment is taken.
          Use any details (e.g. card <strong>4242 4242 4242 4242</strong>).
        </p>
      )}

      <div className="checkout__layout">
        <div className="checkout__main">
          <section
            className="checkout__shipping"
            aria-labelledby="shipping-heading"
          >
            <div className="checkout__shipping-header">
              <h2 id="shipping-heading" className="checkout__title">
                Shipping address
              </h2>
              <Link to="/profile" className="checkout__manage-link">
                Manage addresses
              </Link>
            </div>

            {addresses.length === 0 && !showNewAddress && (
              <p className="checkout__empty-address">
                You don&apos;t have a saved address yet. Add one to continue.
              </p>
            )}

            {addresses.length > 0 && (
              <ul className="checkout__address-list">
                {addresses.map((address) => (
                  <li key={address.id}>
                    <label
                      className={`checkout__address-option${
                        selectedAddressId === address.id
                          ? " checkout__address-option--selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                      <span className="checkout__address-content">
                        <span className="checkout__address-label-row">
                          <strong>{address.label || "Address"}</strong>
                          {address.isDefault && (
                            <span className="checkout__default-badge">
                              Default
                            </span>
                          )}
                        </span>
                        {formatAddressLines(address).map((line) => (
                          <span key={line} className="checkout__address-line">
                            {line}
                          </span>
                        ))}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {!showNewAddress ? (
              <button
                type="button"
                className="checkout__add-address"
                onClick={() => {
                  setShowNewAddress(true);
                  setAddressForm({
                    ...EMPTY_ADDRESS,
                    fullName: user?.name ?? "",
                    isDefault: addresses.length === 0,
                  });
                  setAddressFieldError("");
                  dispatch(clearAuthError());
                }}
              >
                + Add new address
              </button>
            ) : (
              <form
                className="checkout__address-form"
                onSubmit={handleAddAddress}
                noValidate
              >
                <h3 className="checkout__subtitle">New address</h3>

                {(addressFieldError || authError) && (
                  <p className="checkout__error" role="alert">
                    {addressFieldError || authError}
                  </p>
                )}

                <div className="checkout__field-row">
                  <label className="checkout__field">
                    <span className="checkout__label">Label</span>
                    <input
                      className="checkout__input"
                      name="label"
                      value={addressForm.label}
                      onChange={handleAddressFieldChange}
                      placeholder="Home, Work…"
                    />
                  </label>
                  <label className="checkout__field">
                    <span className="checkout__label">Full name</span>
                    <input
                      className="checkout__input"
                      name="fullName"
                      value={addressForm.fullName}
                      onChange={handleAddressFieldChange}
                      required
                      autoComplete="name"
                    />
                  </label>
                </div>

                <label className="checkout__field">
                  <span className="checkout__label">Phone</span>
                  <input
                    className="checkout__input"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressFieldChange}
                    required
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>

                <label className="checkout__field">
                  <span className="checkout__label">Address line 1</span>
                  <input
                    className="checkout__input"
                    name="line1"
                    value={addressForm.line1}
                    onChange={handleAddressFieldChange}
                    required
                    autoComplete="address-line1"
                  />
                </label>

                <label className="checkout__field">
                  <span className="checkout__label">Address line 2</span>
                  <input
                    className="checkout__input"
                    name="line2"
                    value={addressForm.line2}
                    onChange={handleAddressFieldChange}
                    autoComplete="address-line2"
                  />
                </label>

                <div className="checkout__field-row checkout__field-row--3">
                  <label className="checkout__field">
                    <span className="checkout__label">City</span>
                    <input
                      className="checkout__input"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFieldChange}
                      required
                      autoComplete="address-level2"
                    />
                  </label>
                  <label className="checkout__field">
                    <span className="checkout__label">State</span>
                    <input
                      className="checkout__input"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFieldChange}
                      required
                      autoComplete="address-level1"
                    />
                  </label>
                  <label className="checkout__field">
                    <span className="checkout__label">Postal code</span>
                    <input
                      className="checkout__input"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressFieldChange}
                      required
                      autoComplete="postal-code"
                    />
                  </label>
                </div>

                <label className="checkout__field">
                  <span className="checkout__label">Country</span>
                  <input
                    className="checkout__input"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressFieldChange}
                    required
                    autoComplete="country-name"
                  />
                </label>

                <label className="checkout__check">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressFieldChange}
                  />
                  Set as default shipping address
                </label>

                <div className="checkout__address-actions">
                  <button
                    type="submit"
                    className="checkout__save-address"
                    disabled={isSavingAddress}
                  >
                    {isSavingAddress ? "Saving…" : "Save address"}
                  </button>
                  <button
                    type="button"
                    className="checkout__cancel-address"
                    onClick={() => {
                      setShowNewAddress(false);
                      setAddressFieldError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          <form className="checkout__form" onSubmit={handlePay}>
            <h1 className="checkout__title">Pay with card</h1>

            {error && (
              <p className="checkout__error" role="alert">
                {error}
              </p>
            )}

            <label className="checkout__field">
              <span className="checkout__label">Email</span>
              <input
                className="checkout__input"
                type="email"
                name="email"
                defaultValue={user?.email ?? ""}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="checkout__field">
              <span className="checkout__label">Card number</span>
              <input
                className="checkout__input"
                inputMode="numeric"
                defaultValue="4242 4242 4242 4242"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
              />
            </label>

            <div className="checkout__field-row">
              <label className="checkout__field">
                <span className="checkout__label">Expiry</span>
                <input
                  className="checkout__input"
                  defaultValue="12 / 34"
                  placeholder="MM / YY"
                  autoComplete="cc-exp"
                />
              </label>
              <label className="checkout__field">
                <span className="checkout__label">CVC</span>
                <input
                  className="checkout__input"
                  defaultValue="123"
                  placeholder="CVC"
                  autoComplete="cc-csc"
                />
              </label>
            </div>

            <label className="checkout__field">
              <span className="checkout__label">Name on card</span>
              <input
                className="checkout__input"
                defaultValue={user?.name ?? ""}
                placeholder="Full name"
                autoComplete="cc-name"
              />
            </label>

            <button
              type="submit"
              className="checkout__pay"
              disabled={processing || !selectedAddress}
            >
              {processing ? "Processing…" : `Pay ₹${total.toFixed(2)}`}
            </button>

            <p className="checkout__secure">
              <span aria-hidden="true">🔒</span> Payments are securely processed
              by Stripe.
            </p>
          </form>
        </div>

        <aside className="checkout__summary">
          <h2 className="checkout__summary-title">
            Order summary ({count} item{count === 1 ? "" : "s"})
          </h2>
          <ul className="checkout__items">
            {items.map((item) => (
              <li key={item.id} className="checkout__item">
                <span
                  className="checkout__item-media"
                  style={{ background: item.bg }}
                  aria-hidden="true"
                />
                <span className="checkout__item-name">
                  {item.name}
                  <span className="checkout__item-qty">
                    Qty {item.quantity}
                  </span>
                </span>
                <span className="checkout__item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout__summary-row">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="checkout__summary-row">
            <span>Shipping</span>
            <span className="checkout__free">FREE</span>
          </div>
          {selectedAddress && (
            <div className="checkout__ship-to">
              <span className="checkout__ship-to-label">Ship to</span>
              <strong>{selectedAddress.fullName}</strong>
              <span>
                {selectedAddress.city}, {selectedAddress.postalCode}
              </span>
            </div>
          )}
          <div className="checkout__summary-row checkout__summary-row--total">
            <span>Total due</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
