This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase CSV templates

CSV templates for quick import into Supabase (Table editor → Import):

users.csv

```text
id,email,name,role,ownerEmail
00000000-0000-0000-0000-000000000000,owner@example.com,Alice Owner,owner,
11111111-1111-1111-1111-111111111111,teller@example.com,Bob Teller,teller,owner@example.com
```

products.csv

```text
id,name,category,price,quantity,image_url,ownerEmail
1,Cola,Drinks,12.50,24,https://example.com/cola.png,owner@example.com
2,Bread,Food,18.00,10,https://example.com/bread.png,owner@example.com
```

orders.csv

```text
id,orderDate,totalAmount,cardFee,paymentMethod,items,teller,ownerEmail
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa,2025-01-01T10:00:00Z,30.50,0.00,cash,"[{""productId"":1,""name"":""Cola"",""price"":12.5,""quantity"":2}]",Bob Teller,owner@example.com
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb,2025-01-02T12:00:00Z,120.00,5.00,card,"[{""productId"":2,""name"":""Bread"",""price"":18,""quantity"":4}]",Bob Teller,owner@example.com
```

Notes:
- Adjust sample IDs/emails for your project.
- For `orders.csv`, the `items` column uses JSON within CSV — ensure your importer interprets it correctly.
