import '/core/ui/shell/create-panels/advanced-options-panel.js';
import {GetCivilizationData} from '/core/ui/shell/create-panels/age-civ-select-model.js';
import {extendClass} from '/bobobunicorn-ui-tweaks/modules/ui/utils/extend.js';

function getAbilityText({civID}) {
	const civItemData = Database.query('config', 'select * from CivilizationItems order by SortIndex') ?? [];
    const ability = civItemData.find(item => item.CivilizationType == civID && item.Kind == "KIND_TRAIT");
    return Locale.compose(ability?.Description ?? '');
}

function getCivTooltip(civilization) {
    const abilityText = getAbilityText(civilization);
    return `
	[STYLE:text-secondary][STYLE:font-title-lg]${Locale.compose(civilization.name)}[/S][/S][N]
	${civilization.tags ? `[N][B]${Locale.compose(civilization.tags.join(", "))}[/B]` : ""}
	${civilization.abilityTitle ? `[N][STYLE:text-secondary][STYLE:font-title-base]${Locale.compose(civilization.abilityTitle)}[/S][/S]` : ""}
	${abilityText ? `[N]${abilityText}` : ""}
	${civilization.bonuses?.length ? `[N][STYLE:text-secondary][STYLE:font-title-base]${Locale.compose("LOC_CREATE_CIV_UNIQUE_BONUSES_SUBTITLE")}[/S][/S]
		[N]${civilization.bonuses.map((bonus) => `[ICON:${bonus.icon}] [B]${Locale.compose(bonus.title)}[/B] ${Locale.compose(bonus.description)}`).join("[N]")}` : ""}`;
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
});
