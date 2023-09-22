# bubbleException - Function

If you provide the `bubbleException = true` option, we will log the error, and rethrow the exception with the same error instance received.

---

## Use case
```typescript
import { Request, Response } from 'express'
import { userService } from './user-service'
import { loggerService } from './logger-service'

async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id)
    const user = await userService.getById(id)
    res.json(user)
  } catch (error) {
    loggerService.error(error)
    throw error
  }
} 
```

## Usage
```typescript
import { Request, Response } from 'express'
import { catchException } from '@sabbath/logger';
import { userService } from './user-service';

const getUserById = catchException(
  async function handleGetUserById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id)
    const user = await userService.getById(id)
    res.json(user)
  },
  {
    kind: 'Application',
    bubbleException: true
  }
)
```

```typescript
import { Request, Response } from 'express'
import { catchException, CatchExceptionOptions } from '@sabbath/logger';
import { userService } from './user-service';

const options: CatchExceptionOptions = {  
  kind: 'Application',
  bubbleException: true
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
[ERROR] - {
  "uid": "",
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "handleGetUserById",
    "method": "FUNCTIONAL"
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