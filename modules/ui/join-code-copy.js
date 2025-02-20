import {extendClass} from '/bobobunicorn-ui-tweaks/modules/ui/utils/extend.js';
import MPLobbyModel from '/core/ui/shell/mp-staging/model-mp-staging-new.js';
import '/core/ui/shell/mp-staging/mp-staging-new.js';

const definition = Controls.getDefinition('screen-mp-lobby');
const PanelMPLobby = definition.createInstance;

extendClass(PanelMPLobby, {
    showJoinCode(ctx, ev) {
        ctx.super(ev);
        if (this.joinCodeShown) {
            UI.setClipboardText(MPLobbyModel.joinCode);
        }
    },
});

