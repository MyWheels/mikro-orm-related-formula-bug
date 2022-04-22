import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Author } from "./Author";

@Entity({ tableName: "books" })
export class Book {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @ManyToOne(() => Author)
  author!: Author;
}
