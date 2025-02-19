import '/base-standard/ui/diplo-ribbon/panel-diplo-ribbon.js';
import DiplomacyManager from '/base-standard/ui/diplomacy/diplomacy-manager.js';
import DiploRibbonData, {UpdateDiploRibbonEvent} from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';
import {extendModel} from '/bobobunicorn-ui-tweaks/modules/ui/utils/extend.js';

extendModel(DiploRibbonData, {
    createPlayerData(ctx, player, playerDiplomacy, isKnownPlayer, relationshipData) {
        const dataObj = ctx.super(player, playerDiplomacy, isKnownPlayer, relationshipData);
        if (isKnownPlayer) {
            if (relationshipData?.relationshipType === DiplomacyPlayerRelationships.PLAYER_RELATIONSHIP_NEUTRAL) {
                dataObj.relationshipIcon = 'fs://game/hud_quest_close_hi.png';
                dataObj.relationshipTooltip = relationshipData.relationshipTooltip;
            }
        }
        return dataObj;
    },
});
DiploRibbonData.updateAll();
