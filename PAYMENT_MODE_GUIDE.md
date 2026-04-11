# Payment Mode Configuration

## Current Mode: DUMMY PAYMENT (Test Mode)

The application is currently configured to use **dummy payment mode** for testing without requiring real Razorpay integration.

---

## How Dummy Payment Works

### Frontend (Checkout.tsx)
- Simulates payment with 2-second delay
- Generates dummy payment IDs:
  - `order_dummy_[timestamp]`
  - `pay_dummy_[timestamp]`
  - `sig_dummy_[timestamp]`
- Skips Razorpay SDK integration

### Backend (PaymentService.java)
- Accepts any signature starting with `sig_dummy_`
- Creates payment records normally
- Generates user pages successfully

---

## Switching to Real Payments

### Step 1: Get Razorpay Credentials
1. Sign up at https://razorpay.com
2. Get your API keys from Dashboard
3. Note down:
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret

### Step 2: Update Environment Variables

**Frontend (.env)**
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

**Backend (application.properties)**
```properties
razorpay.key-id=rzp_test_xxxxxxxxxxxxx
razorpay.key-secret=your_secret_key_here
```

### Step 3: Enable Real Payment in Frontend

**File: `frontend/src/pages/Checkout.tsx`**

Comment out the dummy payment code and uncomment the Razorpay code:

```typescript
const handlePayment = async () => {
  // ... validation code ...
  
  setProcessing(true);

  try {
    // COMMENT OUT THIS DUMMY CODE:
    /*
    console.log('DUMMY PAYMENT MODE: Simulating payment...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const dummyPaymentResponse = {
      razorpay_order_id: `order_dummy_${Date.now()}`,
      razorpay_payment_id: `pay_dummy_${Date.now()}`,
      razorpay_signature: `sig_dummy_${Date.now()}`
    };
    await verifyPayment(dummyPaymentResponse);
    */
    
    // UNCOMMENT THIS REAL RAZORPAY CODE:
    const orderResponse = await paymentService.createOrder({
      template_id: template.id,
      amount: template.price || 0,
      user_name: userDetails.name,
      user_email: userDetails.email,
    });

    const order = orderResponse.order;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'TemplateMart',
      description: template.name,
      order_id: order.id,
      handler: async function (response: any) {
        await verifyPayment(response);
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
      },
      theme: {
        color: '#2563EB',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    
  } catch (error) {
    console.error('Error in payment:', error);
    alert('Payment failed. Please try again.');
  } finally {
    setProcessing(false);
  }
};
```

Also update the button text:
```typescript
// Change from:
Pay ₹{template.price} (DUMMY MODE)

// To:
Pay ₹{template.price}
```

And remove the test mode warning div.

### Step 4: Remove Dummy Signature Check in Backend

**File: `backend/src/main/java/com/templatemart/service/PaymentService.java`**

Remove the dummy signature check:

```java
private boolean verifySignature(String orderId, String paymentId, String signature) {
    try {
        // REMOVE THIS DUMMY CHECK:
        /*
        if (signature != null && signature.startsWith("sig_dummy_")) {
            log.info("DUMMY MODE: Accepting dummy signature for testing");
            return true;
        }
        */
        
        // Keep only the real verification:
        String payload = orderId + "|" + paymentId;
        String hash = HmacUtils.hmacSha256Hex(razorpayKeySecret, payload);
        return hash.equals(signature);
    } catch (Exception e) {
        log.error("Error verifying signature: {}", e.getMessage());
        return false;
    }
}
```

### Step 5: Test with Razorpay Test Cards

Use these test cards in Razorpay test mode:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- Any future expiry date
- Any CVV

---

## Benefits of Dummy Mode

✅ Test complete payment flow without Razorpay account
✅ No payment gateway fees during development
✅ Faster testing (no external API calls)
✅ Works offline
✅ Perfect for demos and development

---

## When to Use Real Payments

- Production deployment
- Testing actual payment gateway integration
- Verifying webhook functionality
- Testing refunds and payment failures
- Before going live

---

## Current Status

🟡 **DUMMY MODE ACTIVE**
- Frontend: Simulated payments
- Backend: Accepts dummy signatures
- No Razorpay credentials required
- Perfect for development and testing

To switch to real payments, follow the steps above.
