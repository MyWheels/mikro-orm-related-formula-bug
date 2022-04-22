import { Entity, Formula, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "authors" })
export class Author {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  surname!: string;

  @Formula((alias) => {
    return `concat_ws(' ',
      nullif(${alias}.first_name, ''),
      nullif(${alias}.surname, '')
    )`;
  })
  fullName!: string;

  @Property()
  email!: string;
}
