# returnOnException - Decorator

A function that will be trigged so that ou can handle the exception as you wish.
The function gives you the error, the context of your class and all the parameters received, respectively.
The function waits for the new information to be returned.

_If provided, the `bubbleException` and `onException` options will be ignored._

---
Suppose you have an API to search for products by store. If the search fails, your API should return a list of default products for the specific store in the request.

## Use case
```typescript
import { Body, Controller, Get, Query, Param } from '@nestjs/common'
import { SearchService } from './search-service'
import { LoggerService } from './logger-service'
import { Product } from './products'
import { SearchDTO } from './search'
import { defaultProducts } from './constants'

@Controller('search')
class SearchController {
  constructor(private readonly service: SearchService) {}
  
  @Get(':storeId')
  public async searchByStoreId(@Param('storeId') storeId: string, @Query() search: SearchDTO): Promise<Product[]> {
    try {
      const products = await this.service.searchByStoreId(storeId, search.value)
      return products
    } catch (error) {
      LoggerService.error(error)
      const products = defaultProducts[storeId]
      return products
    }
  }  
}
```

## Usage
```typescript
import { CatchException } from '@sabbath/logger'
import { Body, Controller, Get, Query, Param } from '@nestjs/common'
import { SearchService } from './search-service'
import { Product } from './products'
import { SearchDTO } from './search'
import { defaultProducts } from './constants'

@Controller('search')
class SearchController {
  constructor(private readonly service: SearchService) {}
  
  @Get(':storeId')
  @CatchException({
    kind: 'Application',
    returnOnException: (_error, _ctx, orderId): Product[] => {
      return defaultProducts[orderId]
    }
  })
  public async searchByStoreId(@Param('storeId') storeId: string, @Query() search: SearchDTO): Promise<Product[]> {
    const products = await this.service.searchByStoreId(storeId, search.value)
    return products
  }  
}
```

## Log output
```text
[ERROR] - {
  "uid": "",
  "timestamp": "2023-09-12T22:45:13.468Z",
  "trigger": {
    "name": "SearchController",
    "method": "searchByStoreId"
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