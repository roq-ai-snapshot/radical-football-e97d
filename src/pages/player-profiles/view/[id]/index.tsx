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
import { getPlayerProfileById } from 'apiSdk/player-profiles';
import { Error } from 'components/error';
import { PlayerProfileInterface } from 'interfaces/player-profile';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function PlayerProfileViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerProfileInterface>(
    () => (id ? `/player-profiles/${id}` : null),
    () =>
      getPlayerProfileById(id, {
        relations: ['user', 'academy'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Player Profile Detail View
          </Text>
          {hasAccess('player_profile', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/player-profiles/edit/${data?.id}`} passHref legacyBehavior>
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
                  Position:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.position}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Date Of Birth:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.date_of_birth as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Height:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.height}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Weight:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.weight}
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
              {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    Academy:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/academies/view/${data?.academy?.id}`}>
                      {data?.academy?.name}
                    </Link>
                  </Text>
                </Flex>
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
  entity: 'player_profile',
  operation: AccessOperationEnum.READ,
})(PlayerProfileViewPage);
