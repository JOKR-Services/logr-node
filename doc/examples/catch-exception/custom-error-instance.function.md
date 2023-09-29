# customErrorInstance - Function

If the `customErrorInstance` option is provided, we will log the original error, but we will throw a new exception with the provided instance of the error, and the original error will be logged.

---
Suppose you have an ExpressJs API, a global handler for specific exceptions and a fetch user function, this method needs to fire a specific exception, so that your API can handle the return correctly, but your service fires a different type of exception.

## Use case
```typescript
import { Request, Response } from 'express'
import { NotFoundException } from './errors'
import { userService } from './user-service'
import { loggerService } from './logger-service'

async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id)
    const user = await userService.getById(id)
    res.json(user)
  } catch (error) {
    loggerService.error(error)
    throw new NotFoundException('User not found')
  }
} 
```

So to maintain the expected behavior, we provide the option to customize the error instance with `customErrorException`.

## Usage
```typescript
import { Request, Response } from 'express'
import { catchException } from '@daki/logr';
import { NotFoundException } from './errors';
import { userService } from './user-service';

const getUserById = catchException(
  async function handleGetUserById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id)
    const user = await userService.getById(id)
    res.json(user)
  },
  {
    kind: 'Application',
    customErrorInstance: new NotFoundException('User not found')
  }
)
```

```typescript
import { Request, Response } from 'express'
import { catchException, CatchExceptionOptions } from '@daki/logr';
import { NotFoundException } from './errors';
import { userService } from './user-service';

const options: CatchExceptionOptions = {  
  kind: 'Application',
  customErrorInstance: new NotFoundException('User not found')  
}

async function handleGetUserById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const user = await userService.getById(id)
  res.json(user)
}

const getUserById = catchException(handleGetUserById, options)
```
#### Log output
```text
User is blocked {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "handleGetUserById",
    "method_name": "FUNCTIONAL",
    "params": ["c4baf266-13c9-4d6e-93a7-ff8dccde0905"],
  },
  "error": {
    "name": "UserServiceError",
    "message": "User is blocked",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```

#### API output
```JSON
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "User not found."
}
```