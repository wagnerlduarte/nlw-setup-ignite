# Running

- run `npm i`
- run `npx prisma migrate dev` to generate new database
- copy and past the `.env.example` file and rename to `.env`
- run `npm run dev`

# Prisma

- run `npx prisma studio` to open prisma interface
- run `npx prisma generate` to generate the database diagram
  - open the `prisma/ERD.svg` in your browser
- to populete tables run `npx prisma db seed`
