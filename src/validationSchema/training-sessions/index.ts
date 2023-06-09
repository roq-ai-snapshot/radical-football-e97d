import * as yup from 'yup';

export const trainingSessionValidationSchema = yup.object().shape({
  date: yup.date().required(),
  duration: yup.number().integer().required(),
  focus: yup.string().required(),
  player_id: yup.string().nullable().required(),
  coach_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
});
