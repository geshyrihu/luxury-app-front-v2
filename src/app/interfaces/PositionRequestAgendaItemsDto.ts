import { EDecisionCandidadoReclutamiento } from '../enums/EDecisionCandidadoReclutamiento';
import { EFuenteReclutamiento } from '../enums/EFuenteReclutamiento';

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
