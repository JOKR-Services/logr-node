# typeErrorHandling - decorator

We have two ways of handling exceptions: `LOG` and `REGISTER`.
This configuration is ideal if you have a "cascade" of `CatchException`
where you are using a dependency that has already been instantiated with the `CatchException`.

If you choose the `REGISTER` type, the exception will be logged in our service
and will be logged as soon as it finds a "parent" instance where the handling type is `LOG`.

---
Suppose you have the following structure

## Use case

```typescript
import { CatchException } from '@daki/logr'
import { User } from './user'
import { UserORM } from './user-orm'

export class UserRepository {
  constructor(private readonly orm: UserORM) {}
  
  @CatchException({
    kind: 'Infrastructure',
    bubbleException: true
  })
  public getByToken(token: string): Promise<User> {
    return this.orm.getOne({
      where: { userToken: token }
    })
  }
}
```

```typescript
import { CatchException } from '@daki/logr'
import { UserRepository } from './user-repository'
import { OrderService } from './order-service'
import { Order } from './order'
import { Authenticated } from './auth'

export class OrderController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly service: OrderService
  ) {}
  
  @CatchException({
    kind: 'Application'
  })
  public async getUserOrders(authenticated: Authenticated): Promise<Order[]> {
    const user = await this.userRepository.getByToken(authenticated.token)
    
    return this.service.getByUserId(user.id)
  }
}
```
If an exception occurs in `UserRepository` in the `getByToken` method, `CatchException` will log the error
and then pass it on to its parent classes.
Since `OrderController` is a parent class of `UserRepository` and also uses `CatchException`,
the `CatchException` instance of that method will also log the same error.
The scenario becomes even more complicated, because in addition to registering the same error twice,
the two records will have different information.

_The log of the UserRepository class will be something like this:_
```text
Database fails {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "UserRepository",
    "method_name": "getByToken",
    "params": [
      "7HJpRt2qXwE9kLsN"
    ],
  },
  "error": {
    "name": "UserRepositoryError",
    "message": "Database fails",
    "stack": {ErrorStack},
    "kind": "Infrastructure"
  }
}
```

_And the log of the OrderController class will be something like this:_

```text
Database fails {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "OrderController",
    "method_name:": "getUserOrders",
    "params": [
      {
        "token": "7HJpRt2qXwE9kLsN",
        "role": "CUSTOMER"
      }
    ],
  },
  "error": {
    "name": "UserRepositoryError",
    "message": "Database fails",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```

## Usage
```typescript
import { CatchException } from '@daki/logr'
import { User } from './user'
import { UserORM } from './user-orm'

export class UserRepository {
  constructor(private readonly orm: UserORM) {}
  
  @CatchException({
    kind: 'Infrastructure',
    typeErrorHandling: 'REGISTER'
  })
  public getByToken(token: string): Promise<User> {
    return this.orm.getOne({
      where: { userToken: token }
    })
  }
}
```

```typescript
import { CatchException } from '@daki/logr'
import { UserRepository } from './user-repository'
import { OrderService } from './order-service'
import { Order } from './order'
import { Authenticated } from './auth'

export class OrderController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly service: OrderService
  ) {}
  
  @CatchException({
    kind: 'Application'
  })
  public async getUserOrders(authenticated: Authenticated): Promise<Order[]> {
    const user = await this.userRepository.getByToken(authenticated.token)
    
    return this.service.getByUserId(user.id)
  }
}
```

## Log output
```text
Database fails {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "UserRepository",
    "method_name": "getByToken",
    "params": [
      "7HJpRt2qXwE9kLsN"
    ],
  },
  "error": {
    "name": "UserRepositoryError",
    "message": "Database fails",
    "stack": {ErrorStack},
    "kind": "Infrastructure"
  }
}
```