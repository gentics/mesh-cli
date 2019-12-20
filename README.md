# PROJECT ARCHIVED

This project has been archived and will no longer be maintained.

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
mesh configure

? Endpoint http://localhost:8080
? Generate a new API key? Yes
? Enter username admin
? Enter password [hidden]
```

## Usage

```

  Usage: mesh [options] [command]

    CLI which can be used to interact with a Gentics Mesh server.
    Use the configure command to setup the CLI.


  Options:

    -V, --version                            output the version number
    -e, --endpoint [url]                     API endpoint. Default: http://localhost:8080
    -k, --key [key]                          API Key to be used
    -d, --debug                              Turn on debug logging
    -h, --help                               output usage information

  CLI:

    configure                                Configure the CLI
    help          [cmd]                      display help for [cmd]

  Docker:

    docker    | d                            Docker specific commands.
    start                                    Start the Gentics Mesh server.    
    [cmd]   -p, --port [port]                Http port to be used  
    [cmd]   -t, --tag [tag]                  Tag / version to be used
    [cmd]   -i, --image [image]              Image to be used      

    stop                                     Stop the Gentics Mesh server.

  Administration:

    admin     | a                            Administration specific commands.
    reset         [uuid]                     Reset the error state of the job.

  Element:

    list      | l [type]                     List elements.
    remove    | rm [type] [id]               Remove element.
    add       | a [type] [name]              Add new element.
    get       | g [type] [id]                Get an element and return JSON.
    update    | u [type] [id]                Update an element.

  User:

    passwd    | p [name]                     Change the password of an user.    
    [cmd]   -u, --user [username]            Username              
    [cmd]   -p, --pass [password]            Password              

    chmod     | c [path]                     Change permissions of a role on the given path.    
    [cmd]   -r, --recursive                  Apply permission changes recursively

    key       | k [name]                     Generate a new API key for the user.

  Schema:

    validate  | v [type] [file]              Validate elements via stdin or file.
    link          [type] [project] [schema]  Link the microschema with a project.
    unlink        [type] [project] [schema]  Unlink the microschema from a project.



  Types:

  -  user,group,role,project,schema,microschema,tagfamily,job,plugin,branch

  Examples:

  -  Add a new project named demo2 to the system

    $ mesh add project demo2 --schema folder

  -  List all schemas that are linked to the demo project

    $ mesh list projectSchemas demo

  -  Short form to list all projects

    $ mesh l p

  -  Link the schema with the given uuid to the demo project

    $ mesh link schema demo 09ac57542fde43ccac57542fdeb3ccf8

  -  Unlink the folder schema from the demo project

    $ mesh unlink schema demo folder

```

## Open Tasks

* Add branches, branching
* Add linking schemas to branches
* Add recursive options to delete
* Add publish, unpublish commands
* Add language, branch option to node get
* Document sub commands
* Add examples to sub commands
