import '/base-standard/ui/sub-system-dock/panel-sub-system-dock.js';
import {extendClass} from '/bobobunicorn-ui-tweaks/modules/ui/utils/extend.js';

const definition = Controls.getDefinition('panel-sub-system-dock');
const PanelSubSystemDock = definition.createInstance;

function createIconChip(buttonData) {
    const chip = document.createElement('div');
    {
        chip.setAttribute('data-tut-highlight', 'founderHighlight');
        Array.isArray(buttonData.class) ? chip.classList.add(...buttonData.class) : chip.classList.add(buttonData.class);
        const buttonIconBg = document.createElement('div');
        {
            buttonIconBg.classList.add('ssb__button-iconbg', buttonData.modifierClass);
        }
        chip.appendChild(buttonIconBg);
        const buttonIconBgHover = buttonIconBg.cloneNode();
        {
            buttonIconBgHover.classList.add('ssb__button-iconbg--hover');
        }
        chip.appendChild(buttonIconBgHover);
        const buttonIconBgActive = buttonIconBg.cloneNode();
        {
            buttonIconBgActive.classList.add('ssb__button-iconbg--active');
        }
        chip.appendChild(buttonIconBgActive);
        const buttonIconBgDisabled = buttonIconBg.cloneNode();
        {
            buttonIconBgDisabled.classList.add('ssb__button-iconbg--disabled');
        }
        chip.appendChild(buttonIconBgDisabled);
    }
    const buttonIcon = document.createElement('div');
    {
        buttonIcon.classList.add('ssb__button-icon', buttonData.modifierClass);
    }
    chip.appendChild(buttonIcon);
    return {chip, buttonIcon};
}

function findFieldIndex(obj, fieldName) {
    return Array.from({length: obj?.memberCount ?? 0}).map((_, i) => i).find(i => obj?.getMember(i).name === fieldName);
}

function getCurrentGoldenAge() {
    const allPlayers = ReflectionArchives.getPlayers().getChildren();
    const idIndex = findFieldIndex(allPlayers[0], 'm_id');
    const currentPlayer = allPlayers.find(player => player.getMemberValueString(idIndex) === String(GameContext.localPlayerID));
    const happiness = currentPlayer?.getChildren().find((child) => child.typeStr === 'PlayerHappiness');
    const goldenAgeIndex = findFieldIndex(happiness, 'm_eCurrentGoldenAge');
    const goldenAgeValue = happiness?.getMemberValueString(goldenAgeIndex);

    return GameInfo.GoldenAges.find(age => String(age.$index) === goldenAgeValue);
}

