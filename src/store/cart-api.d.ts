/* eslint @typescript-eslint/no-explicit-any: 0 */
declare module '@/store/cart-api' {
  export type OrderIdentifiers = {
    uuid: string;
    anonid: string;
  };

  export type OrderItem = {
    id: number;
    order_id: number;
    item_type: string;
    item_id: number;
    is_ebook: number;
    title: string;
    book_titles: string[];
    isbns: string[];
    images: string[];
    price: string;
    price_currency: string;
    discount: string;
    discounted_price: string;
    quantity: number;
    total_before_discount: string;
    total: string;
    created_at: string;
    updated_at: string;
    status: string;
    metadata: null;
    fulfilled_items: null;
    is_fulfilled: number;
    slug: string;
    quantity_in_stock: number;
    supply_quantity: number;
    type: string;
  };

  export type OrderDeliveryAddress = {
    delivery_first_name: string;
    delivery_last_name: string;
    delivery_phone: string;
    delivery_email: string;
    delivery_address1: string;
    delivery_address2: string;
    delivery_town: null;
    delivery_city: string;
    delivery_zip: string;
    delivery_country: string;
  };

  export type OrderBillingAddress = {
    billing_first_name: string;
    billing_last_name: string;
    billing_phone: string;
    billing_email: string;
    billing_address1: string;
    billing_address2: string;
    billing_town: null;
    billing_city: string;
    billing_zip: string;
    billing_country: string;
  };

  export type OrderDetailsBasic = {
    coupons_total_discount: string;
    created_at: string;
    delivered_at: null;
    env_mode: null;
    id: number;
    is_payment_confirmed: boolean;
    last_sync_at: string;
    order_expiry_date: null;
    order_final: string;
    order_savings: string;
    order_total: string;
    order_total_before_discount: string;
    payment_date: null;
    payment_expiry_month: null;
    payment_expiry_year: null;
    payment_last4: null;
    payment_method: null;
    payment_nameoncard: null;
    shipped_at: null;
    shipping_cost: string;
    status: string;
    timeline: null;
    transaction_id: null;
    updated_at: string;
    user_id: null;
  };

  export type OrderDetailsExtended = {
    book_stock: Record<string, number>;
    bundle_stock: Record<string, number>;
    coupons: any[];
    items: OrderItem[];
    order_subtotal: number;
  };

  export type OrderAddressResponse = {
    order: OrderIdentifiers & OrderDetailsBasic & OrderDeliveryAddress & OrderBillingAddress;
  };

  // POST /api/orders/cart/address-partial
  export type OrderAddressArg = OrderDeliveryAddress & OrderBillingAddress;
  export function setOrderAddressPartial(
    arg: Partial<OrderAddressArg>
  ): Promise<OrderAddressResponse>;

  // POST /api/orders/cart/address
  // Note: email addresses must be valid emails
  export function setOrderAddress(arg: OrderAddressArg): Promise<OrderAddressResponse>;

  // GET https://service.bindle.co.uk/api/orders/cart
  export type OrderCartResponse = OrderAddressResponse & { order: OrderDetailsExtended };
  export function getOrderCart(): Promise<OrderCartResponse>;

  export function setUuid(uuid: string): string;
}
