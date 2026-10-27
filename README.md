\# safe-async-handler



A lightweight TypeScript utility that forwards errors from asynchronous Express route handlers to Express error-handling middleware.



Useful for Express 4 applications, where rejected promises from async handlers are not automatically forwarded to error middleware.



\## Installation



```bash

npm install safe-async-handler

```



Express must also be installed in your application.



\## Usage



```typescript

import express from 'express';

import { safeAsyncHandler } from 'safe-async-handler';



const app = express();



app.get(

&#x20; '/users',

&#x20; safeAsyncHandler(async (\_req, res) => {

&#x20;   const users = await fetchUsers();

&#x20;   res.json(users);

&#x20; })

);



app.use((err, \_req, res, \_next) => {

&#x20; console.error(err);

&#x20; res.status(500).json({ error: 'Internal server error' });

});

```



Replace `fetchUsers()` with your own asynchronous function.



\## How it works



\- Forwards rejected promises to Express error middleware.

\- Forwards synchronous exceptions thrown by the handler.

\- Supports handlers that return ordinary values as well as promises.

\- Does not require an additional runtime dependency.



\## Compatibility



\- Node.js 18 or later.

\- Express 4 and Express 5.

\- TypeScript and JavaScript projects using ESM imports.



Express 5 automatically forwards rejected promises from route handlers. This utility is primarily useful for Express 4 applications.



\## API



\### `safeAsyncHandler(handler)`



Wraps a route handler and forwards errors to Express's `next()` function.



The handler receives the standard Express `req`, `res`, and `next` arguments.



\## License



MIT

