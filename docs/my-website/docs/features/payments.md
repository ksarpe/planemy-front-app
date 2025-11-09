---
sidebar_position: 6
---

# Payments

Track bills and recurring payments.

## Features

- 💰 Add one-time bills
- 🔄 Recurring payments
- 📅 Payment reminders
- 📊 Payment history

## API Hooks

```typescript
// Get payments
const { data: payments } = usePayments();

// Create payment
const { mutate: createPayment } = useCreatePayment();
createPayment({
  amount,
  description,
  due_date,
  recurring
});

// Update payment
const { mutate: updatePayment } = useUpdatePayment();
updatePayment({ id, data: { paid: true } });
```

## Payment Types

- One-time bills
- Monthly subscriptions
- Annual payments
- Custom recurring schedules
