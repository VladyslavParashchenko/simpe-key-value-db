## Simple key-value database using RabbitMQ 

### Database has three operations:

- #### READ
    Input message has such structure: 
        ```
            { "action": "GET", "payload": { "key": "key" } }
        ```
        
    Response message: 
        ```
            { "action": "GET", "payload": { "key":"key","value":"value" } }
        ```
- #### INSERT
    Input message has such structure: 
        ```
            { action: 'SET', payload: { "key":"key","value":"value" } }
        ```
        
    Response message: 
        ```
            { "action": "SET", "payload": { "key":"key","value":"value" } }
        ```
- #### DELETE
    Input message has such structure: 
        ```
            { action: "DELETE', payload: { "key":"key" } }
        ```    
    Response message: 
        ```
            { "action": "DELETE", "payload": { "key":"key","value":"removed value" } }
        ```

#### HOW TO USE:
 1. Rename `.env.example` to `.env` and set your env variables
 1. Rename `backups` and `logs` and mount this dir to app container
 2. Run services using `docker-compose`
 3. Push messages to `in-queue` and listen `out-queue` for getting response
