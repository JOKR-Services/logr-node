# Daki Nodejs Logger

## Utilização

Para correta utilização nessa primeira versão, será necessário instânciar o logger utilizando o decorator `UseLoggerError`. Para isso, utilize algum logger implementado dentro de `src/infra` e utilize da seguinte forma: 

```
@UseLoggerError(new StdoutLogger())
class SuaClasse {}
```

Ao colocar esse decorator, o logger estará settado mas ainda não irá capturar as exceções. Para capturar corretamente, utilize o decorator `@CatchException()`, como no exemplo abaixo: 


```
@UseLoggerError(new StdoutLogger())
class SuaClasse {
  @CatchException()
	basicFunction(someParam: any, teste: string) {}
}
```

## Utilizando o exemplo

Esse projeto conta com um exemplo funcional, encontrado em `src/examples/using-logger-in-a-basic-function.ts`. Para utilizar, bastar rodar o seguinte comando

``` 
yarn run:basic
```