<?php

namespace App\Repository;

use App\Entity\TaskLists;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TaskLists>
 *
 * @method TaskLists|null find($id, $lockMode = null, $lockVersion = null)
 * @method TaskLists|null findOneBy(array $criteria, array $orderBy = null)
 * @method TaskLists[]    findAll()
 * @method TaskLists[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TaskListsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TaskLists::class);
    }

//    /**
//     * @return TaskLists[] Returns an array of TaskLists objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?TaskLists
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
