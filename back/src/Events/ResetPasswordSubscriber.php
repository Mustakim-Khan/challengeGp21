<?php

namespace App\Events;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class ResetPasswordSubscriber implements EventSubscriberInterface{
    public function __construct(
        private ManagerRegistry $managerRegistry,
        private UserPasswordHasherInterface $passwordHasher,
    ){
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['resetPwd', EventPriorities::PRE_WRITE]
        ];
    }
    
    public function resetPwd(ViewEvent $event){
        $user = $event->getControllerResult();
        
        // Check is user exists
        if(!$this->managerRegistry->getRepository(User::class)->findOneBy(['username' => $user->getUsername()])){
            return;
        }
        $method = $event->getRequest()->getMethod();

        // Check if it's User instance and the request method is right
        if($user instanceof User && (Request::METHOD_PATCH === $method || Request::METHOD_PUT === $method)){
            $plainPwd = $user->getPassword();
            // if($plainPwd){
            $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPwd);
            $user->setPassword($hashedPassword);
            // }
        }
    }
}