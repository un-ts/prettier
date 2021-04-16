-- this is a comment

SELECT *
FROM
tbl
WHERE
  foo = 'bar';


  UPDATE a SET id = 1 WHERE name IN (SELECT name FROM b)
