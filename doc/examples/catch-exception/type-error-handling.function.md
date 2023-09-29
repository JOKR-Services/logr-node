# typeErrorHandling - function

We have two ways of handling exceptions: `LOG` and `REGISTER`.
This configuration is ideal if you have a "cascade" of `catchException`
where you are using a dependency that has already been instantiated with the `catchException`.

If you choose the `REGISTER` type, the exception will be logged in our service
and will be logged as soon as it finds a "parent" instance where the handling type is `LOG`.

---
Suppose you have the following structure

## Use case

```typescript
import { catchException } from '@daki/logr'
import { User } from './user'
import { userORM } from './user-orm'

export const getUserByToken = catchException(
  function getUserByToken(token: string): Promise<User> {
    return userORM.getOne({
      where: { userToken: token }
    })
  }, 
  {
    kind: 'Infrastructure',
    bubbleException: true
  }
)
```

```typescript
import { catchException } from '@daki/logr'
import * as userRepository from './user-repository'
import * as orderService from './order-service'
import { Order } from './order'
import { Authenticated } from './auth'

export const getUserOrders = catchException(
  async function getUserOrders(authenticated: Authenticated): Promise<Order[]> {
    const user = await userRepository.getUserByToken(authenticated.token)
    return orderService.getByUserId(user.id)
  },
  {
    kind: 'Application'
  }
)
```
If an exception occurs in `UserRepository` in the `getUserByToken` function, `catchException` will log the error
and then pass it on to its parent functions.
Since `OrderController` is a parent class of `UserRepository` and also uses `catchException`,
the `catchException` instance of that function will also log the same error.
The scenario becomes even more complicated, because in addition to registering the same error twice,
the two records will have different information.

_The log of the getUserByToken function will be something like this:_
```text
Database fails {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "getUserByToken",
    "method_name": "FUNCTIONAL",
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

_And the log of the getUserOrders function will be something like this:_

```text
Database fails {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "getUserOrders",
    "method_name:": "FUNCTIONAL",
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
import { catchException } from '@daki/logr'
import { User } from './user'
import { userORM } from './user-orm'

export const getUserByToken = catchException(
  function getUserByToken(token: string): Promise<User> {
    return userORM.getOne({
      where: { userToken: token }
    })
  }, 
  {
    kind: 'Infrastructure',
    typeErrorHandling: 'REGISTER'
  }
)
```

```typescript
import { catchException } from '@daki/logr'
import * as userRepository from './user-repository'
import * as orderService from './order-service'
import { Order } from './order'
import { Authenticated } from './auth'

export const getUserOrders = catchException(
  async function getUserOrders(authenticated: Authenticated): Promise<Order[]> {
    const user = await userRepository.getUserByToken(authenticated.token)
    return orderService.getByUserId(user.id)
  },
  {
    kind: 'Application'
  }
)
```

## Log output
```text
Database fails {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "getUserByToken",
    "method_name": "FUNCTIONAL",
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