<?php

namespace App\DataFixtures;

use App\Entity\Clip;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ClipFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $users = $manager->getRepository(User::class)->findAll();

        for ($nbClip=0; $nbClip < 20; $nbClip++) { 
            $object = (new Clip())
                ->setTitle($faker->sentence(6, true))
                ->setPath('https://media.istockphoto.com/id/969555230/fr/vid%C3%A9o/asiatiques-jeunes-adultes-jouant-au-basketball-sur-cour-ext%C3%A9rieure.mp4?s=mp4-640x640-is&k=20&c=6_S-POjBTlYq4DxgXOMFyuCmHSqqYz7-rmRziGzAfpw=')
                ->setUploadedBy($faker->randomElement($users))
                ->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTimeBetween('-1 year', 'now')))
                ->setIsValid($faker->boolean(80))
            ;
            $manager->persist($object);   
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            UserFixtures::class
        ];
    }
}
