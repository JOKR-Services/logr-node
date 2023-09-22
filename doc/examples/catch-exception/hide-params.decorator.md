# hideParams - Decorator

If supplied, no parameters received by the decorator will be logged.

---
Suppose you have a login method where the data received is sensitive and should not be logged.

## Usage
```typescript
import { CatchException } from '@sabbath/logger'
import { Body, Controller, Post } from '@nestjs/common'
import { LoginService } from './login-service'
import { CredentialsDTO } from './credentials'
import { Logged } from './logged'

@Controller('Login')
class LoginController {
  constructor(private readonly service: LoginService) {}

  @CatchException({
    kind: 'Application',
    hideParams: true
  })
  @Post()
  public async exec(@Body() credentials: CredentialsDTO): Promise<Logged> {
    const logged = await this.service.exec(credentials)
    return logged
  }
}
```

## Log output
```text
[ERROR] - {
  "uid": "",
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "LoginController",
    "method": "exec"
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