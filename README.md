# Github API

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

A REST API in Node.js that implememts basic github api.


## Contents
- [Requirements](#requirements)
- [Documentation](#documentation)
    - [Install Dependencies](#install-dependencies)
    - [Run](#run)
    - [Routes](#routes)
    - [HTTP response status codes](#http-response-status-codes)


## Requirements
- Node.js: v16.5.0 < 17

## Documentation

### Install Dependencies
```bash
npm install
``` 

### Run
```bash
npm start
```

### Routes
```http
GET /get-repositories
```

Query parameters:
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `organization` | `string` | **Required**. The organization name for which the repositories to be fetched |
| `repositories` | `integer` | The maximum number of repositories to be fetched. Default: 4 |
| `committees` | `integer` | The maximum number of committees/contributors to be fetched for each repository. Default: 2 |



### HTTP response status codes


| Status code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | Bad Request |
| 500 | Internal Server Error |


