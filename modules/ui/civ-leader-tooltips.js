import '/core/ui/shell/create-panels/advanced-options-panel.js';
import {GetCivilizationData} from '/core/ui/shell/create-panels/age-civ-select-model.js';
import {extendClass} from '/bobobunicorn-ui-tweaks/modules/ui/utils/extend.js';
import {MPLobbyDataModel} from '/core/ui/shell/mp-staging/model-mp-staging-new.js';

function getCivAbilityText({civID}) {
	const civItemData = Database.query('config', 'select * from CivilizationItems order by SortIndex') ?? [];
    const ability = civItemData.find(item => item.CivilizationType == civID && item.Kind == "KIND_TRAIT");
    return Locale.compose(ability?.Description ?? '');
}

function getCivTooltip(civilization) {
    const abilityText = getCivAbilityText(civilization);
    return `
	[STYLE:text-secondary][STYLE:font-title-lg]${Locale.compose(civilization.name)}[/S][/S][N]
	${civilization.tags ? `[N][STYLE:text-accent]${Locale.compose(civilization.tags.join(", "))}[/S]` : ""}
	${civilization.abilityTitle ? `[N][B]${Locale.compose(civilization.abilityTitle)}[/B]` : ""}
	${abilityText ? `[N]${abilityText}` : ""}
	${civilization.bonuses?.length ? `[N][STYLE:text-secondary][STYLE:font-title-base]${Locale.compose("LOC_CREATE_CIV_UNIQUE_BONUSES_SUBTITLE")}[/S][/S]
		[N]${civilization.bonuses.map((bonus) => `[ICON:${bonus.icon}] [B]${Locale.compose(bonus.title)}[/B] ${Locale.compose(bonus.description)}`).join("[N]")}` : ""}`;
}

function getLeaderAbilityText({leaderID}) {
	const bonusItems = Database.query('config', 'select * from LeaderItems order by SortIndex') ?? [];
	const ability = bonusItems.find(item => item.LeaderType == leaderID && item.Kind == "KIND_TRAIT");
	return Locale.compose(ability?.Description ?? '');
}

function getLeaderTooltip(leader) {
    const abilityText = getLeaderAbilityText(leader);
    return `
	[STYLE:text-secondary][STYLE:font-title-lg]${Locale.compose(leader.name)}[/S][/S]
	${leader.tags ? `[N][STYLE:text-accent]${leader.tags.map(tag => `${Locale.compose(tag)}`).join(', ')}[/S]` : ""}
	${abilityText ? `[N]${abilityText}` : ""}
	`;
}

const definition = Controls.getDefinition('advanced-options-panel');
const AdvancedOptionsPanel = definition.createInstance;

extendClass(AdvancedOptionsPanel, {
    generateCivInfo(ctx) {
        ctx.super();
        for (let i = 0; i < this.civilizationData.length; i++) {
            this.civilizationOptions[i].tooltip = getCivTooltip(this.civilizationData[i]);
        }
    },
    generateLeaderInfo(ctx) {
        ctx.super();
        for (let i = 0; i < this.leaderData.length; i++) {
            this.leaderOptions[i].tooltip = getLeaderTooltip(this.leaderData[i]);
        }
    },
});

extendClass(MPLobbyDataModel, {
    getCivilizationTooltip(ctx, civilizationType, playerID) {
        const tooltip = getCivTooltip(this.civData.find(data => data.civID == civilizationType));
        this.cachedCivilizationTooltipFragments.set(civilizationType, tooltip);
        return ctx.super(civilizationType, playerID);
    },
    getLeaderTooltip(ctx, leaderType) {
        const tooltip = getLeaderTooltip(this.leaderData.find(data => data.leaderID === leaderType));
        this.cachedLeaderTooltips.set(leaderType, tooltip);
        return ctx.super(leaderType);
    }
});
