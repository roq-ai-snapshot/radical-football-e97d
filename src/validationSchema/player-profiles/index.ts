import * as yup from 'yup';

export const playerProfileValidationSchema = yup.object().shape({
  position: yup.string().required(),
  date_of_birth: yup.date().required(),
  height: yup.number().integer().required(),
  weight: yup.number().integer().required(),
  player_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
});
