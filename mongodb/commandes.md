```javascript
mongosh --port 27017
use admin
db.auth("mongo_user",passwordPrompt())
// ou
mongosh "mongodb://mongo_user:example1234@mongodb:27017/database_name"

show dbs
```
