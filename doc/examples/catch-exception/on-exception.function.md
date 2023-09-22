# onException - Function

A function that will be triggered so that you can handle the exception the way you want.
The function gives you the error, the context of your class and all the parameters received, respectively.
The function does not expect any return.

_Since you're using it with functions, the context will always be undefined._

---
Suppose you have a sales service that, before confirming payment, separates the stock, and if an error occurs after separating the stock, it needs to roll back the separated stock.

## Use case
```typescript
import { Request, Response } from 'express'
import { paymentService } from './payment-service'
import { inventoryService } from './inventory-service'
import { loggerService } from './logger-service'

async function confirmPayment(req: Request, res: Response): Promise<void> { 
  const orderID = req.params.orderId
  const payment = req.body
  try {
    await inventoryService.separate(orderID)
    const confirmed = await paymentService.confirm(orderID, payment)
    res.json(confirmed)    
  } catch (error) {
    loggerService.error(error)
    await this.inventoryService.rollbackSeparate(orderID)
    throw error
  }
}
```

## Usage
```typescript
import { catchException } from '@sabbath/logger'
import { Request, Response } from 'express'
import { paymentService } from './payment-service'
import { inventoryService } from './inventory-service'
import { loggerService } from './logger-service'


const confirmPayment = catchException(
  async function handleConfirmPayment(req: Request, res: Response): Promise<void> {
    const orderID = req.params.orderId
    const payment = req.body
    
    await inventoryService.separate(orderID)
    const confirmed = await paymentService.confirm(orderID, payment)
    res.json(confirmed)
  },
  {
    kind: 'Application',
    onException: async (error, _ctx, req) => {
      const orderID = req.params.orderId
      await inventoryService.rollbackSeparate(orderID)
      throw error
    }
  }
)
```

```typescript
import { catchException, CatchExceptionOptions } from '@sabbath/logger'
import { Request, Response } from 'express'
import { paymentService } from './payment-service'
import { inventoryService } from './inventory-service'
import { loggerService } from './logger-service'

const options: CatchExceptionOptions = {
  kind: 'Application',
  onException: async (error, _ctx, req) => {
    const orderID = req.params.orderId
    await inventoryService.rollbackSeparate(orderID)
    throw error
  }
}

async function handleConfirmPayment(req: Request, res: Response): Promise<void> {
  const orderID = req.params.orderId
  const payment = req.body

  await inventoryService.separate(orderID)
  const confirmed = await paymentService.confirm(orderID, payment)
  res.json(confirmed)
}

const confirmPayment = catchException(handleConfirmPayment, options)
```

## Log output
```text
[ERROR] - {
  "uid": "",
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "handleConfirmPayment",
    "method": "FUNCTIONAL"
  },
  "params": {PARAMS},
  "error": {
    "name": "PaymentError",
    "message": "Payment fails",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```