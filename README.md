# `@daki/logr` - A Library for Standardizing Logs

## Overview

This TypeScript log standardization library offers an easy and flexible way to standardize your application's logs.
It offers the ability to customize the logging behavior of exceptions, transactions and validations, allowing you to adapt the library to the specific needs of your project.

## Installation

To start using `@daki/logr`, you can install it via npm or yarn:

```bash
npm install @daki/logr
# or
yarn add @daki/logr
```

## Main features
- Catch Exception
- Catch Transaction [TODO]

### Catch exception
We provide two ways to catch exceptions:
- the `CatchException` decorator to use in your methods
- the `catchException` function so that you don't have to use classes to use the library

#### Configuration options
| Option              | Type                | Required/Optional | Default value | Description                                                                                                                                                                                                        | Example using function                                                                                                          | Example using decorator                                                                                                           |
|---------------------|---------------------|-------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| bubbleException     | boolean             | Optional          | true          | If set to true, the original exception will be thrown after logging, allowing the exception to continue its propagation.                                                                                           | [Function](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/bubble-exception.function.md)      | [Decorator](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/bubble-exception.decorator.md)      |
| customErrorInstance | object or function  | Optional          | null          | Allows you to specify a custom error instance to be thrown, useful for customizing the exception that is logged.                                                                                                   | [Function](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/custom-error-instance.function.md) | [Decorator](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/custom-error-instance.decorator.md) |
| hideParams          | boolean             | Optional          | false         | If set to true, the parameters that have been passed to the method will not be recorded, keeping sensitive data private.                                                                                           | [Function](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/hide-params.function.md)           | [Decorator](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/hide-params.decorator.md)           |
| isSync              | boolean             | Optional          | false         | Defines whether the method is synchronous, indicating whether or not it waits for responses from external calls.                                                                                                   |                                                                                                                                 |                                                                                                                                   |
| kind                | string              | Optional          | null          | Defines the type of exception to be logged, allowing exceptions to be categorized into different groups or contexts.                                                                                               |                                                                                                                                 |                                                                                                                                   |
| onException         | function            | Optional          | null          | It allows you to provide a custom function to handle the registered exception, executing specific actions when an exception occurs.                                                                                | [Function](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/on-exception.function.md)          | [Decorator](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/on-exception.decorator.md)          |
| pipeParams          | function            | Optional          | null          | It allows you to use a function to process and transform the parameters before they are recorded, adapting them to the desired format.                                                                             | [Function](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/pipe-params.function.md)           | [Decorator](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/pipe-params.decorator.md)           |
| returnOnException   | function            | Optional          | null          | It offers the ability to provide a custom function to handle the logged exception and return new information or values after the exception has been logged.                                                        | [Function](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/return-on-exception.function.md)   | [Decorator](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/return-on-exception.decorator.md)   |    
| typeErrorHandling   | "LOG" or "REGISTER" | Optional          | "LOG"         | Defines the type of exception handling to be applied: LOG or REGISTER. If set to LOG, the exception will be logged. If set to REGISTER, the exception will be logged in the service to be logged in higher layers. | [Function](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/type-error-handling.function.md)   | [Decorator](https://github.com/JOKR-Services/logr-node/blob/main/doc/examples/catch-exception/type-error-handling.decorator.md)   |
#### Basic usage
##### Decorator:
```typescript
import { CatchException } from '@daki/logr';

export class UserController {
  @CatchException({
    kind: 'Application',
  })
  public async getById(id: string) {
    // Your logic for getting a user
  }
}
```

##### Function:
```typescript
import { catchException } from '@daki/logr';

export const getUserById = catchException(async (id: string) => {
  // Your logic for getting a user
}, {
  kind: 'Application',
});
```

```typescript
import { catchException, CatchExceptionOptions } from '@daki/logr';

const options: CatchExceptionOptions = {
  kind: 'Application',
}

async function handleGetUserById(id: string) {
  // Your logic for getting a user
}

export const getUserById = catchException(handleGetUserById, options);
```

#### Log output
```text
User is blocked {
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "UserController",
    "method": "getById",
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