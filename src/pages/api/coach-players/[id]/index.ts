import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { coachPlayerValidationSchema } from 'validationSchema/coach-players';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.coach_player
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCoachPlayerById();
    case 'PUT':
      return updateCoachPlayerById();
    case 'DELETE':
      return deleteCoachPlayerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCoachPlayerById() {
    const data = await prisma.coach_player.findFirst(convertQueryToPrismaUtil(req.query, 'coach_player'));
    return res.status(200).json(data);
  }

  async function updateCoachPlayerById() {
    await coachPlayerValidationSchema.validate(req.body);
    const data = await prisma.coach_player.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCoachPlayerById() {
    const data = await prisma.coach_player.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
