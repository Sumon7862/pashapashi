# Supabase setup

1. Create a project at [https://supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste [`schema.sql`](schema.sql), and run it. This creates `products`, `orders`, RLS policies, the public `product-images` bucket, and the seed honey product.
3. Open **Authentication → Users → Add user**. Create the shop admin with email + password and enable **Auto Confirm**.
4. Copy **Project Settings → API** values into `.env`:

```
VITE_SUPABASE_URL=https://pwrbosrwkwqelhoikqrq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Use the same two values as Vercel environment variables before deploy.
