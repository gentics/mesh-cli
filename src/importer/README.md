# Imports a project from a local filestructure into Mesh
+ Imports Schemas & Microschemas
+ Creates or updates a project with a configurable name
+ Creates or updates a mesh-structure with a given directory/file-structure and the use of json files
+ Creates or updates tag families

## Info:
Basic Nodes must be defined as `<nodename>.json`, where the JSON-file contains the actual node-JSON (as you got / would get them from Mesh).
Container Nodes must be defined as a directory containing a json-file with the name `.mesh.node.json` that contains the node-information. The Name of the directory must be the name that would be the segment name in Mesh (ie. the webroot-path). 
In essence the directory-structure is the same as the webroot-structure will be on mesh.