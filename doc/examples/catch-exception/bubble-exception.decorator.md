# bubbleException - Decorator

If you provide the `bubbleException = true` option, we will log the error, and rethrow the exception with the same error instance received.

---

## Use case
```typescript
import { Controller, Get, Param } from '@nestjs/common'
import { UserService } from './user-service'
import { LoggerService } from './logger-service'
import { User } from './user'

@Controller('user')
class UserController {
  constructor(private readonly service: UserService) {}

  @Get(':id')
  public async getById(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.service.getById(id)
      return user
    } catch (error) {
      LoggerService.error(error)
      throw error
    }
  }  
}
```

## Usage
```typescript
import { CatchException } from '@sabbath/logger'
import { Controller, Get, Param } from '@nestjs/common'
import { UserService } from './user-service'
import { User } from './user'

@Controller('user')
class UserController {  
  constructor(private readonly service: UserService) {}

  @CatchException({  
    kind: 'Application',  
    bubbleException: true
  })
  @Get(':id')
  public async getById(@Param('id') id: string): Promise<User> {
    const user = await this.service.get(id)
    return user
  }  
}
```

## Log output
```text
[ERROR] - {
  "uid": "",
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "UserController",
    "method": "getById"
  },
  "params": ["c4baf266-13c9-4d6e-93a7-ff8dccde0905"],
  "error": {
    "name": "UserServiceError",
    "message": "User is blocked",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```