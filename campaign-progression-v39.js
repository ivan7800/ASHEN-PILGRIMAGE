// ASHEN PILGRIMAGE v3.9 · Single authority for forward chamber gates.
// Pure, deterministic and save-format independent. Backtracking is always allowed.
import {canEnterValdren} from './valdren.js';
import {regionGate,canFaceKing} from './valdren-region.js';
import {canEnterForest} from './forest-region.js';
import {canEnterOssara} from './ossara-region.js';
import {canEnterOssaraInterior,canEnterArchiveBoss} from './ossara-v22.js';
import {canEnterSalmuera} from './salmuera-region.js';
import {canEnterDepths,tideGate} from './sea-v25.js';
import {canEnterRoots,canCrossRootGate} from './roots-v26.js';
import {canEnterSummit,canEnterSilentCloister} from './summit-v28.js';
import {canClimbHighSummit,canCrossEchoBridge,canEnterGiantSanctuary} from './summit-v29.js';
import {canEnterThrone,canEnterLastArchive,canEnterFinalSanctuary} from './final-throne-v30.js';

export function canTraverseForward(area, s) {
  if (!Number.isInteger(area) || area < 0 || area >= 34 || !s || typeof s !== 'object') return false;
  switch (area) {
    case 4: return canEnterValdren(s.chapterClear, s.wardenAlive);
    case 5: return regionGate(s.questStage);
    case 6: return canFaceKing(s.questStage,s.allegiance);
    case 7: return canEnterForest(s.regionClear,s.kingAlive);
    case 10: return s.forestStage===3;
    case 11: return canEnterOssara(s.forestClear,s.motherAlive);
    case 12: return canEnterOssaraInterior(s.ossaraStage);
    case 14: return canEnterArchiveBoss(s.ossaraStage,s.ossaraNames);
    case 15: return canEnterSalmuera(s.ossaraClear,s.archivistAlive);
    case 17: return canEnterDepths(s.salmueraStage);
    case 18: case 19: case 20: return tideGate(area,s.tideMode,s.seaEchoes);
    case 21: return canEnterRoots(s.seaClear,s.brideAlive);
    case 22: case 23: case 24: return canCrossRootGate(area,s.rootStage,s.rootRites);
    case 25: return canEnterSummit(s.rootClear,s.gardenerAlive);
    case 26: return canEnterSilentCloister(s.summitStage);
    case 27: return canClimbHighSummit(s.summitStage);
    case 28: return canCrossEchoBridge(s.summitResonances);
    case 29: return canEnterGiantSanctuary(s.summitResonances);
    case 30: return canEnterThrone(s.summitClear,s.giantAlive);
    case 31: return canEnterLastArchive(s.finalStage);
    case 33: return canEnterFinalSanctuary(s.solarSeals, [s.regionClear,s.forestClear,s.ossaraClear,s.seaClear,s.rootClear,s.summitClear]);
    default: return true;
  }
}
export function canTraversePortal(portal, grounded, area, progress) {
  return Boolean(portal && grounded && (portal.direction===-1 || (portal.direction===1 && canTraverseForward(area,progress))));
}
