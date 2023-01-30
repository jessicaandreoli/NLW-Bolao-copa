import Fastify from "fastify";
import { z } from "zod";
import cors from "@fastify/cors";
import { PrismaClient } from '@prisma/client';
import ShortUniqueId  from 'short-unique-id';

//aqui o prisma vai mostrar todas as querys criadas em nossa tabela.
const prisma = new PrismaClient({
  log: ['query'],
})

//criando o nosso servidor
async function bootstrap() {
  const fastify = Fastify({
    //o logger é p devolver td que acontece na aplicação. Se der algum erro dá p ver.
    logger:true,
  })

  //aqui estamos permitindo que qualquer aplicação acesse o nosso backend
  await fastify.register(cors, {
    origin: true,
  })

  //contagem bolões
  fastify.get('/pools/count', async() => {
    const count = await prisma.pool.count()
    return { count }
  })

  //contagem usuários
  fastify.get('/users/count', async() => {
    const count = await prisma.user.count()
    return { count }
  })

  //contagem palpites
  fastify.get('/guesses/count', async() => {
    const count = await prisma.guess.count()
    return { count }
  })

  fastify.post('/pools', async(request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    })
    const {title} = createPoolBody.parse(request.body)

    const generate = new ShortUniqueId({length: 6 })
    const code = String(generate()).toUpperCase()

    //criando bolão

    await prisma.pool.create({
      data: {
        title,
        code  
      }
    })

    return reply.status(201).send({code})
  })

  await fastify.listen({ port:3333, /*host: '0.0.0.0'*/ })
}

bootstrap()