import * as yup from 'yup';

export const performanceEvaluationValidationSchema = yup.object().shape({
  date: yup.date().required(),
  rating: yup.number().integer().required(),
  comment: yup.string(),
  player_id: yup.string().nullable().required(),
  coach_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
});
