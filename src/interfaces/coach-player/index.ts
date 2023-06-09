import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CoachPlayerInterface {
  id?: string;
  coach_id: string;
  player_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  user_coach_player_coach_idTouser?: UserInterface;
  user_coach_player_player_idTouser?: UserInterface;
  _count?: {};
}

export interface CoachPlayerGetQueryInterface extends GetQueryInterface {
  id?: string;
  coach_id?: string;
  player_id?: string;
}
