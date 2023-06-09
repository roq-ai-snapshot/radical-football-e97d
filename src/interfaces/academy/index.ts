import { PerformanceEvaluationInterface } from 'interfaces/performance-evaluation';
import { PlayerProfileInterface } from 'interfaces/player-profile';
import { TrainingSessionInterface } from 'interfaces/training-session';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AcademyInterface {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  user_id: string;
  tenant_id: string;
  performance_evaluation?: PerformanceEvaluationInterface[];
  player_profile?: PlayerProfileInterface[];
  training_session?: TrainingSessionInterface[];
  user?: UserInterface;
  _count?: {
    performance_evaluation?: number;
    player_profile?: number;
    training_session?: number;
  };
}

export interface AcademyGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  user_id?: string;
  tenant_id?: string;
}
