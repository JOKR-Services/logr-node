# pipeParams - Decorator

A function that will be triggered so that you can deal with the parameters.
The function will give you all parameters in the same order as they were declared in the method the decorator was used in.
The function waits for the return of the new parameters to be logged.

---
Suppose you receive information from a user separately and want to return it in structured object.

## Usage
```typescript
import { CatchException } from '@daki/logr'
import { Injectable } from '@nestjs/common'
import { UserRepository } from './user-repository'
import { User } from './user'
import { AddressDTO } from './address'

@Injectable()
class UserService {
  constructor(private readonly repository: UserRepository) {}

  @CatchException({
    kind: 'Application',
    pipeParams: (name: string, age: number, document: string, address: AddressDTO) => {
      const newParams = {
        User: {
          Name: name,
          Age: age,
          Document: '**********',
          Address: {
            City: address.city
          }
        }
      }
      
      return newParams
    }
  })
  public async create(name: string, age: number, document: string, address: AddressDTO): Promise<User> {
    const userCreated = await this.repository.create(name, age, document, address)
    return userCreated
  }
}
```

## Log output
```text 
UserService fails {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "logger": {
    "name": "UserService",
    "method_name": "create",
    "params": [
      {
        "User": {
          "Name": "John",
          "Age": 35,
          "Document": "**********",
          "Address": {
            "City": "New York"
          }
        }
      }
    ],
  },
  "error": {
    "name": "UserServiceError",
    "message": "UserService fails",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```