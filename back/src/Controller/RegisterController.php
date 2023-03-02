<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mailer\MailerInterface;
use App\Security\EmailVerifier;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsController]
class RegisterController extends AbstractController
{
    public function __construct(
        private RequestStack $requestStack,
        private ManagerRegistry $managerRegistry,
        private MailerInterface $mailer,
        private UserPasswordHasherInterface $passwordHasher,
        private EmailVerifier $emailVerifie,
    ) {}

    public function __invoke()
    {
        $email = json_decode($this->requestStack->getCurrentRequest()->getContent())->email;        
        $username = json_decode($this->requestStack->getCurrentRequest()->getContent())->username;        
        if ($this->managerRegistry->getRepository(User::class)->findOneBy(['email' => $email, 'username' => $username])) {
            throw $this->createNotFoundException();
        }
        
        $user = (new User())
        ->setEmail($email)
        ->setUsername($username)
        ;
        
        $plainPwd = json_decode($this->requestStack->getCurrentRequest()->getContent())->password;        
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $plainPwd
        );
        $user->setPassword($hashedPassword);
        $user->setToken(bin2hex(random_bytes(32)));
        $user->eraseCredentials();
        $this->managerRegistry->getManager()->persist($user);
        $this->managerRegistry->getManager()->flush();
        
        $emailResponse = $this->emailVerifie->sendEmailConfirmation(
            $user,
            (new Email())
                ->from(new Address('from@example.com', 'Mailtrap'))
                ->to(new Address($email, $username))
                ->subject('Please Confirm your Email')
                // ->html("<h1>Bonjour, veuillez confirmer votre e-mail</h1>")
                // ->htmlTemplate('front/registration/confirmation_email.html.twig')json
        );
        return $this->json($username.' registered. Check your mail for validation('.$emailResponse.').');
    }
}