import * as yup from 'yup';

export const coachPlayerValidationSchema = yup.object().shape({
  coach_id: yup.string().nullable().required(),
  player_id: yup.string().nullable().required(),
});
