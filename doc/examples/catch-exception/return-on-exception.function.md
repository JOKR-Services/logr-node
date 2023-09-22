# returnOnException - Function

A function that will be trigged so that ou can handle the exception as you wish.
The function gives you the error, the context of your class and all the parameters received, respectively.
The function waits for the new information to be returned.

_Since you're using it with functions, the context will always be undefined._

_If provided, the `bubbleException` and `onException` options will be ignored._

---
Suppose you have an API to search for products by store. If the search fails, your API should return a list of default products for the specific store in the request.

## Use case
```typescript
import { Request, Response } from 'express'
import { searchService } from './search-service'
import { loggerService } from './logger-service'
import { Product } from './products'
import { SearchDTO } from './search'
import { defaultProducts } from './constants'

async function searchByStoreId(req: Request, res: Response): Promise<void> {
  const storeId = req.params.storeId
  const searchValue = req.query.value
  
  try {
    const products = await searchService.searchByStoreId(storeId, searchValue)
    res.json(products)
  } catch (error) {
    LoggerService.error(error)
    const products = defaultProducts[storeId]
    res.json(products)
  }
}
```

## Usage
```typescript
import { catchException } from '@sabbath/logger'
import { Request, Response } from 'express'
import { searchService } from './search-service'
import { loggerService } from './logger-service'
import { Product } from './products'
import { SearchDTO } from './search'
import { defaultProducts } from './constants'

const searchByStoreId = catchException(
  async function handleSearchByStoreId(req: Request, res: Response): Promise<void> {
    const storeId = req.params.storeId
    const searchValue = req.query.value

    const products = await searchService.searchByStoreId(storeId, searchValue)
    res.json(products)
  },
  {
    kind: 'Application',
    returnOnException: (_error, _ctx, req, res): Promise<void> => {
      const storeId = req.params.storeId
      res.json(defaultProducts[orderId])
    }
  }
)
```

```typescript
import { catchException, CatchExceptionOptions } from '@sabbath/logger'
import { Request, Response } from 'express'
import { searchService } from './search-service'
import { loggerService } from './logger-service'
import { Product } from './products'
import { SearchDTO } from './search'
import { defaultProducts } from './constants'

const options: CatchExceptionOptions = {
  kind: 'Application',
  returnOnException: (_error, _ctx, req, res): Promise<void> => {
    const storeId = req.params.storeId
    res.json(defaultProducts[orderId])
  }
}

async function handleSearchByStoreId(req: Request, res: Response): Promise<void> {
  const storeId = req.params.storeId
  const searchValue = req.query.value

  const products = await searchService.searchByStoreId(storeId, searchValue)
  res.json(products)
}

const searchByStoreId = catchException(handleSearchByStoreId,options)
```

## Log output
```text
[ERROR] - {
  "uid": "",
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "handleSearchByStoreId",
    "method": "FUNCTIONAL"
  },
  "params": [
    "c4baf266-13c9-4d6e-93a7-ff8dccde0905",
    {
      "value": "Smartphone"
    }
  ],
  "error": {
    "name": "SearchError",
    "message": "Search fails",
    "stack": {ErrorStack},
    "kind": "Application"
  }
}
```

## API output
```JSON
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99
  },
  {
    "id": 2,
    "name": "Smartphone",
    "price": 499.99
  },
  {
    "id": 3,
    "name": "Headphones",
    "price": 79.99
  },
  {
    "id": 4,
    "name": "Tablet",
    "price": 299.99
  },
  {
    "id": 5,
    "name": "Camera",
    "price": 399.99
  }
]
```