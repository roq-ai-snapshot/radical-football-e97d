import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getTrainingSessions, deleteTrainingSessionById } from 'apiSdk/training-sessions';
import { TrainingSessionInterface } from 'interfaces/training-session';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function TrainingSessionListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<TrainingSessionInterface[]>(
    () => '/training-sessions',
    () =>
      getTrainingSessions({
        relations: ['user_training_session_player_idTouser', 'user_training_session_coach_idTouser', 'academy'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteTrainingSessionById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('training_session', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/training-sessions/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('training_session', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Flex justifyContent="space-between" mb={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold">
              Training Session
            </Text>
            <Link href={`/training-sessions/create`}>
              <Button colorScheme="blue" mr="4">
                Create
              </Button>
            </Link>
          </Flex>
        )}
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>date</Th>
                  <Th>duration</Th>
                  <Th>focus</Th>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_training_session_player_idTouser</Th>
                  )}
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_training_session_coach_idTouser</Th>
                  )}
                  {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>academy</Th>}

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.date as unknown as string}</Td>
                    <Td>{record.duration}</Td>
                    <Td>{record.focus}</Td>
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user_training_session_player_idTouser?.id}`}>
                          {record.user_training_session_player_idTouser?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user_training_session_coach_idTouser?.id}`}>
                          {record.user_training_session_coach_idTouser?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/academies/view/${record.academy?.id}`}>
                          {record.academy?.name}
                        </Link>
                      </Td>
                    )}

                    <Td>
                      {hasAccess('training_session', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/training-sessions/edit/${record.id}`} passHref legacyBehavior>
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
                      {hasAccess('training_session', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
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
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'training_session',
  operation: AccessOperationEnum.READ,
})(TrainingSessionListPage);
