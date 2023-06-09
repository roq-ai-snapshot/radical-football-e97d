import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createPlayerProfile } from 'apiSdk/player-profiles';
import { Error } from 'components/error';
import { playerProfileValidationSchema } from 'validationSchema/player-profiles';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { getUsers } from 'apiSdk/users';
import { getAcademies } from 'apiSdk/academies';
import { PlayerProfileInterface } from 'interfaces/player-profile';

function PlayerProfileCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PlayerProfileInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPlayerProfile(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PlayerProfileInterface>({
    initialValues: {
      position: '',
      date_of_birth: new Date(new Date().toDateString()),
      height: 0,
      weight: 0,
      player_id: (router.query.player_id as string) ?? null,
      academy_id: (router.query.academy_id as string) ?? null,
    },
    validationSchema: playerProfileValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Player Profile
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="position" mb="4" isInvalid={!!formik.errors?.position}>
            <FormLabel>Position</FormLabel>
            <Input type="text" name="position" value={formik.values?.position} onChange={formik.handleChange} />
            {formik.errors.position && <FormErrorMessage>{formik.errors?.position}</FormErrorMessage>}
          </FormControl>
          <FormControl id="date_of_birth" mb="4">
            <FormLabel>Date Of Birth</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.date_of_birth}
              onChange={(value: Date) => formik.setFieldValue('date_of_birth', value)}
            />
          </FormControl>
          <FormControl id="height" mb="4" isInvalid={!!formik.errors?.height}>
            <FormLabel>Height</FormLabel>
            <NumberInput
              name="height"
              value={formik.values?.height}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('height', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.height && <FormErrorMessage>{formik.errors?.height}</FormErrorMessage>}
          </FormControl>
          <FormControl id="weight" mb="4" isInvalid={!!formik.errors?.weight}>
            <FormLabel>Weight</FormLabel>
            <NumberInput
              name="weight"
              value={formik.values?.weight}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('weight', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.weight && <FormErrorMessage>{formik.errors?.weight}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'player_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email as string}
              </option>
            )}
          />
          <AsyncSelect<AcademyInterface>
            formik={formik}
            name={'academy_id'}
            label={'Select Academy'}
            placeholder={'Select Academy'}
            fetcher={getAcademies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name as string}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player_profile',
  operation: AccessOperationEnum.CREATE,
})(PlayerProfileCreatePage);
