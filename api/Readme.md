#API Nodejs based on express
## To start developing
```docker-compose up -d ```
to start database.
``` npm start ```
to start dev engine

```mermaid
sequenceDiagram
    Browser->>+api: Hello John, how are you?
    api->>+pgsql: John, can you hear me?
    api->>-Browser: Hi Alice, I can hear you!
```
