# hideParams - Decorator

If supplied, no parameters received by the decorator will be logged.

---
Suppose you have a login method where the data received is sensitive and should not be logged.

## Usage
```typescript
import { Request, Response } from 'express'
import { catchException } from '@sabbath/logger';
import { Controller, Post } from '@nestjs/common'
import { loginService } from './login-service'

const login = catchException(
  async function handleLogin(req: Request, res: Response): Promise<void> {
    const credentials = req.body
    const logged = await loginService.exec(credentials)

    res.json(logged)
  },
  {
    kind: 'Application',
    hideParams: true
  }
)
```

```typescript
import { Request, Response } from 'express'
import { catchException, CatchExceptionOptions } from '@sabbath/logger';
import { Controller, Post } from '@nestjs/common'
import { loginService } from './login-service'

const options: CatchExceptionOptions = {
  kind: 'Application',
  hideParams: true
}

async function handleLogin(req: Request, res: Response): Promise<void> {
  const credentials = req.body
  const logged = await loginService.exec(credentials)

  res.json(logged)
}

const login = catchException(handleLogin, options)
```

## Log output
```text
[ERROR] - {
  "uid": "",
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "handleLogin",
    "method": "FUNCTIONAL"
  },
  "params": ["WAS HIDDEN"],
  "error": {
    "name": "LoginError",
    "message": "Login fails",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```