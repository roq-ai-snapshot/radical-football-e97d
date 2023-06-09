import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2 } from 'react-icons/fi';
import { getAcademyById } from 'apiSdk/academies';
import { Error } from 'components/error';
import { AcademyInterface } from 'interfaces/academy';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deletePerformanceEvaluationById } from 'apiSdk/performance-evaluations';
import { deletePlayerProfileById } from 'apiSdk/player-profiles';
import { deleteTrainingSessionById } from 'apiSdk/training-sessions';

function AcademyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AcademyInterface>(
    () => (id ? `/academies/${id}` : null),
    () =>
      getAcademyById(id, {
        relations: ['user', 'performance_evaluation', 'player_profile', 'training_session'],
      }),
  );

  const performance_evaluationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePerformanceEvaluationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const player_profileHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerProfileById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const training_sessionHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteTrainingSessionById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Academy Detail View
          </Text>
          {hasAccess('academy', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/academies/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Description:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.description}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Image:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.image}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Tenant Id:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.tenant_id}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    User:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                      {data?.user?.email}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('performance_evaluation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Performance Evaluations
                    </Text>
                    <NextLink passHref href={`/performance-evaluations/create?academy_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>date</Th>
                          <Th>rating</Th>
                          <Th>comment</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.performance_evaluation?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/performance-evaluations/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.date as unknown as string}</Td>
                            <Td>{record.rating}</Td>
                            <Td>{record.comment}</Td>
                            <Td>
                              {hasAccess(
                                'performance_evaluation',
                                AccessOperationEnum.UPDATE,
                                AccessServiceEnum.PROJECT,
                              ) && (
                                <NextLink passHref href={`/performance-evaluations/edit/${record.id}`}>
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess(
                                'performance_evaluation',
                                AccessOperationEnum.DELETE,
                                AccessServiceEnum.PROJECT,
                              ) && (
                                <IconButton
                                  onClick={() => performance_evaluationHandleDelete(record.id)}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('player_profile', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Player Profiles
                    </Text>
                    <NextLink passHref href={`/player-profiles/create?academy_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>position</Th>
                          <Th>date_of_birth</Th>
                          <Th>height</Th>
                          <Th>weight</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.player_profile?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/player-profiles/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.position}</Td>
                            <Td>{record.date_of_birth as unknown as string}</Td>
                            <Td>{record.height}</Td>
                            <Td>{record.weight}</Td>
                            <Td>
                              {hasAccess('player_profile', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink passHref href={`/player-profiles/edit/${record.id}`}>
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('player_profile', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={() => player_profileHandleDelete(record.id)}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('training_session', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Training Sessions
                    </Text>
                    <NextLink passHref href={`/training-sessions/create?academy_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>date</Th>
                          <Th>duration</Th>
                          <Th>focus</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.training_session?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/training-sessions/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.date as unknown as string}</Td>
                            <Td>{record.duration}</Td>
                            <Td>{record.focus}</Td>
                            <Td>
                              {hasAccess('training_session', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink passHref href={`/training-sessions/edit/${record.id}`}>
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('training_session', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={() => training_sessionHandleDelete(record.id)}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
            <Box></Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'academy',
  operation: AccessOperationEnum.READ,
})(AcademyViewPage);
