<?php

namespace App\DataFixtures;

use App\Entity\TaskLists;
use App\Entity\Tasks;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ToDoListFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $this->addUsers($manager);

        $manager->flush();
    }

    private function addUsers(ObjectManager $manager)
    {
        $user1 = new User();
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user1,
            '123456789'
        );
        $user1->setPassword($hashedPassword)
              ->setEmail('mickael.sayer.dev@gmail.com')
              ->setPseudo('FreaksDev');
        $manager->persist($user1);

        $user2 = new User();
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user2,
            '123456789'
        );
        $user2->setPassword($hashedPassword)
              ->setEmail('m-iicka86@hotmail.fr')
              ->setPseudo('Freaks');
        $manager->persist($user2);

        $this->addTasks($manager, [$user1, $user2]);

        $manager->flush();
    }

    private function addTasks(ObjectManager $manager, array $users)
    {
        $task1 = new Tasks();
        $task1->setUser($users[0])
               ->setTitle('List of races');
        $manager->persist($task1);

        $task2 = new Tasks();
        $task2->setUser($users[0])
               ->setTitle('Development Project');
        $manager->persist($task2);

        $task3 = new Tasks();
        $task3->setUser($users[0])
               ->setTitle('morning routine');
        $manager->persist($task3);

        $task4 = new Tasks();
        $task4->setUser($users[1])
               ->setTitle('spring cleaning');
        $manager->persist($task4);

        $task5 = new Tasks();
        $task5->setUser($users[1])
               ->setTitle('Travel planning');
        $manager->persist($task5);

        $this->addTaskLists($manager, [$task1, $task2, $task3, $task4, $task5]);
    }

    private function addTaskLists(ObjectManager $manager, array $tasks)
    {
        $taskList1 = new TaskLists();
        $taskList1->setTask($tasks[0])
                  ->setName('Buy milk')
                  ->setChecked(true);
        $manager->persist($taskList1);

        $taskList2 = new TaskLists();
        $taskList2->setTask($tasks[1])
            ->setName('Implement X functionality')
            ->setChecked(true);
        $manager->persist($taskList2);

        $taskList21 = new TaskLists();
        $taskList21->setTask($tasks[1])
            ->setName('Write documentation')
            ->setChecked(true);
        $manager->persist($taskList21);

        $taskList22 = new TaskLists();
        $taskList22->setTask($tasks[1])
            ->setName('To exercise');
        $manager->persist($taskList22);

        $taskList3 = new TaskLists();
        $taskList3->setTask($tasks[2])
            ->setName('To exercice')
            ->setChecked(true);
        $manager->persist($taskList3);

        $taskList31 = new TaskLists();
        $taskList31->setTask($tasks[2])
            ->setName('Take a shower')
            ->setChecked(true);
        $manager->persist($taskList31);

        $taskList32 = new TaskLists();
        $taskList32->setTask($tasks[2])
            ->setName('Have breakfast');
        $manager->persist($taskList32);

        $taskList33 = new TaskLists();
        $taskList33->setTask($tasks[2])
            ->setName('To buy vegetables');
        $manager->persist($taskList33);

        $taskList4 = new TaskLists();
        $taskList4->setTask($tasks[3])
            ->setName('Wash the windows');
        $manager->persist($taskList4);

        $taskList41 = new TaskLists();
        $taskList41->setTask($tasks[3])
            ->setName('To vacuum');
        $manager->persist($taskList41);

        $taskList42 = new TaskLists();
        $taskList42->setTask($tasks[3])
            ->setName('Organize the closet');
        $manager->persist($taskList42);

        $taskList5 = new TaskLists();
        $taskList5->setTask($tasks[4])
            ->setName('Book plane tickets');
        $manager->persist($taskList5);

        $taskList51 = new TaskLists();
        $taskList51->setTask($tasks[4])
            ->setName('book the hotel');
        $manager->persist($taskList51);
    }
}
