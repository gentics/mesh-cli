import { State } from './index';
import { MeshAPI } from 'mesh-api-client';
import cd from './completers/cd';
import defaultCompleter from './completers/default';

type Completer = (mesh: MeshAPI, line: string, cmd: string[], state: State) => Promise<[string[], string]>;
interface CompleterTable { [key: string]: Completer }
export const COMPLETERS: CompleterTable = {
    defaultCompleter: defaultCompleter,
    cd: cd
}
