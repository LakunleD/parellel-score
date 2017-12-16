/users
POST
payload - firstName, lastName, email, password, type
creates a new user

/users
GET
returns all users

/users/auth
POST
payload - email, password

/news
GET
retrieves all news in the db

/news
POST
payload-title, body, creator
create a new news item

/news/{id}
GET
returns the new item with id specified 


/news/{id}
PUT
payload - title, body
update the new item with id specified 