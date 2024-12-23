## 1. add extensions
denoland.vscode-deno

## 2. install docker and supabase
execute following commands one by one.

```
# install deno
brew install deno
# install docker
brew install --cask docker

# install supabase
brew install supabase/tap/supabase
```

## 3. run supabase

```
supabase init
supabase start
```

## 4. update prisma schema

```
npx prisma db push

npx prisma generate
```

## 5. prisma studio

[prisma studio](http://127.0.0.1:54323)


### execute seed

see [prisma seed](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)

```
npm install -D typescript ts-node @types/node
npx prisma db seed
```
