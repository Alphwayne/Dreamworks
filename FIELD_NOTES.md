# Field Name Notes

## order_items table (from paystack/verify route)
- lineitem_name (NOT product_name)
- lineitem_quantity (NOT quantity)
- lineitem_price (NOT price)
- lineitem_sku
- lineitem_fulfillment_status

## inventory table (from lib/types.ts)
- available (NOT quantity)
- on_hand_current
- location (NOT warehouse)
- sku

## orders table fields
- order_number, financial_status, fulfillment_status, payment_method
- shipping_name, billing_name, email, total, created_at

## Admin stats API currently queries WRONG field names:
- order_items: uses "product_name, quantity, price" → should be "lineitem_name, lineitem_quantity, lineitem_price"
- inventory: uses "sku, quantity, warehouse" → should be "sku, available, location"
