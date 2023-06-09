import * as yup from 'yup';
import { performanceEvaluationValidationSchema } from 'validationSchema/performance-evaluations';
import { playerProfileValidationSchema } from 'validationSchema/player-profiles';
import { trainingSessionValidationSchema } from 'validationSchema/training-sessions';

export const academyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  tenant_id: yup.string().required(),
  user_id: yup.string().nullable().required(),
  performance_evaluation: yup.array().of(performanceEvaluationValidationSchema),
  player_profile: yup.array().of(playerProfileValidationSchema),
  training_session: yup.array().of(trainingSessionValidationSchema),
});
