---
sidebar_position: 2
---

# Collections

## Overview

### Collection
A Collection refers to a grouping or container for related data records. The term is often associated with NoSQL, non-relational databases, particularly document-oriented databases like MongoDB. 

### Document
A Document refers to an individual data entry within a collection. It is essentially a single instance of data that conforms to the structure defined by the collection. It typically consists of key-value pairs. Each key represents a field, and the corresponding value is the data associated with that field.

### Field
A Field refers to specific piece of data or attribute within a document.
EZbase supports the following field types:

| Field  | Example values |
| ----- | --- |
| string  | `"", "Hello World!"`  |
| number | `0, 4, -5, 1.9`  |
| bool |` true, false` |
| array | `[], [1, 4, 5], ["apples", "oranges", "bananas"]`  |
| object | `const person = { firstName: 'John', lastName: 'Doe', age: 30, email: 'john.doe@example.com', isStudent: false };` |

## Creating Collections & Records

There are two ways to make a collection and its subsequent records:
1.  Admin UI
2.  API (through client-side SDKs)

A typical way utilizing these two would be to create the collection using the Admin UI and then manage the records within the collection with the API using the client-side SDKs.  
An example of a collection in the Admin UI is as follows: