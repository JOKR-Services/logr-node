# pipeParams - Function

A function that will be triggered so that you can deal with the parameters.
The function will give you all parameters in the same order as they were declared in the method the decorator was used in.
The function waits for the return of the new parameters to be logged.

---
Suppose you receive information from a user separately and want to return it in structured object.

## Usage
```typescript
import { catchException } from '@sabbath/logger'
import { userRepository } from './user-repository'
import { User } from './user'
import { AddressDTO } from './address'

const createUserService = catchException(
  async function handleCreateUserService(name: string, age: number, document: string, address: AddressDTO): Promise<User> {
    const userCreated = await userRepository.create(name, age, document, address)
    return userCreated
  },
  {
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
  }
)
```

```typescript
import { catchException, CatchExceptionOptions } from '@sabbath/logger'
import { userRepository } from './user-repository'
import { User } from './user'
import { AddressDTO } from './address'

const options: CatchExceptionOptions = {
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
}

async function handleCreateUserService(name: string, age: number, document: string, address: AddressDTO): Promise<User> {
  const userCreated = await userRepository.create(name, age, document, address)
  return userCreated
}

const createUserService = catchException(handleCreateUserService, options)
```


## Log output
```text
[ERROR] - {
  "uid": "",
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "handleCreateUserService",
    "method": "FUNCTIONAL"
  },
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
  "error": {
    "name": "UserServiceError",
    "message": "UserService fails",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```