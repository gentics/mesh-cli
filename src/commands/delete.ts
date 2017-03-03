import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';

export async function deleteNode(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    await mesh.api.project(state.project).nodes.nodeUuid(cmd.params[0]).delete();
    return state;
}
