import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { GetQueryInterface } from 'interfaces';

export interface PlayerProfileInterface {
  id?: string;
  player_id: string;
  academy_id: string;
  position: string;
  date_of_birth: Date | string;
  height: number;
  weight: number;
  created_at?: Date | string;
  updated_at?: Date | string;

  user?: UserInterface;
  academy?: AcademyInterface;
  _count?: {};
}

export interface PlayerProfileGetQueryInterface extends GetQueryInterface {
  id?: string;
  player_id?: string;
  academy_id?: string;
  position?: string;
}
