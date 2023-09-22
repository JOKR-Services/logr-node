# customErrorInstance - Decorator

If you provide the `customErrorInstance` option, we will log the original error, but we will throw a new exception with the provided instance of the error, and the original error will be logged.

---
Suppose you have a NestJS API with a fetch user method, this method needs to throw an exception of type NotFounException so that NestJS can handle the return correctly, but your service throws a different type of exception.

## Use case
```typescript
import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
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
      throw new NotFoundException('User not found')
    }
  }  
}
```

So to maintain the expected behavior, we provide the option to customize the error instance with `customErrorException`.
## Usage
```typescript
import { CatchException } from '@sabbath/logger'
import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { UserService } from './user-service'
import { User } from './user'

@Controller('user')
class UserController {  
  constructor(private readonly service: UserService) {}

  @CatchException({  
    kind: 'Application',  
    customErrorInstance: new NotFoundException('User not found')
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

## API output
```JSON
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "User not found."
}
```