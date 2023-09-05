# `logr-node` - A Library for Standardizing Logs

## Overview

The `logr-node` library is designed to standardize how error logs are captured and recorded in your JavaScript/TypeScript applications. It provides a decorator called `CatchException`, which can be used to wrap methods and capture exceptions, recording them in a predefined format.

## Installation

To start using `logr-node`, you can install it via npm or yarn:

```bash
npm install logr-node
# or
yarn add logr-node
```

## Examples

Here's an example of basic usage of the `CatchException` decorator:

```typescript
import { CatchException } from 'logr-node';

export class MyClass {
  private readonly response: Response

  @CatchException({
    kind: 'Application',
    isSync: true,
    onException() {
      (this as any).rollback('this');
    }
  })
  public functionOnException(param1: any, param2: string): void {
    const error: any = {};
    console.log(error.someProperty.throwErrorNow);
  }

  @CatchException({
    kind: 'Application',
    onException: (err, ctx) => {
      ctx.rollback('ctx');
    }
  })
  public arrowOnException(param1: any, param2: string): void {
    const error: any = {};
    console.log(error.someProperty.throwErrorNow);
  }

  @CatchException({
    kind: 'Application',
    returnOnException(err) {
      return (this as any).response.json({error: 500, message: err.message})
    }
  })
  public functionReturnOnException(param1: any, param2: string): void {
    const error: any = {};
    console.log(error.someProperty.throwErrorNow);
  }
  
  @CatchException({
    kind: 'Application',
    returnOnException: (err, ctx) => {
      return ctx.response.json({error: 500, message: err.message})
    }
  })
  public arrowReturnOnException(param1: any, param2: string): void {
    const error: any = {};
    console.log(error.someProperty.throwErrorNow);
  }

  public rollback(context: any): void {
    console.log(`rollback called by: ${context}`);
  }
}
```

## Details of the `CatchException` Decorator

The `CatchException` decorator is used to capture exceptions thrown within a method and log them using a logger. Here are the details of the options you can provide to the decorator:

- `bubbleException` (optional): A flag to determine whether the exception should be rethrown after logging (default is not to rethrow).

- `customErrorInstance` (optional): If provided, this error instance will be thrown or returned instead of the original error.

- `kind` (optional): The type of log event (e.g., 'Application', 'Domain', 'Infra').

- `isSync` (optional): A flag that defines whether the method is synchronous (default is asynchronous).

- `onException` (optional): A callback function to handle captured exceptions. It takes the error and context as parameters.

- `returnOnException` (optional): A callback function to handle captured exceptions. It takes the error and context as parameters and returns an unknown value.

## Log Format

### Error/Exception
```JSON
{
  "timestamp": "TimestampValue",
  "logger": {
    "name": "ClassName",
    "method_name": "MethodName",
    "params": {
      // Method parameters
    }
  },
  "error": {
    "name": "ErrorName",
    "message": "ErrorMessage",
    "stack": "ErrorStackTrace",
    "kind": "LogEventKind"
  }
}
```