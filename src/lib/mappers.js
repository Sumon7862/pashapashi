export function mapProduct(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price == null ? null : Number(row.old_price),
    weight: row.weight || "",
    description: row.description || "",
    images: row.images || [],
    createdAt: row.created_at,
  };
}

export function toProductRow(product) {
  return {
    title: product.title,
    category: product.category,
    price: product.price,
    old_price: product.oldPrice ?? null,
    weight: product.weight || "",
    description: product.description || "",
    images: product.images || [],
  };
}

export function mapOrder(row) {
  return {
    id: row.id,
    buyerName: row.buyer_name,
    buyerPhone: row.buyer_phone,
    buyerAddress: row.buyer_address,
    buyerLocation: row.buyer_location || "",
    items: row.items || [],
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
  };
}

export function toOrderRow(order) {
  return {
    buyer_name: order.buyerName,
    buyer_phone: order.buyerPhone,
    buyer_address: order.buyerAddress,
    buyer_location: order.buyerLocation || "",
    items: order.items,
    total: order.total,
    status: order.status || "pending",
  };
}
