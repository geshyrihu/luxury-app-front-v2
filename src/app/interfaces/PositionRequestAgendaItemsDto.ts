import { EDecisionCandidadoReclutamiento } from '../enums/decision-candidado-reclutamiento';
import { EFuenteReclutamiento } from '../enums/fuente-reclutamiento';

export interface PositionRequestAgendaItemsDto {
  id: number;
  sendCandidate: boolean;
  positionRequestId: number;
  candidate: string;
  fuente: EFuenteReclutamiento;
  fuenteName: string;
  phone: string;
  curriculumn: string;
  date: string;
  comments: string;
  decision: EDecisionCandidadoReclutamiento | null;
}
