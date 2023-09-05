# `@daki/logr` - A Library for Standardizing Logs

## Overview

The `@daki/logr` library is designed to standardize how error logs are captured and recorded in your JavaScript/TypeScript applications. It provides a decorator called `CatchException`, which can be used to wrap methods and capture exceptions, recording them in a predefined format.

## Installation

To start using `@daki/logr`, you can install it via npm or yarn:

```bash
npm install @daki/logr
# or
yarn add @daki/logr
```

## Basic Usage

Here's an example of basic usage of the `CatchException` decorator:

```typescript
import { CatchException } from '@daki/logr';

export class MyClass {
  
  @CatchException({
    kind: 'Application',
    isSync: true,
    onException() {
      this.rollback('this');
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

  public rollback(context: any): void {
    console.log(`rollback called by: ${context}`);
  }
}
```

## Details of the `CatchException` Decorator

The `CatchException` decorator is used to capture exceptions thrown within a method and log them using a logger. Here are the details of the options you can provide to the decorator:

- `bubbleException` (optional): A flag to determine whether the exception should be rethrown after logging (default is not to rethrow).

- `customErrorInstance` (optional): A custom error instance to be thrown or returned when handling exceptions. If provided, this error instance will be thrown or returned instead of the original error.

- `kind` (optional): The type of log event (e.g., 'Application', 'Domain', 'Infra').

- `isSync` (optional): A flag that defines whether the method is synchronous (default is asynchronous).

- `onException` (optional): A callback function to handle captured exceptions. It takes the error and context as parameters.

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