import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { GetQueryInterface } from 'interfaces';

export interface TrainingSessionInterface {
  id?: string;
  player_id: string;
  coach_id: string;
  academy_id: string;
  date: Date | string;
  duration: number;
  focus: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  user_training_session_player_idTouser?: UserInterface;
  user_training_session_coach_idTouser?: UserInterface;
  academy?: AcademyInterface;
  _count?: {};
}

export interface TrainingSessionGetQueryInterface extends GetQueryInterface {
  id?: string;
  player_id?: string;
  coach_id?: string;
  academy_id?: string;
  focus?: string;
}
