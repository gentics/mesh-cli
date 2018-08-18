# Gentics Mesh CLI

## Installation
```
yarn global add mesh-cli
```
or
```
npm install mesh-cli -g
```

## Configuration

```
mesh-cli configure

? Endpoint http://localhost:8080
? Generate a new API key? Yes
? Enter username admin
? Enter password [hidden]
```

## Usage

```
 Usage: mesh-cli [options] [command]

  CLI which can be used to interact with a Gentics Mesh server.

  Options:

    -V, --version                     output the version number
    -e, --endpoint [url]              API endpoint. (default: http://localhost:8080)
    -k, --key [key]                   API Key to be used
    -d, --debug                       Turn on debug logging
    -h, --help                        output usage information

  CLI:

    configure                         Configure the CLI
    help          [cmd]               display help for [cmd]

  Administration:

    docker  | d                       Docker specific commands
    sync    | s                       Sync specific commands
    admin   | a                       Administration specific commands
    reset         [uuid]              Reset the error state of the job.

  Element:

    list    | l   [type]              List elements
    remove  | rm  [type] [id]         Remove element
    add     | a   [type] [name]       Add element
    get     | g   [type] [id]         Get an element
    update  | u   [type] [id]         Update an element

  User:

    passwd  | p   [name]              Change the password.
    chmod   | c   [path]              Change permissions on the given path.
    key     | k   [name/uuid]         Generate a new API key.

  Schema:

    validate | v  [file]              Validate the schema via stdin or file.
    link          [project] [schema]  Link the schema with a project.
    unlink        [project] [schema]  Unlink the schema from a project.



  Types:

  -  user,group,role,project,schema,tagfamily,job,plugin

  Examples:

  -  Add a new project named demo2 to the system

    $ mesh-cli add project demo2 --schema folder

  -  List all schemas that are linked to the demo project

    $ mesh-cli list projectSchemas demo

  -  Short form to list all projects

    $ mesh-cli l p

  -  Link the schema with the given uuid to the demo project

    $ mesh-cli link demo 09ac57542fde43ccac57542fdeb3ccf8
```

## Open Tasks

* Return error on unknown commands
* Add branches, branching
* Add linking schemas to branches
* Add recursive options to delete
* Add publish, unpublish commands
* Add language, branch option to node get
* Add error on invalid token
* Document sub commands
* Add examples to sub commands
* Publish to NPM
* Implement Link/Unlink
