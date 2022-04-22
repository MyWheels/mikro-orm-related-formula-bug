
create table authors (
  id serial primary key,
  first_name varchar not null,
  surname varchar not null,
  email varchar not null
);

create table books (
  id serial primary key,
  title varchar not null,
  author_id int not null references authors(id)
);

insert into authors (first_name, surname, email) values 
('William', 'Boyd', 'william@bo.yd'),
('Damon', 'Galgut', 'damon@galg.ut');

insert into books (title, author_id) values
('Brazzaville Beach', (select id from authors where first_name = 'William')),
('The Good Doctor', (select id from authors where first_name = 'Damon')),
('The Impostor', (select id from authors where first_name = 'Damon'));
