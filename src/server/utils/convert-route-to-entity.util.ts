const mapping: Record<string, string> = {
  academies: 'academy',
  'coach-players': 'coach_player',
  'performance-evaluations': 'performance_evaluation',
  'player-profiles': 'player_profile',
  'training-sessions': 'training_session',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
