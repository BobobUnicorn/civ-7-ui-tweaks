import {Options} from '/core/ui/options/model-options.js';
import { CategoryType, OptionType } from '/core/ui/options/options-helpers.js';

const onCheckboxInit = (optionInfo) => {
    const option = UI.getOption(optionInfo.optionSet, optionInfo.optionType, optionInfo.optionName);
    if (typeof option === 'number') {
        const toggleVal = Boolean(option);
        optionInfo.currentValue = toggleVal;
    }
};
const onCheckboxUpdate = (optionInfo, value) => {
    if (optionInfo.optionSet && optionInfo.optionType && optionInfo.optionName) {
        UI.setOption(optionInfo.optionSet, optionInfo.optionType, optionInfo.optionName, (value ? 1 : 0));
    }
};

Options.addInitCallback(() => {
    Options.addOption({ category: CategoryType.Game, group: 'general', type: OptionType.Checkbox, id: "option-quick_combat", initListener: onCheckboxInit, updateListener: onCheckboxUpdate, label: "LOC_OPTIONS_QUICK_COMBAT", description: "LOC_OPTIONS_QUICK_COMBAT_DESCRIPTION", optionSet: "user", optionType: "Gameplay", optionName: "QuickCombat" });
    Options.addOption({ category: CategoryType.Game, group: 'general', type: OptionType.Checkbox, id: "option-quick_movement", initListener: onCheckboxInit, updateListener: onCheckboxUpdate, label: "LOC_OPTIONS_QUICK_MOVEMENT", description: "LOC_OPTIONS_QUICK_MOVEMENT_DESCRIPTION", optionSet: "user", optionType: "Gameplay", optionName: "QuickMovement" });
});
