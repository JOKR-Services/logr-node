# level - decorator

The `level` option allows you to specify the log level when an exception is caught. This is useful for differentiating between critical errors and expected exceptions like business rule violations.

## Available Levels

- `'error'` (default): For critical errors that require immediate attention
- `'warn'`: For expected exceptions that should be monitored (e.g., business rule violations)
- `'info'`: For informational exceptions that are part of normal flow
- `'debug'`: For debugging purposes

---

## Use case

Not all exceptions are critical errors. For example, when a user tries to perform an action that violates a business rule, it's an expected exception that should be logged but not treated as a critical error.

## Usage with fixed level

```typescript
import { CatchException } from '@daki/logr'
import { BusinessRuleError } from './errors'

export class PaymentService {
  
  // Business rule violation - use 'warn' instead of 'error'
  @CatchException({
    kind: 'Domain',
    level: 'warn'
  })
  public async processPayment(amount: number, userId: string): Promise<void> {
    if (amount < 0) {
      throw new BusinessRuleError('Payment amount cannot be negative')
    }
    
    if (amount > 10000) {
      throw new BusinessRuleError('Payment amount exceeds limit')
    }
    
    // Process payment...
  }
  
  // Critical system error - use 'error' (default)
  @CatchException({
    kind: 'Infrastructure'
  })
  public async connectToPaymentGateway(): Promise<void> {
    // Connection logic that might fail critically
  }
}
```

## Usage with dynamic level (function)

You can also provide a function that determines the log level based on the exception:

```typescript
import { CatchException } from '@daki/logr'
import { BusinessRuleError, ValidationError, SystemError } from './errors'

export class OrderService {
  
  @CatchException({
    kind: 'Domain',
    level: (error) => {
      // Business rules - expected exceptions
      if (error instanceof BusinessRuleError) return 'warn'
      
      // Validation errors - informational
      if (error instanceof ValidationError) return 'info'
      
      // System errors - critical
      return 'error'
    }
  })
  public async createOrder(orderData: any): Promise<Order> {
    // Validation
    if (!orderData.items || orderData.items.length === 0) {
      throw new ValidationError('Order must have at least one item')
    }
    
    // Business rule
    if (orderData.totalAmount > this.getUserLimit(orderData.userId)) {
      throw new BusinessRuleError('Order exceeds user limit')
    }
    
    // System operation that might fail
    return await this.repository.save(orderData)
  }
}
```

## Log output examples

### With level: 'warn'
```text
User not found {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "level": "warn",
  "logger": {
    "name": "PaymentService",
    "method_name": "processPayment",
    "params": [-100, "user123"]
  },
  "error": {
    "name": "BusinessRuleError",
    "message": "Payment amount cannot be negative",
    "stack": {ErrorStack},
    "kind": "Domain"
  }
}
```

### With level: 'error' (default)
```text
Database connection failed {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "level": "error",
  "logger": {
    "name": "PaymentService",
    "method_name": "connectToPaymentGateway",
    "params": []
  },
  "error": {
    "name": "ConnectionError",
    "message": "Database connection failed",
    "stack": {ErrorStack},
    "kind": "Infrastructure"
  }
}
```

