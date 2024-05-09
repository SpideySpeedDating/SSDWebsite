const UserModel = {
    id: 'SERIAL PRIMARY KEY',
    auth_id: 'VARCHAR(50) NOT NULL UNIQUE',
    email: 'VARCHAR(255) NOT NULL UNIQUE',
    username: 'VARCHAR(50)',
    gender: 'VARCHAR(50)',
    sexuality: 'VARCHAR(50)',
    age: 'INTEGER'
  };
