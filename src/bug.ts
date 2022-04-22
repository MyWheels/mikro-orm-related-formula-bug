import "reflect-metadata";
import path from "path";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Author } from "./models/Author";
import { Book } from "./models/Book";

(async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    debug: true,
    entities: [path.join(__dirname, "/models/*")],
    clientUrl: "postgresql://postgres:password@localhost:15432",
    type: "postgresql",
  });

  const em = orm.em.fork();

  // This works
  await em.findOneOrFail(Author, {
    fullName: "Damon Galgut",
  });
  // select "a0".*, concat_ws(' ', nullif("a0".first_name, ''), nullif("a0".surname, '') ) as "full_name" from "authors" as "a0" where concat_ws(' ', nullif("a0".first_name, ''), nullif("a0".surname, '') ) = 'Damon Galgut' limit 1

  // This works
  await em.findOneOrFail(Book, {
    author: {
      fullName: "Damon Galgut",
    },
  });
  // select "b0".* from "books" as "b0" left join "authors" as "a1" on "b0"."author_id" = "a1"."id" where concat_ws(' ', nullif("a1".first_name, ''), nullif("a1".surname, '') ) = 'Damon Galgut' limit 1

  // This works
  await em.findOneOrFail(Book, {
    $or: [
      {
        author: {
          fullName: "Damon Galgut",
        },
      },
      {
        author: {
          email: "damon@galg.ut",
        },
      },
    ],
  });
  // select "b0".* from "books" as "b0" left join "authors" as "a1" on "b0"."author_id" = "a1"."id" where (concat_ws(' ', nullif("a1".first_name, ''), nullif("a1".surname, '') ) = 'Damon Galgut' or "a1"."email" = 'damon@galg.ut') limit 1

  // This doesn't work
  await em.findOneOrFail(Book, {
    author: {
      $or: [
        {
          fullName: "Damon Galgut",
        },
        {
          email: "damon@galg.ut",
        },
      ],
    },
  });
  // select "b0".* from "books" as "b0" left join "authors" as "a1" on "b0"."author_id" = "a1"."id" where ("b0"."fullName" = 'Damon Galgut' or "a1"."email" = 'damon@galg.ut') limit 1

  await orm.close();
})();
