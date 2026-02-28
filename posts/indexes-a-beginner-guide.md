---
title: Database Indexes Explained Simply — With Dessert!
date: 2026-02-23
tags:
  - database
  - indexes
  - sql
category: Databases
---

In this blog, we will be discussing what database indexes are. So, for this blog, we will go with the following definition of an index.

**"An index is a data structure that helps a database retrieve rows faster by maintaining a sorted reference of one or more columns."**

Let's gain a clear understanding of the above definition by examining the purpose of indexes.

When we create a table using SQL in a database, we typically set the table name, columns, and their data types during initial setup, as we do not know how we will query the table. And we define a primary key as well, which is used to uniquely identify a row in that table. Many connections will use that table to fetch data to serve to clients or possibly use it in transactions. People won't let you sleep if the database is returning queries slowly. We need to make it faster, and that's the purpose of the index — to make queries run faster and reduce full table scans.

Or maybe the main purpose of an index is just so that the developer can sleep. After all, there's nothing scarier than a slow production query right before bedtime. Most databases automatically create an index on the primary key, but for other commonly queried columns, it's up to you to add them smartly.

So let's look at an analogy to get the idea inside your head and later some food in our stomach as well, because you are going to get hungry after reading this, trust me.

Imagine you are a new chef in a bakery and you are just getting used to it. New items come in, such as Molten Chocolate Lava Stack, Strawberry Cream Puff Delight, Vanilla Bean Custard Tart, Blueberry Cheesecake Slice, Nutella Hazelnut Croissant, Almond Butter Chocolate Chip Cookie, and many more. And you just arranged them randomly at any counter at any level, let's say there are 3 counters, each with 2 rows. So a customer comes in, he asks for a Red Velvet Cream Cake, you look where it is, and you try searching, it takes 20 seconds to just find where it is, at which counter, and in which row. Again, you want to take orders faster, right? You don't want to make people wait. Remember, the sleeping analogy sounds scary, right?

Now imagine this happening in a real database. Every time a query runs, if the database has to scan every row just to find the data, it's the same as you scanning every counter for that cake. That's what we call a full table scan — and it's not delicious. If your database does too many of those, your bakery ain't gonna get positive reviews.

What if you maintained a menu at the front counter — neatly listing which dessert is placed at which counter and which row? You don't have to search anymore — just look up the name on the menu and go straight to the right spot. Boom. Red Velvet Cream Cake is ready within a few seconds at the table. I am getting hungry while writing this, anyway, so here the menu card is working like an index for a database.

Now let's look at indexes in action. Let's create the table below.

**Create Table:**

```sql
CREATE TABLE `chefs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `chef_hidden_recipe` text,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

I have inserted 10 rows into it like below:

```
*************************** 1. row ***************************
id: 1
first_name: First86114
last_name: Last26913
email: user76223@example.com
city: Delhi
country: UK

*************************** 2. row ***************************
id: 2
first_name: First64989
last_name: Last5272
email: user31393@example.com
city: Chennai
country: India
```

Here, the mail and everything could be duplicated. Although in real-world systems emails are usually unique, for the sake of this blog, we allow duplicates. Now we want to run the following query:

```sql
select id, first_name, last_name, email, city, country from chefs where email = 'user53548@example.com';
```

It returned this:

```
*************************** 1. row ***************************
id: 142627
first_name: First6835
last_name: Last74811
email: user53548@example.com
city: Chennai
country: USA

1 row in set (0.09 sec)
```

Now it returned the result under 1 sec. Hmmmm.... Maybe index is just used to scare people away from databases; they have no use case. Just kidding hehe.

The table is very short; your machine can easily search through 10 records within a second. Let's increase the count, and as mentioned, the data could be repeated since I simply want to increase the count. We have increased the count to 4095109 records.

Let's run it this way:

```sql
select id, first_name, last_name, email, city, country from chefs where email = 'user53543@example.com';

28 row in set (5.07 sec)
```

It returned 28 records in 5.07s.

The below query took 9s. That's 9 seconds of pure awkward eye contact with your manager during a live demo.

```sql
select id, first_name, last_name, email, city, country from chefs where email IN('user53548@example.com','user88636@example.com', 'user53543@example.com');

98 row in set (9.00 sec)
```

Now I have copied the table with data as chefs_v2 and created an index on it using the following query:

```sql
create index ix_chefs_v2_email on chefs_v2(email);

Query OK, 0 rows affected (18.80 sec)
```

Let's race:

```sql
select id, first_name, last_name, email, city, country from chefs
where email IN('user53548@example.com','user88636@example.com','user53543@example.com');

98 rows in set (9.13 sec)
```

```sql
select id, first_name, last_name, email, city, country from chefs_v2
where email IN('user53548@example.com','user88636@example.com','user53543@example.com');

98 rows in set (0.05 sec)
```

Well, well, well, isn't the time insanely faster? It's like typing "GETTHEREVERYFASTINDEED" in GTA — only this time, it's your query flying, not a stolen sports car.

After creating an index on the email column in chef_v2, what happened was that the database created an auxiliary data structure that arranged the emails in a certain order that allows it to apply algorithms to that index to make queries run faster. Think of it as similar to sorting a dataset and applying binary search on it to make retrieval faster. And the index is then mapped to the primary key, which can be used to fetch the other columns from the table. If you observe carefully, to execute the create index it took around 18s, that is because you need to do a full table scan and order the email column, which would take some time.

Now, why don't we create an index on every column? Well, first of all, indexes take up space since we're creating a separate data structure. And if you're not going to use a particular column in joins or WHERE clauses, you're just wasting space — like installing a home gym just to use it as a charging station for your phone and a shelf for pizza boxes.

But even if you have unlimited storage (hello, cloud billionaires), creating an index takes time, and so does updating it. Every time you insert new records, the index also needs to be updated. That means more work during writes, which can slow things down. So while indexes make reads faster, they can make writes slower.

That's why you need to create indexes smartly — not just everywhere like confetti at a surprise party.

It's not mandatory to have an index on a single column; you could have an index on more than one column, which are called composite indexes. But they are beyond the scope of this article, as the main reason is to help you become familiar with indexes.

Indexes generally fall into two main types:

- **Clustered** — Stores the actual table data in the order of the index — there's only one per table
- **Non-clustered** — Stores a separate structure with pointers to the actual table rows — you can have many of these

As you can deduce from the above statements, the index on the primary key is clustered, and the index on email is non-clustered.

Indexes are one of those things that seem mysterious at first but make total sense once you understand their job: get your data faster without making the database sprint through every row. Whether it's dessert listings or user records, a good index can save seconds, improve performance, and yes — maybe even help the developer finally get some sleep, or at least reduce the number of existential questions you ask your EXPLAIN plan at midnight.

I'm aware that Delhi doesn't belong to the UK, and Chennai didn't secretly move to the USA overnight. But the product guy insisted, "It makes the data look global." I gave up. Take it up with him.

Thanks for reading — now go create smart indexes, and sleep like a well-queried database.
