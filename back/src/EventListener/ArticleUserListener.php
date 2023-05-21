<?php

namespace App\EventListener;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use App\Entity\Forum;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleUserListener implements EventSubscriberInterface{
    public function __construct(
        private ManagerRegistry $managerRegistry,
        private TokenStorageInterface $tokenStorage
    ){
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setOwner', EventPriorities::PRE_WRITE]
        ];
    }
    
    public function setOwner(ViewEvent $event){
        $article = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        // Check the right method
        if($article instanceof Forum && (Request::METHOD_POST === $method || Request::METHOD_PATCH === $method || Request::METHOD_PUT === $method)){
            // Check if article exists
            if(!$this->managerRegistry->getRepository(User::class)->findOneBy(['id' => ($this->tokenStorage->getToken()->getUser())->getId()])){
                return;
            }
            $article->setCreatedBy($this->tokenStorage->getToken()->getUser());
        }
    }
}