extendClass(PanelSubSystemDock, {
    onInitialize(ctx) {
        ctx.super();
        const turnCounter = document.createElement('div');
        turnCounter.classList.add('ssb-button__turn-counter');
        turnCounter.setAttribute('data-tut-highlight', 'founderHighlight');
        const turnCounterContent = document.createElement('div');
        turnCounterContent.classList.add('ssb-button__turn-counter-content', 'font-title-base');
        const turnCounterBg = document.createElement('div');
        turnCounterBg.classList.add('ssb-button__turn-counter-bg');
        turnCounter.appendChild(turnCounterBg);
        turnCounter.appendChild(turnCounterContent);

        const celebrationRing = this.createRing({
            class: 'ring-celebration',
            modifierClass: 'celebration',
        });
        celebrationRing.setAttribute('ring-class', 'ssb__texture-ring');

        const {chip: celebrationIcon, buttonIcon: celebrationButtonIcon} = createIconChip({
            modifierClass: 'celebration',
        });
        const iconGlow = document.createElement('div');
        iconGlow.classList.add('ssb-button__glow-bg', 'img-popup_icon_glow');
        celebrationIcon.appendChild(iconGlow);

        celebrationRing.appendChild(turnCounter);
        celebrationRing.appendChild(celebrationIcon)

        this.policiesButton.appendChild(celebrationRing);
        this.celebrationRing = celebrationRing;
        this.celebrationCounter = turnCounter;
        this.celebrationButtonIcon = celebrationButtonIcon;
        this.updateButtonTimers();
    },
    onAttach(ctx) {
        ctx.super();
        engine.on('TraditionSlotsAdded', this.onTraditionSlotsAdded, this);
    },
    onDetach(ctx) {
        engine.off('TraditionSlotsAdded', this.onTraditionSlotsAdded, this);
        ctx.super();
    },
    onTraditionSlotsAdded(ctx, data) {
        if (data.player && data.player != GameContext.localPlayerID) {
            //Not us, we don't need to update
            return;
        }
        this.updateCelebrationTimer();
    },
    updateCelebrationTimer(ctx) {
        ctx.super();
        if (!this.celebrationCounter || !this.celebrationRing) {
            return;
        }

        const localPlayer = Players.get(GameContext.localPlayerID);
        if (!localPlayer) {
            console.error('panel-sub-system-dock: createTraditionsTooltip() - No local player!');
            return;
        }
        const localPlayerHappiness = localPlayer.Happiness;
        if (localPlayerHappiness == undefined) {
            console.error('panel-sub-system-dock: createTraditionsTooltip() - No local player happiness!');
            return;
        }
        const localPlayerStats = localPlayer?.Stats;
        if (localPlayerStats === undefined) {
            console.error('panel-sub-system-dock: createTraditionsTooltip() - Local player stats is undefined!');
            return;
        }
        if (localPlayerHappiness.isInGoldenAge()) {
            const goldenAgeTurnsLeft = localPlayerHappiness.getGoldenAgeTurnsLeft();
            const goldenAgeDuration = localPlayerHappiness.getGoldenAgeDuration();
            const goldenAge = getCurrentGoldenAge();
            if (goldenAge) {
                this.celebrationButtonIcon.style.backgroundImage = `url("${UI.getIconURL(goldenAge.GoldenAgeType)}")`;
            }
            this.celebrationRing.setAttribute('value', (goldenAgeTurnsLeft / goldenAgeDuration * 100).toString());
            this.celebrationRing.classList.toggle('golden-age', true);
            this.updateTurnCounter(this.celebrationCounter, goldenAgeTurnsLeft);
            this.celebrationCounter.classList.toggle('text-secondary', true);
            this.policiesButton?.setAttribute("data-tooltip-content", `${Locale.compose("LOC_SUB_SYSTEM_TRADITIONS_TURNS_UNTIL_CELEBRATION_END", goldenAgeTurnsLeft)}[N]${goldenAge ? Locale.compose(goldenAge.Description, goldenAgeTurnsLeft) : ''}`);
        }
        else {
            const happinessPerTurn = localPlayerStats.getNetYield(YieldTypes.YIELD_HAPPINESS) ?? -1;
            const nextGoldenAgeThreshold = localPlayerHappiness.nextGoldenAgeThreshold;
            const happinessTotal = Math.ceil(localPlayerStats.getLifetimeYield(YieldTypes.YIELD_HAPPINESS)) ?? -1;
            const turnsToNextGoldenAge = Math.ceil((nextGoldenAgeThreshold - happinessTotal) / happinessPerTurn);
            this.celebrationButtonIcon.style.backgroundImage = null;
            this.celebrationRing.setAttribute('value', ((happinessTotal / nextGoldenAgeThreshold) * 100).toString());
            this.celebrationRing.classList.toggle('golden-age', false);
            this.updateTurnCounter(this.celebrationCounter, turnsToNextGoldenAge);
            this.celebrationCounter.classList.toggle('text-secondary', false);
        }
    },
    updateButtonTimers(ctx) {
        ctx.super();
        this.updateCelebrationTimer();
    },
});

definition.styles.push('fs://game/bobobunicorn-ui-tweaks/modules/ui/sub-system-dock.css');
