# onException - Decorator

A function that will be triggered so that you can handle the exception the way you want.
The function gives you the error, the context of your class and all the parameters received, respectively.
The function does not expect any return.

---
Suppose you have a sales service that, before confirming payment, separates the stock, and if an error occurs after separating the stock, it needs to roll back the separated stock.

## Use case
```typescript
import { Body, Controller, Param, Post } from '@nestjs/common'
import { PaymentService } from './payment-service'
import { InventoryService } from './inventory-service'
import { LoggerService } from './logger-service'
import { PaymentDTO, ConfirmedPayment } from './payment'

@Controller('payment')
class PaymentController {
  constructor(
    private readonly service: PaymentService,
    private readonly inventoryService: InventoryService
  ) {}
  
  @Post(':orderId')
  public async confirm(@Param('orderId') orderId: string, @Body() payment: PaymentDTO): Promise<ConfirmedPayment> {
    try {
      await this.inventoryService.separate(orderId)
      const confirmed = await this.service.confirm(orderId, payment)
      
      return confirmed
    } catch (error) {
      LoggerService.error(error)
      await this.inventoryService.rollbackSeparate(orderId)
      throw error
    }
  }  
}
```

## Usage
```typescript
import { CatchException } from '@daki/logr'
import { Body, Controller, Param, Post } from '@nestjs/common'
import { PaymentService } from './payment-service'
import { InventoryService } from './inventory-service'
import { LoggerService } from './logger-service'
import { PaymentDTO, ConfirmedPayment } from './payment'

@Controller('payment')
class PaymentController {
  constructor(
    private readonly service: PaymentService,
    private readonly inventoryService: InventoryService
  ) {}
  
  private async rollback(orderId: string): Promise<void> {
    this.inventoryService.rollbackSeparate(orderId)
  }
  
  @Post(':orderId')
  @CatchException({
    kind: 'Application',
    onException: async (error, ctx, orderId) => {
      await ctx.rollback(orderId)
      throw error
    }
  })
  public async confirm(@Param('orderId') id: string, @Body() payment: PaymentDTO): Promise<ConfirmedPayment> {
    await this.inventoryService.separate(orderId)
    const confirmed = await this.service.confirm(orderId, payment)

    return confirmed
  }  
}
```

## Log output
```text
Payment fails {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "PaymentController",
    "method_name": "confirm",
    "params": ["c4baf266-13c9-4d6e-93a7-ff8dccde0905", {"price": 99.99}],
  },
  "error": {
    "name": "PaymentError",
    "message": "Payment fails",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```