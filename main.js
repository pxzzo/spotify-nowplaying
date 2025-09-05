import { initMap } from './src/ui/map.js';
import { initTheme } from './src/ui/theme.js';
import { initAuth } from './src/auth/auth.js';
import { initPanels } from './src/ui/panels.js';
import { restore } from './src/data/repository.js';
import { start as startClock } from './src/core/clock.js';
import { initDispatcher } from './src/sim/dispatcher.js';
import { initMissionEngine } from './src/sim/missionEngine.js';
import { startNotrufGenerator } from './src/sim/notrufGenerator.js';

restore();
initTheme();
initAuth();
initMap();
initPanels();
initDispatcher();
initMissionEngine();
startClock();
startNotrufGenerator();
